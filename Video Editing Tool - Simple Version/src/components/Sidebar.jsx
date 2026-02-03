import React, { useState } from 'react';
import BackgroundSelector from './BackgroundSelector';
import './Sidebar.css';

const TYPOGRAPHY_STYLES = [
  { name: 'Inter Bold', font: 'Inter', weight: 700 },
  { name: 'Inter Black', font: 'Inter', weight: 900 },
  { name: 'Playfair', font: 'Playfair Display', weight: 700 },
  { name: 'Montserrat', font: 'Montserrat', weight: 600 },
  { name: 'Poppins', font: 'Poppins', weight: 600 },
  { name: 'Bebas Neue', font: 'Bebas Neue', weight: 400 },
  { name: 'Raleway', font: 'Raleway', weight: 700 },
];

const ANIMATIONS = [
  { name: 'Typing', value: 'typing' },
  { name: 'Fade In', value: 'fadeIn' },
  { name: 'Slide Up', value: 'slideUp' },
  { name: 'Slide Left', value: 'slideLeft' },
  { name: 'Scale', value: 'scale' },
  { name: 'Bounce', value: 'bounce' },
  { name: 'Glitch', value: 'glitch' },
  { name: 'Neon', value: 'neon' },
];

function Sidebar({ onAddElement, selectedElement, onUpdateElement, background, onBackgroundChange, elements, onSelectElement, onMoveElement, onDeleteElement }) {
  const [textInput, setTextInput] = useState('');
  const [chartData, setChartData] = useState('10,20,30,40,50');

  const getElementIcon = (type) => {
    switch(type) {
      case 'text': return '✍️';
      case 'chart': return '📊';
      case 'shape': return '⬜';
      default: return '📄';
    }
  };

  const getElementLabel = (element) => {
    if (element.type === 'text') return element.text.substring(0, 20);
    if (element.type === 'chart') return `${element.chartType} Chart`;
    if (element.type === 'shape') return `${element.shapeType} Shape`;
    return 'Element';
  };

  const addText = (style) => {
    if (!textInput.trim()) {
      alert('Please enter some text first!');
      return;
    }
    onAddElement('text', {
      text: textInput,
      font: style.font,
      weight: style.weight,
      size: 64,
      color: '#ffffff',
      x: 100,
      y: 200,
      animation: 'typing',
      duration: 2,
      rotation: 0,
      opacity: 1,
    });
    setTextInput('');
  };

  const addChart = (type) => {
    const values = chartData.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    if (values.length === 0) {
      alert('Please enter valid data (e.g., 10,20,30,40)');
      return;
    }
    onAddElement('chart', {
      chartType: type,
      data: values,
      x: 100,
      y: 800,
      width: 800,
      height: 400,
      color: '#4ade80',
      duration: 3,
      rotation: 0,
      opacity: 1,
    });
  };

  const addShape = (shapeType) => {
    onAddElement('shape', {
      shapeType,
      width: 200,
      height: 200,
      color: '#4ade80',
      x: 400,
      y: 800,
      borderRadius: 20,
      opacity: 0.8,
    });
  };

  return (
    <div className="sidebar">
      <h1>🎬 Video Editor</h1>
      
      <BackgroundSelector background={background} onBackgroundChange={onBackgroundChange} />
      
      <div className="section">
        <h3>✍️ Add Text</h3>
        <input
          type="text"
          placeholder="Enter your text..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && textInput.trim()) {
              addText(TYPOGRAPHY_STYLES[0]);
            }
          }}
          className="text-input"
        />
        <div className="typography-grid">
          {TYPOGRAPHY_STYLES.map(style => (
            <button
              key={style.name}
              onClick={() => addText(style)}
              className="typography-btn"
              style={{ fontFamily: style.font, fontWeight: style.weight }}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>📊 Add Chart</h3>
        <input
          type="text"
          placeholder="Data: 10,20,30,40"
          value={chartData}
          onChange={(e) => setChartData(e.target.value)}
          className="text-input"
        />
        <div className="chart-buttons">
          <button onClick={() => addChart('bar')} className="btn">📊 Bar Chart</button>
          <button onClick={() => addChart('line')} className="btn">📈 Line Chart</button>
          <button onClick={() => addChart('pie')} className="btn">🥧 Pie Chart</button>
        </div>
      </div>

      <div className="section">
        <h3>⬜ Add Shape</h3>
        <div className="chart-buttons">
          <button onClick={() => addShape('rectangle')} className="btn">Rectangle</button>
          <button onClick={() => addShape('circle')} className="btn">Circle</button>
          <button onClick={() => addShape('rounded')} className="btn">Rounded</button>
        </div>
      </div>

      {selectedElement && (
        <div className="section">
          <h3>Properties</h3>
          {selectedElement.type === 'text' && (
            <>
              <label>
                Font Size
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={selectedElement.size}
                  onChange={(e) => onUpdateElement(selectedElement.id, { size: parseInt(e.target.value) })}
                />
                <span>{selectedElement.size}px</span>
              </label>
              <label>
                Color
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                />
              </label>
              <label>
                Animation
                <select
                  value={selectedElement.animation}
                  onChange={(e) => onUpdateElement(selectedElement.id, { animation: e.target.value })}
                >
                  {ANIMATIONS.map(anim => (
                    <option key={anim.value} value={anim.value}>{anim.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Duration (seconds)
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={selectedElement.duration}
                  onChange={(e) => onUpdateElement(selectedElement.id, { duration: parseFloat(e.target.value) })}
                />
              </label>
              <label>
                Opacity
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedElement.opacity || 1}
                  onChange={(e) => onUpdateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                />
                <span>{Math.round((selectedElement.opacity || 1) * 100)}%</span>
              </label>
            </>
          )}
          {selectedElement.type === 'chart' && (
            <>
              <label>
                Chart Color
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                />
              </label>
              <label>
                Width
                <input
                  type="range"
                  min="200"
                  max="1000"
                  value={selectedElement.width}
                  onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                />
                <span>{selectedElement.width}px</span>
              </label>
              <label>
                Height
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={selectedElement.height}
                  onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                />
                <span>{selectedElement.height}px</span>
              </label>
            </>
          )}
          {selectedElement.type === 'shape' && (
            <>
              <label>
                Shape Color
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                />
              </label>
              <label>
                Width
                <input
                  type="range"
                  min="50"
                  max="800"
                  value={selectedElement.width}
                  onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                />
                <span>{selectedElement.width}px</span>
              </label>
              <label>
                Height
                <input
                  type="range"
                  min="50"
                  max="800"
                  value={selectedElement.height}
                  onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                />
                <span>{selectedElement.height}px</span>
              </label>
              <label>
                Opacity
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedElement.opacity || 1}
                  onChange={(e) => onUpdateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                />
                <span>{Math.round((selectedElement.opacity || 1) * 100)}%</span>
              </label>
              {selectedElement.shapeType === 'rounded' && (
                <label>
                  Border Radius
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedElement.borderRadius || 20}
                    onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) })}
                  />
                  <span>{selectedElement.borderRadius || 20}px</span>
                </label>
              )}
            </>
          )}
          <button 
            onClick={() => {
              if (window.confirm('Delete this element?')) {
                onDeleteElement(selectedElement.id);
              }
            }}
            className="btn delete-btn"
            style={{ background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' }}
          >
            🗑 Delete Element
          </button>
        </div>
      )}

      <div className="section">
        <h3>📚 Layers ({elements.length})</h3>
        {elements.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
            No elements yet. Add text, charts, or shapes!
          </p>
        ) : (
          <div className="layers-list">
            {[...elements].reverse().map((element, index) => (
              <div
                key={element.id}
                className={`layer-item ${selectedElement?.id === element.id ? 'active' : ''}`}
                onClick={() => onSelectElement(element.id)}
              >
                <span className="layer-icon">{getElementIcon(element.type)}</span>
                <span className="layer-label">{getElementLabel(element)}</span>
                <div className="layer-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveElement(element.id, 'up');
                    }}
                    title="Move up"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveElement(element.id, 'down');
                    }}
                    title="Move down"
                    disabled={index === elements.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this element?')) {
                        onDeleteElement(element.id);
                      }
                    }}
                    className="delete-layer-btn"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
