// Properties Panel - Edit selected element
export class PropertiesPanel {
  constructor(state, canvas) {
    this.state = state;
    this.canvas = canvas;
    this.container = document.getElementById('propertiesContent');

    this.fonts = [
      { name: 'Inter', family: 'Inter' },
      { name: 'Outfit', family: 'Outfit' },
      { name: 'Poppins', family: 'Poppins' },
      { name: 'Space Mono', family: 'Space Mono' },
      { name: 'Playfair', family: 'Playfair Display' },
      { name: 'Bebas', family: 'Bebas Neue' }
    ];

    this.animations = [
      { name: 'None', value: 'none' },
      { name: 'Fade', value: 'fade' },
      { name: 'Slide Up', value: 'slide-up' },
      { name: 'Slide Down', value: 'slide-down' },
      { name: 'Slide Left', value: 'slide-left' },
      { name: 'Slide Right', value: 'slide-right' },
      { name: 'Scale', value: 'scale' },
      { name: 'Zoom In', value: 'zoom-in' },
      { name: 'Zoom Out', value: 'zoom-out' },
      { name: 'Rotate', value: 'rotate' },
      { name: 'Typewriter', value: 'typewriter' },
      { name: 'Type Slow', value: 'typewriter-slow' },
      { name: 'Type Fast', value: 'typewriter-fast' },
      { name: 'Glitch', value: 'glitch' },
      { name: 'Bounce', value: 'bounce' },
      { name: 'Wave', value: 'wave' },
      { name: 'Blur In', value: 'blur-in' },
      { name: 'Focus', value: 'focus' },
      { name: 'Shake', value: 'shake' },
      { name: 'Flip', value: 'flip' },
      { name: 'Pop', value: 'pop' },
      { name: 'Rainbow', value: 'rainbow' }
    ];

    this.textStyles = [
      { name: 'Solid', value: 'solid' },
      { name: 'Outline', value: 'outline' },
      { name: 'Outline Fill', value: 'outline-fill' },
      { name: 'Gradient', value: 'gradient' },
      { name: 'Neon', value: 'neon' },
      { name: 'Rainbow', value: 'rainbow' }
    ];

    this.init();
  }

  init() {
    this.update();

    // Listen for selection changes
    this.state.on('selectionChange', () => this.update());
  }

  update() {
    if (!this.container) return;

    const element = this.state.selectedElement;

    if (!element) {
      this.container.innerHTML = `
        <div class="no-selection">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" opacity="0.5">
            <path d="M15 15l6 6m-11-3a8 8 0 110-16 8 8 0 010 16z"/>
          </svg>
          <p>Select an element to edit its properties</p>
        </div>
      `;
      return;
    }

    let html = '';

    // Text properties
    if (this.isTextElement(element.type)) {
      html += this.renderTextProperties(element);
    }

    // Chart properties
    if (this.isChartElement(element.type)) {
      html += this.renderChartProperties(element);
    }

    // Counter properties
    if (element.type === 'counter') {
      html += this.renderCounterProperties(element);
    }

    // Progress properties
    if (element.type === 'progress') {
      html += this.renderProgressProperties(element);
    }

    // Shape properties
    if (this.isShapeElement(element.type)) {
      html += this.renderShapeProperties(element);
    }

    // Position & Size (all elements)
    html += this.renderPositionProperties(element);

    // Animation (all elements)
    html += this.renderAnimationProperties(element);

    // Timing
    html += this.renderTimingProperties(element);

    this.container.innerHTML = html;
    this.setupEventListeners(element);
  }

  isTextElement(type) {
    return ['text', 'heading', 'subheading', 'body', 'caption', 'quote', 'stat'].includes(type);
  }

  isChartElement(type) {
    return ['bar-chart', 'line-chart', 'pie-chart', 'donut-chart'].includes(type);
  }

  isShapeElement(type) {
    return ['rectangle', 'circle', 'line', 'arrow'].includes(type);
  }

  renderTextProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Text</span>
        </div>
        <div class="property-row">
          <textarea id="prop-text" rows="3">${element.text || ''}</textarea>
        </div>
      </div>
      
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Typography</span>
        </div>
        <div class="property-row">
          <label>Font</label>
          <div class="font-selector">
            ${this.fonts.map(font => `
              <button class="font-option ${element.fontFamily === font.family ? 'active' : ''}" 
                      data-font="${font.family}"
                      style="font-family: '${font.family}', sans-serif">
                ${font.name}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="property-row">
          <label>Size</label>
          <input type="number" id="prop-fontSize" value="${element.fontSize || 48}" min="12" max="300" />
        </div>
        <div class="property-row">
          <label>Weight</label>
          <select id="prop-fontWeight">
            <option value="300" ${element.fontWeight === 300 ? 'selected' : ''}>Light</option>
            <option value="400" ${element.fontWeight === 400 ? 'selected' : ''}>Regular</option>
            <option value="500" ${element.fontWeight === 500 ? 'selected' : ''}>Medium</option>
            <option value="600" ${element.fontWeight === 600 ? 'selected' : ''}>Semibold</option>
            <option value="700" ${element.fontWeight === 700 ? 'selected' : ''}>Bold</option>
            <option value="800" ${element.fontWeight === 800 ? 'selected' : ''}>Extrabold</option>
            <option value="900" ${element.fontWeight === 900 ? 'selected' : ''}>Black</option>
          </select>
        </div>
        <div class="property-row">
          <label>Color</label>
          <input type="color" id="prop-color" value="${element.color || '#ffffff'}" />
        </div>
        <div class="property-row">
          <label>Align</label>
          <select id="prop-textAlign">
            <option value="left" ${element.textAlign === 'left' ? 'selected' : ''}>Left</option>
            <option value="center" ${element.textAlign === 'center' ? 'selected' : ''}>Center</option>
            <option value="right" ${element.textAlign === 'right' ? 'selected' : ''}>Right</option>
          </select>
        </div>
        <div class="property-row">
          <label>Spacing</label>
          <input type="number" id="prop-letterSpacing" value="${element.letterSpacing || 0}" min="-10" max="50" />
        </div>
        <div class="property-row">
          <label>Shadow</label>
          <label class="toggle">
            <input type="checkbox" id="prop-shadow" ${element.shadow ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Text Style</span>
        </div>
        <div class="property-row">
          <div class="style-selector">
            ${this.textStyles.map(style => `
              <button class="style-option ${element.textStyle === style.value ? 'active' : ''}" 
                      data-style="${style.value}">
                ${style.name}
              </button>
            `).join('')}
          </div>
        </div>
        ${element.textStyle === 'gradient' ? `
        <div class="property-row">
          <label>Start</label>
          <input type="color" id="prop-gradientStart" value="${element.gradientStart || element.color || '#6366f1'}" />
        </div>
        <div class="property-row">
          <label>End</label>
          <input type="color" id="prop-gradientEnd" value="${element.gradientEnd || '#a855f7'}" />
        </div>
        ` : ''}
        ${element.textStyle === 'outline' || element.textStyle === 'outline-fill' ? `
        <div class="property-row">
          <label>Stroke</label>
          <input type="number" id="prop-outlineWidth" value="${element.outlineWidth || 3}" min="1" max="10" />
        </div>
        ` : ''}
        ${element.textStyle === 'outline-fill' ? `
        <div class="property-row">
          <label>Outline</label>
          <input type="color" id="prop-outlineColor" value="${element.outlineColor || '#000000'}" />
        </div>
        ` : ''}
      </div>
    `;
  }

  renderChartProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Chart Data</span>
        </div>
        <button class="btn btn-ghost" style="width: 100%" id="editChartData">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Data
        </button>
      </div>
    `;
  }

  renderCounterProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Counter</span>
        </div>
        <div class="property-row">
          <label>Start</label>
          <input type="number" id="prop-startValue" value="${element.startValue || 0}" />
        </div>
        <div class="property-row">
          <label>End</label>
          <input type="number" id="prop-endValue" value="${element.endValue || 1000000}" />
        </div>
        <div class="property-row">
          <label>Prefix</label>
          <input type="text" id="prop-prefix" value="${element.prefix || ''}" placeholder="$, €, etc." />
        </div>
        <div class="property-row">
          <label>Suffix</label>
          <input type="text" id="prop-suffix" value="${element.suffix || ''}" placeholder="+, %, K, M" />
        </div>
      </div>
      
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Typography</span>
        </div>
        <div class="property-row">
          <label>Font</label>
          <select id="prop-fontFamily">
            ${this.fonts.map(font => `
              <option value="${font.family}" ${element.fontFamily === font.family ? 'selected' : ''}>
                ${font.name}
              </option>
            `).join('')}
          </select>
        </div>
        <div class="property-row">
          <label>Size</label>
          <input type="number" id="prop-fontSize" value="${element.fontSize || 100}" min="24" max="300" />
        </div>
        <div class="property-row">
          <label>Color</label>
          <input type="color" id="prop-color" value="${element.color || '#ffffff'}" />
        </div>
      </div>
    `;
  }

  renderProgressProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Progress</span>
        </div>
        <div class="property-row">
          <label>Value</label>
          <input type="range" id="prop-value" value="${element.value || 75}" min="0" max="100" />
          <span style="min-width: 40px; text-align: right">${element.value || 75}%</span>
        </div>
        <div class="property-row">
          <label>Height</label>
          <input type="number" id="prop-height" value="${element.height || 24}" min="8" max="100" />
        </div>
        <div class="property-row">
          <label>Label</label>
          <label class="toggle">
            <input type="checkbox" id="prop-showLabel" ${element.showLabel !== false ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    `;
  }

  renderShapeProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Shape</span>
        </div>
        <div class="property-row">
          <label>Fill Color</label>
          <input type="color" id="prop-color" value="${element.color || '#6366f1'}" />
        </div>
        ${element.type === 'rectangle' ? `
        <div class="property-row">
          <label>Radius</label>
          <input type="number" id="prop-cornerRadius" value="${element.cornerRadius || 0}" min="0" max="100" />
        </div>
        ` : ''}
        ${['line', 'arrow'].includes(element.type) ? `
        <div class="property-row">
          <label>Stroke</label>
          <input type="number" id="prop-strokeWidth" value="${element.strokeWidth || 4}" min="1" max="20" />
        </div>
        ` : ''}
      </div>
    `;
  }

  renderPositionProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Position & Size</span>
        </div>
        <div class="property-row">
          <label>X</label>
          <input type="number" id="prop-x" value="${Math.round(element.x)}" min="0" max="1080" />
        </div>
        <div class="property-row">
          <label>Y</label>
          <input type="number" id="prop-y" value="${Math.round(element.y)}" min="0" max="1920" />
        </div>
        <div class="property-row">
          <label>Width</label>
          <input type="number" id="prop-width" value="${Math.round(element.width)}" min="10" max="1080" />
        </div>
        <div class="property-row">
          <label>Height</label>
          <input type="number" id="prop-heightPos" value="${Math.round(element.height)}" min="10" max="1920" />
        </div>
      </div>
    `;
  }

  renderAnimationProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Animation</span>
        </div>
        <div class="property-row">
          <div class="animation-selector">
            ${this.animations.map(anim => `
              <button class="animation-option ${element.animation === anim.value ? 'active' : ''}"
                      data-animation="${anim.value}">
                ${anim.name}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="property-row">
          <label>Duration</label>
          <input type="number" id="prop-animDuration" value="${element.animationDuration || 1}" 
                 min="0.1" max="5" step="0.1" />
          <span>sec</span>
        </div>
      </div>
    `;
  }

  renderTimingProperties(element) {
    return `
      <div class="property-group">
        <div class="property-group-header">
          <span class="property-group-title">Timing</span>
        </div>
        <div class="property-row">
          <label>Start</label>
          <input type="number" id="prop-startTime" value="${element.startTime || 0}" 
                 min="0" max="${this.state.duration}" step="0.1" />
          <span>sec</span>
        </div>
        <div class="property-row">
          <label>Duration</label>
          <input type="number" id="prop-duration" value="${element.duration || this.state.duration}" 
                 min="0.1" max="${this.state.duration}" step="0.1" />
          <span>sec</span>
        </div>
      </div>
    `;
  }

  setupEventListeners(element) {
    // Text content
    const textInput = document.getElementById('prop-text');
    if (textInput) {
      textInput.addEventListener('input', (e) => {
        this.state.updateElement(element.id, { text: e.target.value });
        this.canvas.render();
      });
    }

    // Font selector
    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        fontOptions.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.updateElement(element.id, { fontFamily: btn.dataset.font });
        this.canvas.render();
      });
    });

    // Animation selector
    const animOptions = document.querySelectorAll('.animation-option');
    animOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        animOptions.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.updateElement(element.id, { animation: btn.dataset.animation });
        this.canvas.render();
      });
    });

    // Text style selector
    const styleOptions = document.querySelectorAll('.style-option');
    styleOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        styleOptions.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.updateElement(element.id, { textStyle: btn.dataset.style });
        this.canvas.render();
        // Re-render the panel to show style-specific options
        this.update();
      });
    });

    // Number inputs (extended list)
    const numberInputs = ['fontSize', 'fontWeight', 'x', 'y', 'width', 'heightPos',
      'startTime', 'duration', 'animDuration', 'startValue', 'endValue',
      'value', 'height', 'cornerRadius', 'strokeWidth', 'letterSpacing', 'outlineWidth'];

    numberInputs.forEach(prop => {
      const input = document.getElementById(`prop-${prop}`);
      if (input) {
        input.addEventListener('change', (e) => {
          let key = prop;
          if (prop === 'heightPos') key = 'height';
          if (prop === 'animDuration') key = 'animationDuration';

          const value = prop === 'fontWeight' ? parseInt(e.target.value) : parseFloat(e.target.value);
          this.state.updateElement(element.id, { [key]: value });
          this.canvas.render();

          // Update display for range inputs
          if (prop === 'value') {
            e.target.nextElementSibling.textContent = `${value}%`;
          }
        });
      }
    });

    // Text inputs (prefix, suffix)
    ['prefix', 'suffix'].forEach(prop => {
      const input = document.getElementById(`prop-${prop}`);
      if (input) {
        input.addEventListener('input', (e) => {
          this.state.updateElement(element.id, { [prop]: e.target.value });
          this.canvas.render();
        });
      }
    });

    // Select inputs
    ['fontWeight', 'textAlign', 'fontFamily'].forEach(prop => {
      const select = document.getElementById(`prop-${prop}`);
      if (select) {
        select.addEventListener('change', (e) => {
          const value = prop === 'fontWeight' ? parseInt(e.target.value) : e.target.value;
          this.state.updateElement(element.id, { [prop]: value });
          this.canvas.render();
        });
      }
    });

    // Color input
    const colorInput = document.getElementById('prop-color');
    if (colorInput) {
      colorInput.addEventListener('input', (e) => {
        this.state.updateElement(element.id, { color: e.target.value });
        this.canvas.render();
      });
    }

    // Gradient color inputs
    const gradientStartInput = document.getElementById('prop-gradientStart');
    if (gradientStartInput) {
      gradientStartInput.addEventListener('input', (e) => {
        this.state.updateElement(element.id, { gradientStart: e.target.value });
        this.canvas.render();
      });
    }

    const gradientEndInput = document.getElementById('prop-gradientEnd');
    if (gradientEndInput) {
      gradientEndInput.addEventListener('input', (e) => {
        this.state.updateElement(element.id, { gradientEnd: e.target.value });
        this.canvas.render();
      });
    }

    // Outline color input
    const outlineColorInput = document.getElementById('prop-outlineColor');
    if (outlineColorInput) {
      outlineColorInput.addEventListener('input', (e) => {
        this.state.updateElement(element.id, { outlineColor: e.target.value });
        this.canvas.render();
      });
    }

    // Checkbox inputs
    ['shadow', 'showLabel'].forEach(prop => {
      const checkbox = document.getElementById(`prop-${prop}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          this.state.updateElement(element.id, { [prop]: e.target.checked });
          this.canvas.render();
        });
      }
    });

    // Edit chart data button
    const editChartBtn = document.getElementById('editChartData');
    if (editChartBtn) {
      editChartBtn.addEventListener('click', () => {
        this.openChartDataModal(element);
      });
    }
  }

  openChartDataModal(element) {
    const modal = document.getElementById('chartDataModal');
    const dataRows = document.getElementById('dataRows');
    const data = element.data || [];

    const renderRows = () => {
      dataRows.innerHTML = data.map((item, index) => `
        <div class="data-row">
          <input type="text" value="${item.label}" data-index="${index}" data-field="label" />
          <input type="number" value="${item.value}" data-index="${index}" data-field="value" />
          <input type="color" value="${item.color}" data-index="${index}" data-field="color" />
          <button class="remove-row" data-index="${index}">×</button>
        </div>
      `).join('');

      // Setup row event listeners
      dataRows.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
          const index = parseInt(e.target.dataset.index);
          const field = e.target.dataset.field;
          data[index][field] = field === 'value' ? parseFloat(e.target.value) : e.target.value;
        });
      });

      dataRows.querySelectorAll('.remove-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          data.splice(index, 1);
          renderRows();
        });
      });
    };

    renderRows();

    // Add row button
    const addRowBtn = document.getElementById('addDataRow');
    addRowBtn.onclick = () => {
      data.push({ label: 'New', value: 50, color: '#6366f1' });
      renderRows();
    };

    // Apply button
    const applyBtn = document.getElementById('applyChartData');
    applyBtn.onclick = () => {
      this.state.updateElement(element.id, { data: [...data] });
      this.canvas.render();
      modal.classList.remove('active');
    };

    // Close handlers
    document.getElementById('closeChartModal').onclick = () => modal.classList.remove('active');
    document.getElementById('cancelChartData').onclick = () => modal.classList.remove('active');
    modal.querySelector('.modal-backdrop').onclick = () => modal.classList.remove('active');

    modal.classList.add('active');
  }
}
