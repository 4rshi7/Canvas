
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/';




 export default function useCanvas( id) {
  // const [width, setWidth] = useState(800);
  // const [height, setHeight] = useState(600);

  const canvasRef = useRef(null);
  const [canvasId, setCanvasId] = useState(id);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const imageCache = useRef({});
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const nav = useNavigate();
  
  const [dragInfo, setDragInfo] = useState({ 
    isDragging: false, startX: 0, startY: 0, initialElX: 0, initialElY: 0 
  });
  // setting up canvas size
  useEffect(() => {
    if (!canvasId) return;

    const fetchCanvasData = async () => {
      try {
        const response = await axios.get(`${API_BASE}canvas/${canvasId}`);
        
        setCanvasSize({
          width: response.data.width,
          height: response.data.height
        });
        
        setElements(response.data.elements || []); 
        
      } catch (error) {
        console.error('Failed to load canvas data:', error);
      }
    };
    fetchCanvasData();
  }, [id]);

  // painting the canvas 
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach(el => {
      ctx.save();
      if (el.type === 'rect' || el.type === 'rectangle') {
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.w, el.h);
      } else if (el.type === 'circle') {
        ctx.fillStyle = el.color;
        ctx.beginPath();
        const r = el.r || el.radius;
        ctx.arc(el.x, el.y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.type === 'text') {
        ctx.font = el.font;
        ctx.fillStyle = el.color;
        ctx.fillText(el.text, el.x, el.y);
      } else if (el.type === 'image') {
        const img = imageCache.current[el.id];
        if (img) {
          ctx.drawImage(img, el.x, el.y, el.w, el.h);
        } else {
          const newImg = new window.Image();
          newImg.src = el.src;
          newImg.onload = () => {
            imageCache.current[el.id] = newImg;
            setElements(prev => [...prev]);
          };
        }
      }

      if (selectedId === el.id) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        if (el.type === 'circle') {
            const r = el.r || el.radius;
            ctx.beginPath();
            ctx.arc(el.x, el.y, r + 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (el.type === 'text') {
            const metrics = ctx.measureText(el.text);
            ctx.strokeRect(el.x - 2, el.y - 20, metrics.width + 4, 24);
        } else {
            ctx.strokeRect(el.x - 2, el.y - 2, el.w + 4, el.h + 4);
        }
      }
      ctx.restore();
    });
  }, [elements, selectedId]);

  // adding elements 
  const addElementToCanvas = async (payload) => {
    if (!canvasId) return alert("Canvas not initialized");
    try {
      const res = await axios.post(`${API_BASE}canvas/${canvasId}/shapes`, payload);
      if (res.data.success) setElements(prev => [...prev, res.data.element]);
    } catch (err) { console.error('Failed to add', err); }
  };

  // deleting elements 
  const deleteSelected = async () => {
    if (!selectedId || !canvasId) return;
    try {
      await axios.delete(`${API_BASE}canvas/${canvasId}/shapes/${selectedId}`, { data: { elementId: selectedId } });
      setElements(elements.filter(el => el.id !== selectedId));
      setSelectedId(null);
    } catch (err) { console.error('Failed to delete', err); }
  };

  const downloadPDF = () => {
    if (canvasId) window.open(`${API_BASE}canvas/${canvasId}/pdf`, '_blank');
  };


  const actions = {
    addRect: () => addElementToCanvas({ type: 'rect', x: 50, y: 50, w: 100, h: 100, color: '#ef4444' }),
    addCircle: () => addElementToCanvas({ type: 'circle', x: 200, y: 100, radius: 50, color: '#3b82f6' }),
    addImage: (src) => addElementToCanvas({ type: 'image', x: 300, y: 200, w: 100, h: 100, src: src || 'https://placehold.co/100x100' }),
    addText: (text) => addElementToCanvas({ type: 'text', x: 100, y: 300, text: text, font: '24px Arial', color: '#000' }),
    deleteSelected,
    downloadPDF
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const isHit = (x, y, el) => {
    if (el.type === 'rect' || el.type === 'rectangle' || el.type === 'image') {
      return x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h;
    } else if (el.type === 'circle') {
      const r = el.r || el.radius;
      return Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2) <= r;
    } else if (el.type === 'text') {
      return x >= el.x && x <= el.x + 100 && y >= el.y - 20 && y <= el.y + 5;
    }
    return false;
  };

  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);
    const clickedElement = [...elements].reverse().find(el => isHit(x, y, el));
    if (clickedElement) {
      setSelectedId(clickedElement.id);
      setDragInfo({ isDragging: true, startX: x, startY: y, initialElX: clickedElement.x, initialElY: clickedElement.y });
    } else {
      setSelectedId(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragInfo.isDragging || !selectedId) return;
    const { x, y } = getMousePos(e);
    const dx = x - dragInfo.startX;
    const dy = y - dragInfo.startY;
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, x: dragInfo.initialElX + dx, y: dragInfo.initialElY + dy } : el));
  };

  const handleMouseUp = async (e) => {
    if (dragInfo.isDragging && selectedId && canvasId) {
      const { x, y } = getMousePos(e);
      const dx = x - dragInfo.startX;
      const dy = y - dragInfo.startY;
      if (dx !== 0 || dy !== 0) {
        try {
          await axios.put(`${API_BASE}canvas/${canvasId}/shapes/${selectedId}`, {
            elementId: selectedId,
            x: dragInfo.initialElX + dx,
            y: dragInfo.initialElY + dy
          });
          console.log('Position synced');
        } catch (err) { console.error('Failed to sync', err); }
      }
    }
    setDragInfo({ ...dragInfo, isDragging: false });
  };

  return {
    canvasSize,
    canvasRef,
    selectedId,
    actions,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp
    }
  };
};