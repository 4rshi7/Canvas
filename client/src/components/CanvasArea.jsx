const CanvasArea = ({ canvasSize,canvasRef, handlers, height, width }) => {
  return (
    <div className="grow bg-gray-200 p-8 overflow-auto flex justify-center items-start">
      <div className="relative bg-white rounded-lg shadow-2xl border-4 border-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          {...handlers} 
          className=""
        />
      </div>
    </div>
  );
};

export default CanvasArea;