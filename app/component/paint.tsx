import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export const Paint = ({ imgSrc, onValuePaint }: any) => {
  const canvasRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<any>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); // State to store image size
  const [imageFileSize, setImageFileSize] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.src = imgSrc;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      setImageSize({ width, height });

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      contextRef.current = context;
      context.drawImage(img, 0, 0, width, height);

      fetch(imgSrc)
        .then(response => response.blob())
        .then(blob => {
          const fileSizeInKB = Math.floor(blob.size / 1024); // Convert bytes to KB
          setImageFileSize(blob.size);
        });

    };
  }, [imgSrc]);

  const handleMouseDown = (e: any) => {
    const context: any = contextRef.current;
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const context: any = contextRef.current;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const handleMouseUp = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const handleTouchStart = (e: any) => {
    // e.preventDefault();
    const context: any = contextRef.current;
    const touch = e.touches[0];
    const { pageX, pageY } = touch;
    const { left, top } = canvasRef.current.getBoundingClientRect();
    const offsetX = pageX - left;
    const offsetY = pageY - top;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: any) => {
    // e.preventDefault();
    if (!isDrawing) return;
    const context: any = contextRef.current;
    const touch = e.touches[0];
    const { pageX, pageY } = touch;
    const { left, top } = canvasRef.current.getBoundingClientRect();
    const offsetX = pageX - left;
    const offsetY = pageY - top;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const handleTouchEnd = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/jpeg');
    onValuePaint(dataURL)
  };

  return (
    <div >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      <Button onClick={() => handleSaveImage()} className='mt-20'>Save Image</Button>
      <div>File Size: {imageFileSize} B</div>

    </div>
  );
};