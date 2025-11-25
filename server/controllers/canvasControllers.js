import { v4 as uuidv4 } from 'uuid';
import { createCanvas, loadImage } from 'canvas';

// <canvasId, { width, height, elements: [ {id, type, x, y, ...} ] }>
const canvasStore = new Map();



export function initializeController(req, res) {
  const { width, height } = req.body;
  const id = uuidv4();

  canvasStore.set(id, { 
    width: parseInt(width) || 800, 
    height: parseInt(height) || 600, 
    elements: [] 
  });

  res.json({ canvasId: id });
}

const getCanvasState = (id) => canvasStore.get(id);

export function addShape(req, res) {
  const { id } = req.params; 
  const state = getCanvasState(id);
  
  if (!state) return res.status(404).json({ error: 'Canvas not found' });

  const newElement = {
    id: uuidv4(),
    ...req.body 
  };

  console.log(req.body);

  

  state.elements.push(newElement);

  console.log(state);
  
  res.json({ success: true, element: newElement });
}

export function updateShape(req, res) {
  const { id } = req.params; 
  const state = getCanvasState(id);
  if (!state) return res.status(404).json({ error: 'Canvas not found' });

  const { elementId, ...updates } = req.body;

  const elementIndex = state.elements.findIndex(el => el.id === elementId);
  if (elementIndex === -1) {
    return res.status(404).json({ error: 'Element not found' });
  }

  state.elements[elementIndex] = { ...state.elements[elementIndex], ...updates };

  res.json({ success: true, element: state.elements[elementIndex] });
}

export function deleteShape(req, res) {
  const { id } = req.params;
  const state = getCanvasState(id);
  if (!state) return res.status(404).json({ error: 'Canvas not found' });

  const { elementId } = req.body;
  
  const initialLength = state.elements.length;
  state.elements = state.elements.filter(el => el.id !== elementId);

  if (state.elements.length === initialLength) {
    return res.status(404).json({ error: 'Element not found' });
  }

  res.json({ success: true, message: 'Deleted' });
}


export async function generatePDF(req, res) {
  const { id } = req.params;
  const state = getCanvasState(id);

  if (!state) return res.status(404).send('Canvas not found');
  console.log(state);
  try {
    const canvas = createCanvas(state.width, state.height, 'pdf');
    const ctx = canvas.getContext('2d');

    for (const el of state.elements) {
      ctx.save();
      
      if (el.color) ctx.fillStyle = el.color;
      if (el.fill) ctx.fillStyle = el.fill; 
      
      switch (el.type) {
        case  'rect':
          console.log(el);
          ctx.fillRect(el.x, el.y, el.w || el.width, el.h || el.height);
          break;

        case 'circle':
          ctx.beginPath();
          const r = el.r || el.radius || 20; 
          ctx.arc(el.x, el.y, r, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'text':
          ctx.font = el.font || '20px Arial';
          ctx.fillText(el.text, el.x, el.y);
          break;

        case 'image':
          try {
            const img = await loadImage(el.src);
            console.log(img.width);
            if (img.width > 500) {
            const tempCanvas = createCanvas(el.w* 2, el.h * 2); 
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCtx.drawImage(img, 0, 0, el.w * 2, el.h * 2);
            
            ctx.drawImage(tempCanvas, el.x, el.y, el.w, el.h);
            
          } else {
            ctx.drawImage(img, el.x, el.y, el.w, el.h);
          }



          } catch (err) {
            console.error('Error loading image for PDF:', err);
            // Draw placeholder if image fails
            ctx.fillStyle = '#ccc';
            ctx.fillRect(el.x, el.y, el.w || el.width, el.h || el.height);
            ctx.fillStyle = '#000';
            ctx.fillText('Image Error', el.x, el.y + 20);
          }
          break;
      }
      ctx.restore();
    }

    const buffer = canvas.toBuffer('application/pdf');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=canvas-${id}.pdf`);
    res.send(buffer);

  } catch (error) {
    console.error("PDF Generation failed:", error);
    res.status(500).send("Failed to generate PDF");
  }
}

export function getCanvas(req, res) {
  const { id } = req.params;
  const state = canvasStore.get(id);

  if (!state) {
    return res.status(404).json({ error: 'Canvas not found' });
  }

  res.json({
    canvasId: id,
    width: state.width,
    height: state.height,
    elements: state.elements
  });
}