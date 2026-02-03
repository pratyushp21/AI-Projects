// Timeline Component
export class Timeline {
    constructor(state, canvas) {
        this.state = state;
        this.canvas = canvas;
        this.container = document.getElementById('trackContainer');
        this.layersContainer = document.getElementById('timelineLayers');
        this.ruler = document.getElementById('timelineRuler');
        this.playhead = document.getElementById('playhead');

        this.pixelsPerSecond = 100;
        this.isDraggingPlayhead = false;

        this.init();
    }

    init() {
        this.updateRuler();
        this.update();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Playhead dragging
        if (this.playhead) {
            this.playhead.style.pointerEvents = 'auto';
            this.playhead.addEventListener('mousedown', (e) => {
                this.isDraggingPlayhead = true;
                e.preventDefault();
            });
        }

        document.addEventListener('mousemove', (e) => {
            if (this.isDraggingPlayhead) {
                const rect = this.container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const time = Math.max(0, Math.min(x / this.pixelsPerSecond, this.state.duration));
                this.state.setCurrentTime(time);
                this.updatePlayhead(time);
                this.canvas.render(time);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDraggingPlayhead = false;
        });

        // Click on timeline to seek
        if (this.container) {
            this.container.addEventListener('click', (e) => {
                if (e.target === this.container || e.target.classList.contains('timeline-track')) {
                    const rect = this.container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const time = Math.max(0, Math.min(x / this.pixelsPerSecond, this.state.duration));
                    this.state.setCurrentTime(time);
                    this.updatePlayhead(time);
                    this.canvas.render(time);
                }
            });
        }
    }

    updateRuler() {
        if (!this.ruler) return;

        this.ruler.innerHTML = '';
        const width = this.state.duration * this.pixelsPerSecond;
        this.ruler.style.width = `${width}px`;

        // Create marks every 0.5 seconds
        for (let i = 0; i <= this.state.duration * 2; i++) {
            const mark = document.createElement('div');
            mark.className = `ruler-mark ${i % 2 === 0 ? 'major' : ''}`;
            mark.style.left = `${(i / 2) * this.pixelsPerSecond}px`;

            if (i % 2 === 0) {
                mark.textContent = `${i / 2}s`;
            }

            this.ruler.appendChild(mark);
        }

        // Update container width
        if (this.container) {
            this.container.style.width = `${width}px`;
        }
    }

    update() {
        this.updateLayers();
        this.updateTracks();
    }

    updateLayers() {
        if (!this.layersContainer) return;

        this.layersContainer.innerHTML = '';

        this.state.elements.forEach((element, index) => {
            const layer = document.createElement('div');
            layer.className = `timeline-layer ${this.state.selectedElement?.id === element.id ? 'active' : ''}`;
            layer.innerHTML = `
        <span class="layer-icon">
          ${this.getLayerIcon(element.type)}
        </span>
        <span class="layer-name">${element.name || element.type}</span>
        <button class="layer-visibility" title="Toggle visibility">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      `;

            layer.addEventListener('click', () => {
                this.state.selectElement(element);
                this.update();
            });

            this.layersContainer.appendChild(layer);
        });
    }

    updateTracks() {
        if (!this.container) return;

        // Remove existing tracks (keep ruler)
        const existingTracks = this.container.querySelectorAll('.timeline-track');
        existingTracks.forEach(track => track.remove());

        this.state.elements.forEach((element, index) => {
            const track = document.createElement('div');
            track.className = 'timeline-track';

            const clip = document.createElement('div');
            clip.className = `track-clip ${this.state.selectedElement?.id === element.id ? 'selected' : ''}`;
            clip.style.left = `${element.startTime * this.pixelsPerSecond}px`;
            clip.style.width = `${element.duration * this.pixelsPerSecond}px`;
            clip.textContent = element.name || element.type;

            clip.addEventListener('click', (e) => {
                e.stopPropagation();
                this.state.selectElement(element);
                this.update();
            });

            track.appendChild(clip);
            this.container.appendChild(track);
        });
    }

    updatePlayhead(time) {
        if (!this.playhead) return;
        this.playhead.style.left = `${time * this.pixelsPerSecond}px`;
    }

    getLayerIcon(type) {
        switch (type) {
            case 'text':
            case 'heading':
            case 'subheading':
            case 'body':
            case 'caption':
            case 'quote':
            case 'stat':
                return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`;
            case 'bar-chart':
            case 'line-chart':
            case 'pie-chart':
            case 'donut-chart':
                return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`;
            case 'counter':
            case 'progress':
                return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>`;
            default:
                return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`;
        }
    }
}
