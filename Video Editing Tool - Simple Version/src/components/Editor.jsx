import React, { useRef, useEffect, useState } from 'react';
import TextElement from './TextElement';
import ChartElement from './ChartElement';
import ShapeElement from './ShapeElement';
import './Editor.css';

function Editor({ elements, selectedElement, onSelectElement, onUpdateElement, onDeleteElement, isExporting, setIsExporting, background, onUndo, onRedo, canUndo, canRedo }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startExport = async () => {
    if (elements.length === 0) {
      alert('Please add some elements before exporting!');
      return;
    }

    setIsExporting(true);
    setIsPlaying(true);
    setCurrentTime(0);

    // Calculate total duration
    const maxDuration = Math.max(...elements.map(el => el.duration || 3), 5);
    const totalDuration = maxDuration * 1000;

    // Use html2canvas approach for better quality
    const preview = document.querySelector('.preview');
    if (!preview) return;

    try {
      const { default: html2canvas } = await import('html2canvas');
      
      const stream = preview.captureStream ? preview.captureStream(30) : 
                     await navigator.mediaDevices.getUserMedia({ video: false });
      
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      
      const captureStream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(captureStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000,
      });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setIsPlaying(false);
        setCurrentTime(0);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      // Capture frames
      const fps = 30;
      const interval = 1000 / fps;
      let frameCount = 0;
      const maxFrames = (totalDuration / 1000) * fps;

      const captureFrame = async () => {
        if (frameCount >= maxFrames) {
          mediaRecorder.stop();
          return;
        }

        const canvasData = await html2canvas(preview, {
          width: 1080,
          height: 1920,
          scale: 1,
          backgroundColor: null,
        });

        ctx.drawImage(canvasData, 0, 0, 1080, 1920);
        frameCount++;
        
        setTimeout(captureFrame, interval);
      };

      captureFrame();
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
      setIsPlaying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selectedElement) {
      onDeleteElement(selectedElement);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(t => t + 0.033);
      }, 33);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="editor">
      <div className="toolbar">
        <button onClick={() => { setIsPlaying(!isPlaying); setCurrentTime(0); }} className="toolbar-btn">
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button 
          onClick={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }} 
          className="toolbar-btn"
        >
          ⏹ Stop
        </button>
        <button onClick={onUndo} className="toolbar-btn" disabled={!canUndo}>
          ↶ Undo
        </button>
        <button onClick={onRedo} className="toolbar-btn" disabled={!canRedo}>
          ↷ Redo
        </button>
        <button onClick={startExport} className="toolbar-btn export" disabled={isExporting || elements.length === 0}>
          {isExporting ? '⏳ Exporting...' : '⬇ Export Video'}
        </button>
        <span className="time">⏱ {currentTime.toFixed(1)}s</span>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className="canvas"
          onClick={() => onSelectElement(null)}
        />
        <div className="preview" style={{ background }}>
          {elements.map(element => (
            <div
              key={element.id}
              className={`element ${selectedElement === element.id ? 'selected' : ''}`}
              style={{
                left: element.x,
                top: element.y,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement(element.id);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (selectedElement !== element.id) return;
                
                const preview = e.currentTarget.parentElement;
                const rect = preview.getBoundingClientRect();
                const scale = 0.3; // Match preview scale
                
                const startX = (e.clientX - rect.left) / scale - element.x;
                const startY = (e.clientY - rect.top) / scale - element.y;

                const handleMove = (moveEvent) => {
                  const newX = Math.max(0, Math.min(1080 - 100, (moveEvent.clientX - rect.left) / scale - startX));
                  const newY = Math.max(0, Math.min(1920 - 100, (moveEvent.clientY - rect.top) / scale - startY));
                  
                  onUpdateElement(element.id, {
                    x: Math.round(newX),
                    y: Math.round(newY),
                  });
                };

                const handleUp = () => {
                  document.removeEventListener('mousemove', handleMove);
                  document.removeEventListener('mouseup', handleUp);
                };

                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleUp);
              }}
            >
              {element.type === 'text' && (
                <TextElement element={element} currentTime={currentTime} isPlaying={isPlaying} />
              )}
              {element.type === 'chart' && (
                <ChartElement element={element} />
              )}
              {element.type === 'shape' && (
                <ShapeElement element={element} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Editor;
