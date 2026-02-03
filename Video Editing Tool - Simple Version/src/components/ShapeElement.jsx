import React from 'react';
import './ShapeElement.css';

function ShapeElement({ element }) {
  const { shapeType, width, height, color, borderRadius, opacity } = element;

  const getShapeStyle = () => {
    const baseStyle = {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: color,
      opacity: opacity || 1,
    };

    switch (shapeType) {
      case 'circle':
        return { ...baseStyle, borderRadius: '50%' };
      case 'rounded':
        return { ...baseStyle, borderRadius: `${borderRadius || 20}px` };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeft: `${width / 2}px solid transparent`,
          borderRight: `${width / 2}px solid transparent`,
          borderBottom: `${height}px solid ${color}`,
          opacity: opacity || 1,
        };
      default:
        return baseStyle;
    }
  };

  return <div className="shape-element" style={getShapeStyle()} />;
}

export default ShapeElement;
