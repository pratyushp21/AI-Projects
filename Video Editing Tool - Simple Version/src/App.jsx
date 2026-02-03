import React, { useState } from 'react';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [background, setBackground] = useState('linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)');
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addElement = (type, config = {}) => {
    const newElement = {
      id: Date.now(),
      type,
      ...config,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    saveHistory(newElements);
  };

  const updateElement = (id, updates) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setElements(newElements);
    saveHistory(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    if (selectedElement === id) setSelectedElement(null);
    saveHistory(newElements);
  };

  const saveHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const moveElement = (id, direction) => {
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;
    
    const newElements = [...elements];
    if (direction === 'up' && index < elements.length - 1) {
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    } else if (direction === 'down' && index > 0) {
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
    }
    setElements(newElements);
    saveHistory(newElements);
  };

  return (
    <div className="app">
      <Sidebar 
        onAddElement={addElement}
        selectedElement={elements.find(el => el.id === selectedElement)}
        onUpdateElement={updateElement}
        background={background}
        onBackgroundChange={setBackground}
        elements={elements}
        onSelectElement={setSelectedElement}
        onMoveElement={moveElement}
        onDeleteElement={deleteElement}
      />
      <Editor 
        elements={elements}
        selectedElement={selectedElement}
        onSelectElement={setSelectedElement}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
        isExporting={isExporting}
        setIsExporting={setIsExporting}
        background={background}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
    </div>
  );
}

export default App;
