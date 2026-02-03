// Editor State Management
export class EditorState {
    constructor() {
        this.elements = [];
        this.selectedElement = null;
        this.duration = 10; // seconds
        this.currentTime = 0;
        this.isPlaying = false;
        this.playStartTime = 0;
        this.playStartTimestamp = 0;
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;
        this.listeners = {};

        // Background settings
        this.backgroundColor = '#0a0a0f';
        this.backgroundGradient = false;
        this.backgroundGradientEnd = '#1a1a2e';

        this.exportSettings = {
            quality: '1080',
            fps: 30,
            includeAudio: true
        };

        // Element ID counter
        this.elementIdCounter = 0;
    }

    // Event system
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // Element management
    addElement(element) {
        element.id = ++this.elementIdCounter;
        element.startTime = element.startTime || 0;
        element.duration = element.duration || this.duration;
        this.elements.push(element);
        this.saveHistory();
        this.emit('elementsChange', this.elements);
        return element;
    }

    removeElement(element) {
        const index = this.elements.findIndex(e => e.id === element.id);
        if (index !== -1) {
            this.elements.splice(index, 1);
            this.saveHistory();
            this.emit('elementsChange', this.elements);
        }
    }

    updateElement(id, updates) {
        const element = this.elements.find(e => e.id === id);
        if (element) {
            Object.assign(element, updates);
            this.emit('elementsChange', this.elements);
        }
    }

    getElement(id) {
        return this.elements.find(e => e.id === id);
    }

    // Selection
    selectElement(element) {
        this.selectedElement = element;
        this.emit('selectionChange', element);
    }

    // Playback
    play() {
        this.isPlaying = true;
        this.playStartTimestamp = performance.now();
        this.playStartTime = this.currentTime;
        this.emit('playbackChange', { isPlaying: true });
    }

    pause() {
        this.isPlaying = false;
        this.currentTime = this.getCurrentTime();
        this.emit('playbackChange', { isPlaying: false });
    }

    getCurrentTime() {
        if (!this.isPlaying) return this.currentTime;
        const elapsed = (performance.now() - this.playStartTimestamp) / 1000;
        return Math.min(this.playStartTime + elapsed, this.duration);
    }

    setCurrentTime(time) {
        this.currentTime = Math.max(0, Math.min(time, this.duration));
        if (!this.isPlaying) {
            this.emit('timeChange', this.currentTime);
        }
    }

    setDuration(duration) {
        this.duration = Math.max(1, Math.min(60, duration));
        this.emit('durationChange', this.duration);
    }

    // History (Undo/Redo)
    saveHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.stringify(this.elements));
        this.historyIndex = this.history.length - 1;

        // Limit history
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.elements = JSON.parse(this.history[this.historyIndex]);
            this.emit('elementsChange', this.elements);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.elements = JSON.parse(this.history[this.historyIndex]);
            this.emit('elementsChange', this.elements);
        }
    }

    // Reset
    reset() {
        this.elements = [];
        this.selectedElement = null;
        this.currentTime = 0;
        this.isPlaying = false;
        this.history = [];
        this.historyIndex = -1;
        this.elementIdCounter = 0;
        this.emit('elementsChange', this.elements);
        this.emit('selectionChange', null);
    }

    // Serialize for export
    serialize() {
        return {
            elements: this.elements,
            duration: this.duration,
            exportSettings: this.exportSettings
        };
    }
}
