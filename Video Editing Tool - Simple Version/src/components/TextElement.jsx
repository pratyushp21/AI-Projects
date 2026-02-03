import React, { useState, useEffect } from 'react';
import './TextElement.css';

function TextElement({ element, currentTime, isPlaying }) {
  const [displayText, setDisplayText] = useState('');
  const { text, font, weight, size, color, animation, duration } = element;

  useEffect(() => {
    if (!isPlaying) {
      setDisplayText(text);
      return;
    }

    if (animation === 'typing') {
      const charsToShow = Math.floor((currentTime / duration) * text.length);
      setDisplayText(text.substring(0, charsToShow));
    } else {
      setDisplayText(text);
    }
  }, [currentTime, isPlaying, text, animation, duration]);

  const getAnimationClass = () => {
    if (!isPlaying) return '';
    if (currentTime > duration) return '';
    return `animate-${animation}`;
  };

  return (
    <div
      className={`text-element ${getAnimationClass()}`}
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: `${size}px`,
        color: color,
        animationDuration: `${duration}s`,
        opacity: element.opacity || 1,
      }}
    >
      {displayText || text}
      {animation === 'typing' && isPlaying && displayText.length < text.length && (
        <span className="cursor">|</span>
      )}
    </div>
  );
}

export default TextElement;
