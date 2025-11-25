import CanvasArea from "../components/CanvasArea";
import Sidebar from "../components/Sidebar";
import  useCanvas  from "../hooks/useCanvas";
import { useState } from "react";
import { useParams } from "react-router";

const Canvas = () =>{

  const { id } = useParams();
  
  const { canvasSize, canvasRef, selectedId, actions, handlers } = useCanvas(id);
  const [textInputOpen, setTextInputOpen] = useState(false);
  const [textValue, setTextValue] = useState("");


  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState('url'); 

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      actions.addImage(imageUrl);
      setImageUrl("");
      setImageModalOpen(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
    if (file.size > maxSizeInBytes) {
      alert("File size exceeds 1 MB limit.");
      return;
    }


    // change this later maybe 
    // For this demo: Convert to Base64 to display immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      actions.addImage(event.target.result);
      setImageModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textValue.trim()) {
      actions.addText(textValue);
      setTextValue("");
      setTextInputOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      <Sidebar
        actions={actions} 
        selectedId={selectedId} 
        openTextModal={() => setTextInputOpen(true)} 
        openImageModal={()=>setImageModalOpen(true)}
      />
      
      <CanvasArea
        canvasSize={canvasSize}
        canvasRef={canvasRef} 
        handlers={handlers} 
      />

      {textInputOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-8 rounded shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Add Text</h3>
                 <button onClick={() => setTextInputOpen(false)}></button>
              </div>
              <form onSubmit={handleTextSubmit} className='flex flex-col'>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Enter your text..." 
                  className="p-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={textValue} 
                  onChange={(e) => setTextValue(e.target.value)} 
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setTextInputOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Text</button>
                </div>
              </form>
           </div>
        </div>
      )}

{imageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded shadow-lg w-lg">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Add Image</h3>
                 <button onClick={() => setImageModalOpen(false)}></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button 
                  className={`flex-1 py-2 text-center ${activeTab === 'url' ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('url')}
                >
                  By URL
                </button>
                <button 
                  className={`flex-1 py-2 text-center ${activeTab === 'upload' ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('upload')}
                >
                  Upload File
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'url' ? (
                <form onSubmit={handleUrlSubmit} className='flex flex-col'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input 
                    type="url" 
                    className="p-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setImageModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Image</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <p className="text-sm text-gray-500 mb-4">Click below to select an image from your system</p>
                  <p className="text-xs text-gray-400 mb-4">Max file size: 1 MB</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100
                    "
                  />
                </div>
              )}
           </div>
        </div>
      )}




    </div>
  );
};

export default Canvas