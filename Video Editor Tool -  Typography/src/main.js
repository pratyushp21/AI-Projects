// InstaVid Editor - Main Entry Point
import './style.css';
import { EditorState } from './editor/state.js';
import { Canvas } from './editor/canvas.js';
import { Timeline } from './editor/timeline.js';
import { ElementPanel } from './editor/elementPanel.js';
import { PropertiesPanel } from './editor/propertiesPanel.js';
import { SoundManager } from './audio/soundManager.js';
import { VideoExporter } from './export/videoExporter.js';

// Initialize the application
class InstaVidEditor {
  constructor() {
    this.state = new EditorState();
    this.canvas = null;
    this.timeline = null;
    this.elementPanel = null;
    this.propertiesPanel = null;
    this.soundManager = null;
    this.exporter = null;

    this.init();
  }

  async init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }

    // Initialize sound manager
    this.soundManager = new SoundManager();

    // Initialize canvas
    this.canvas = new Canvas(this.state, this.soundManager);

    // Initialize timeline
    this.timeline = new Timeline(this.state, this.canvas);

    // Initialize panels
    this.elementPanel = new ElementPanel(this.state, this.canvas);
    this.propertiesPanel = new PropertiesPanel(this.state, this.canvas);

    // Initialize exporter
    this.exporter = new VideoExporter(this.state, this.canvas, this.soundManager);

    // Set up event listeners
    this.setupEventListeners();

    // Initial canvas render
    this.canvas.render();

    // Show welcome toast
    this.showToast('success', 'Welcome!', 'Start by adding elements from the left panel');

    console.log('InstaVid Editor initialized');
  }

  setupEventListeners() {
    // New project button
    const newProjectBtn = document.getElementById('newProjectBtn');
    if (newProjectBtn) {
      newProjectBtn.addEventListener('click', () => this.newProject());
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.openExportModal());
    }

    // Zoom controls
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.canvas.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.canvas.zoomOut());

    // Play button
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlayback());
    }

    // Duration control
    const durationInput = document.getElementById('videoDuration');
    if (durationInput) {
      durationInput.addEventListener('change', (e) => {
        this.state.setDuration(parseInt(e.target.value, 10));
        this.timeline.updateRuler();
      });
    }

    // Background color picker
    const bgColorPicker = document.getElementById('bgColorPicker');
    if (bgColorPicker) {
      bgColorPicker.addEventListener('input', (e) => {
        this.state.backgroundColor = e.target.value;
        this.canvas.render();
      });
    }

    // Export modal events
    this.setupExportModal();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // State change listeners
    this.state.on('selectionChange', () => {
      this.propertiesPanel.update();
      this.canvas.render();
    });

    this.state.on('elementsChange', () => {
      this.timeline.update();
      this.canvas.render();
    });
  }

  setupExportModal() {
    const modal = document.getElementById('exportModal');
    const closeBtn = document.getElementById('closeExportModal');
    const cancelBtn = document.getElementById('cancelExport');
    const startBtn = document.getElementById('startExport');
    const backdrop = modal?.querySelector('.modal-backdrop');

    const closeModal = () => modal?.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Quality buttons
    const qualityBtns = modal?.querySelectorAll('[data-quality]');
    qualityBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        qualityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.exportSettings.quality = btn.dataset.quality;
      });
    });

    // FPS buttons
    const fpsBtns = modal?.querySelectorAll('[data-fps]');
    fpsBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        fpsBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.exportSettings.fps = parseInt(btn.dataset.fps, 10);
      });
    });

    // Start export
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startExport());
    }
  }

  newProject() {
    if (confirm('Start a new project? All unsaved changes will be lost.')) {
      this.state.reset();
      this.canvas.render();
      this.timeline.update();
      this.propertiesPanel.update();
      this.showToast('success', 'New Project', 'Canvas cleared');
    }
  }

  openExportModal() {
    const modal = document.getElementById('exportModal');
    const progress = document.getElementById('exportProgress');
    const options = document.getElementById('exportOptions');

    if (progress) progress.classList.remove('active');
    if (options) options.style.display = 'flex';
    modal?.classList.add('active');
  }

  async startExport() {
    const progress = document.getElementById('exportProgress');
    const options = document.getElementById('exportOptions');
    const progressCircle = document.getElementById('progressCircle');
    const progressText = document.getElementById('progressText');
    const progressStatus = document.getElementById('progressStatus');

    if (options) options.style.display = 'none';
    if (progress) progress.classList.add('active');

    try {
      await this.exporter.export((percent, status) => {
        // Update progress UI
        const offset = 339.292 - (339.292 * percent / 100);
        if (progressCircle) progressCircle.style.strokeDashoffset = offset;
        if (progressText) progressText.textContent = `${Math.round(percent)}%`;
        if (progressStatus) progressStatus.textContent = status;
      });

      this.showToast('success', 'Export Complete', 'Video saved to Downloads');
      document.getElementById('exportModal')?.classList.remove('active');
    } catch (error) {
      console.error('Export error:', error);
      this.showToast('error', 'Export Failed', error.message);
      if (options) options.style.display = 'flex';
      if (progress) progress.classList.remove('active');
    }
  }

  togglePlayback() {
    const playIcon = document.getElementById('playIcon');

    if (this.state.isPlaying) {
      this.state.pause();
      if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    } else {
      this.state.play();
      if (playIcon) playIcon.innerHTML = '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>';
      this.animate();
    }
  }

  animate() {
    if (!this.state.isPlaying) return;

    const currentTime = this.state.getCurrentTime();
    const duration = this.state.duration;

    // Update time display
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
      const current = Math.floor(currentTime);
      timeDisplay.textContent = `0:${current.toString().padStart(2, '0')} / 0:${duration.toString().padStart(2, '0')}`;
    }

    // Update playhead
    this.timeline.updatePlayhead(currentTime);

    // Render canvas with current time
    this.canvas.render(currentTime);

    // Check if finished
    if (currentTime >= duration) {
      this.state.pause();
      this.state.setCurrentTime(0);
      const playIcon = document.getElementById('playIcon');
      if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      return;
    }

    requestAnimationFrame(() => this.animate());
  }

  handleKeyboard(e) {
    // Space - Play/Pause
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      this.togglePlayback();
    }

    // Delete - Remove selected element
    if ((e.code === 'Delete' || e.code === 'Backspace') && !e.target.matches('input, textarea')) {
      if (this.state.selectedElement) {
        this.state.removeElement(this.state.selectedElement);
        this.state.selectElement(null);
      }
    }

    // Ctrl/Cmd + Z - Undo
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
      e.preventDefault();
      this.state.undo();
      this.canvas.render();
    }

    // Ctrl/Cmd + S - Save (prevent default)
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
      e.preventDefault();
      this.showToast('success', 'Saved', 'Project saved locally');
    }

    // Escape - Deselect
    if (e.code === 'Escape') {
      this.state.selectElement(null);
    }
  }

  showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${type === 'success' ? '<svg width="20" height="20" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>' : ''}
        ${type === 'warning' ? '<svg width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>' : ''}
        ${type === 'error' ? '<svg width="20" height="20" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>' : ''}
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'toastSlideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Start the application
new InstaVidEditor();
