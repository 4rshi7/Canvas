const Sidebar = ({ actions, selectedId, openTextModal, openImageModal }) => {
  return (
    <div className="w-64 bg-white p-4 border-r flex flex-col gap-3 shadow-lg z-10">
      <h2 className="font-bold text-lg mb-2 text-gray-700">Canvas Tools</h2>
      <button onClick={actions.addRect} className="flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"> Rectangle</button>
      <button onClick={actions.addCircle} className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"> Circle</button>
      <button onClick={openTextModal} className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"> Text</button>
      <button onClick={openImageModal} className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg"> Image</button>
      
      <div className="grow"></div>
      
      <div className="border-t pt-4 flex flex-col gap-2">
         <button onClick={actions.downloadPDF} className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg"> Export PDF</button>
        {selectedId && <button onClick={actions.deleteSelected} className="flex items-center justify-center gap-2 p-3 bg-red-600 text-white rounded-lg"> Delete</button>}
      </div>
    </div>
  );
};

export default Sidebar;