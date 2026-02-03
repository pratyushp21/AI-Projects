import React from 'react';
import './BackgroundSelector.css';

const BACKGROUNDS = [
  { name: 'Purple Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Blue Gradient', value: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)' },
  { name: 'Pink Gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Green Gradient', value: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)' },
  { name: 'Orange Gradient', value: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)' },
  { name: 'Dark', value: '#1a1a1a' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
];

function BackgroundSelector({ background, onBackgroundChange }) {
  return (
    <div className="background-selector">
      <h3>Background</h3>
      <div className="bg-grid">
        {BACKGROUNDS.map(bg => (
          <button
            key={bg.name}
            className={`bg-option ${background === bg.value ? 'active' : ''}`}
            style={{ background: bg.value }}
            onClick={() => onBackgroundChange(bg.value)}
            title={bg.name}
          />
        ))}
      </div>
    </div>
  );
}

export default BackgroundSelector;
