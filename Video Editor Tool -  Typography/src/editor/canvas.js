// Canvas rendering and element management
import { TextElement } from '../elements/text.js';
import { ChartElement } from '../elements/chart.js';
import { ShapeElement } from '../elements/shape.js';

export class Canvas {
    constructor(state, soundManager) {
        this.state = state;
        this.soundManager = soundManager;
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.wrapper = document.getElementById('canvasWrapper');
        this.frame = document.getElementById('canvasFrame');
        this.overlay = document.getElementById('elementOverlay');

        this.zoom = 0.35; // Default zoom for 1080x1920 to fit
        this.baseWidth = 1080;
        this.baseHeight = 1920;

        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.resizeHandle = null;

        this.init();
    }

    init() {
        this.updateZoom();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Click on canvas to select elements
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.baseWidth / rect.width;
            const scaleY = this.baseHeight / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // Find clicked element (reverse order for top-most first)
            let clicked = null;
            for (let i = this.state.elements.length - 1; i >= 0; i--) {
                const element = this.state.elements[i];
                if (this.hitTest(element, x, y)) {
                    clicked = element;
                    break;
                }
            }

            this.state.selectElement(clicked);
        });

        // Mouse events for dragging
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
    }

    handleMouseDown(e) {
        if (!this.state.selectedElement) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.baseWidth / rect.width;
        const scaleY = this.baseHeight / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const element = this.state.selectedElement;
        if (this.hitTest(element, x, y)) {
            this.isDragging = true;
            this.dragOffset = {
                x: x - element.x,
                y: y - element.y
            };
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.state.selectedElement) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.baseWidth / rect.width;
        const scaleY = this.baseHeight / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const element = this.state.selectedElement;
        element.x = Math.max(0, Math.min(this.baseWidth - element.width, x - this.dragOffset.x));
        element.y = Math.max(0, Math.min(this.baseHeight - element.height, y - this.dragOffset.y));

        this.state.updateElement(element.id, { x: element.x, y: element.y });
        this.render();
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.state.saveHistory();
        }
    }

    hitTest(element, x, y) {
        return x >= element.x &&
            x <= element.x + element.width &&
            y >= element.y &&
            y <= element.y + element.height;
    }

    updateZoom() {
        const displayWidth = this.baseWidth * this.zoom;
        const displayHeight = this.baseHeight * this.zoom;

        this.frame.style.width = `${displayWidth}px`;
        this.frame.style.height = `${displayHeight}px`;

        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = `${Math.round(this.zoom * 100)}%`;
        }
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 1);
        this.updateZoom();
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom * 0.8, 0.1);
        this.updateZoom();
    }

    render(currentTime = null) {
        const ctx = this.ctx;
        const time = currentTime !== null ? currentTime : this.state.getCurrentTime();

        // Clear canvas with background color
        ctx.fillStyle = this.state.backgroundColor || '#0a0a0f';
        ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

        // Draw gradient background if enabled
        if (this.state.backgroundGradient) {
            const gradient = ctx.createLinearGradient(0, 0, 0, this.baseHeight);
            gradient.addColorStop(0, this.state.backgroundColor || '#0a0a0f');
            gradient.addColorStop(1, this.state.backgroundGradientEnd || '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
        }

        // Render elements
        for (const element of this.state.elements) {
            // Check if element should be visible at current time
            if (time < element.startTime || time > element.startTime + element.duration) {
                continue;
            }

            const localTime = time - element.startTime;
            const progress = localTime / element.duration;

            ctx.save();

            // Render based on element type
            switch (element.type) {
                case 'text':
                case 'heading':
                case 'subheading':
                case 'body':
                case 'caption':
                case 'quote':
                case 'stat':
                    this.renderText(ctx, element, localTime, progress);
                    break;
                case 'bar-chart':
                case 'line-chart':
                case 'pie-chart':
                case 'donut-chart':
                    this.renderChart(ctx, element, localTime, progress);
                    break;
                case 'counter':
                    this.renderCounter(ctx, element, localTime, progress);
                    break;
                case 'progress':
                    this.renderProgress(ctx, element, localTime, progress);
                    break;
                case 'rectangle':
                case 'circle':
                case 'line':
                case 'arrow':
                    this.renderShape(ctx, element, localTime, progress);
                    break;
            }

            ctx.restore();
        }

        // Draw selection border
        if (this.state.selectedElement && !this.state.isPlaying) {
            const el = this.state.selectedElement;
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 4]);
            ctx.strokeRect(el.x - 4, el.y - 4, el.width + 8, el.height + 8);
            ctx.setLineDash([]);
        }
    }

    renderText(ctx, element, localTime, progress) {
        const animation = element.animation || 'none';
        const speed = element.animationSpeed || 1; // 0.5 = slow, 1 = normal, 2 = fast
        let opacity = 1;
        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;
        let rotation = 0;
        let blur = 0;
        let displayText = element.text || '';

        // Animation calculations with speed control
        const animDuration = (element.animationDuration || 1) / speed;
        const animProgress = Math.min(localTime / animDuration, 1);
        const eased = this.easeOutCubic(animProgress);

        switch (animation) {
            case 'none':
                // No animation
                break;
            case 'fade':
                opacity = eased;
                break;
            case 'slide-up':
                opacity = eased;
                offsetY = (1 - eased) * 100;
                break;
            case 'slide-down':
                opacity = eased;
                offsetY = (eased - 1) * 100;
                break;
            case 'slide-left':
                opacity = eased;
                offsetX = (1 - eased) * 100;
                break;
            case 'slide-right':
                opacity = eased;
                offsetX = (eased - 1) * 100;
                break;
            case 'scale':
                scale = 0.5 + eased * 0.5;
                opacity = eased;
                break;
            case 'zoom-in':
                scale = eased;
                opacity = eased;
                break;
            case 'zoom-out':
                scale = 2 - eased;
                opacity = eased;
                break;
            case 'rotate':
                rotation = (1 - eased) * Math.PI * 2;
                opacity = eased;
                scale = 0.5 + eased * 0.5;
                break;
            case 'typewriter':
            case 'typewriter-slow':
            case 'typewriter-fast':
                // Adjust speed based on animation type
                let typeSpeed = speed;
                if (animation === 'typewriter-slow') typeSpeed = 0.5;
                if (animation === 'typewriter-fast') typeSpeed = 2;

                const typeAnimDuration = (element.animationDuration || 1) / typeSpeed;
                const typeProgress = Math.min(localTime / typeAnimDuration, 1);
                const charCount = Math.floor(typeProgress * displayText.length);
                displayText = displayText.substring(0, charCount);

                // Play typing sound
                if (charCount > 0 && this.state.isPlaying) {
                    const lastChar = Math.floor((localTime - 0.03) / typeAnimDuration * element.text.length);
                    if (charCount > lastChar) {
                        this.soundManager?.playTypingSound();
                    }
                }
                break;
            case 'glitch':
                if (animProgress < 1) {
                    offsetX = (Math.random() - 0.5) * 20 * (1 - animProgress);
                    offsetY = (Math.random() - 0.5) * 20 * (1 - animProgress);
                    // RGB split effect simulation
                    if (Math.random() > 0.7) {
                        offsetX += (Math.random() - 0.5) * 30;
                    }
                }
                opacity = Math.min(eased * 1.2, 1);
                break;
            case 'bounce':
                const bounceProgress = Math.min(animProgress * 1.5, 1);
                scale = this.easeOutBounce(bounceProgress);
                opacity = Math.min(animProgress * 2, 1);
                break;
            case 'wave':
                // Wave animation - text bounces in a wave
                opacity = eased;
                offsetY = Math.sin(localTime * 4) * 20 * (1 - animProgress);
                break;
            case 'blur-in':
                blur = (1 - eased) * 20;
                opacity = eased;
                break;
            case 'focus':
                blur = Math.abs(Math.sin((1 - eased) * Math.PI)) * 10;
                scale = 0.9 + eased * 0.1;
                opacity = Math.min(eased * 1.5, 1);
                break;
            case 'shake':
                if (animProgress < 0.8) {
                    offsetX = Math.sin(localTime * 50) * 10 * (1 - animProgress);
                    offsetY = Math.cos(localTime * 50) * 10 * (1 - animProgress);
                }
                opacity = Math.min(eased * 1.5, 1);
                break;
            case 'flip':
                scale = Math.abs(Math.cos((1 - eased) * Math.PI / 2));
                opacity = eased;
                break;
            case 'pop':
                const popProgress = Math.min(animProgress * 2, 1);
                if (popProgress < 0.5) {
                    scale = 0 + popProgress * 2.4; // Overshoot to 1.2
                } else {
                    scale = 1.2 - (popProgress - 0.5) * 0.4; // Settle to 1
                }
                opacity = Math.min(animProgress * 3, 1);
                break;
            case 'rainbow':
                // Rainbow color cycling (handled in text rendering)
                opacity = eased;
                break;
        }

        // Apply blur filter
        if (blur > 0) {
            ctx.filter = `blur(${blur}px)`;
        }

        // Apply transformations
        ctx.globalAlpha = opacity;
        ctx.translate(element.x + element.width / 2 + offsetX, element.y + element.height / 2 + offsetY);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.translate(-element.width / 2, -element.height / 2);

        // Text styling
        const textStyle = element.textStyle || 'solid';
        const fontSize = element.fontSize || 72;

        ctx.font = `${element.fontWeight || 700} ${fontSize}px ${element.fontFamily || 'Inter'}`;
        ctx.textAlign = element.textAlign || 'center';
        ctx.textBaseline = 'middle';

        // Text shadow
        if (element.shadow) {
            ctx.shadowColor = element.shadowColor || 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = element.shadowBlur || 20;
            ctx.shadowOffsetX = element.shadowOffsetX || 0;
            ctx.shadowOffsetY = element.shadowOffsetY || 10;
        }

        // Neon glow effect
        if (textStyle === 'neon' || element.neonGlow) {
            ctx.shadowColor = element.color || '#6366f1';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // Draw text based on style
        const lines = displayText.split('\n');
        const lineHeight = fontSize * (element.lineHeight || 1.2);
        const startY = element.height / 2 - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, lineIndex) => {
            const x = element.textAlign === 'center' ? element.width / 2 :
                element.textAlign === 'right' ? element.width : 0;
            const y = startY + lineIndex * lineHeight;

            // Rainbow animation - cycle through colors per character
            if (animation === 'rainbow' || textStyle === 'rainbow') {
                const chars = line.split('');
                let charX = x;

                // Calculate starting position for centered text
                if (element.textAlign === 'center') {
                    charX = x - ctx.measureText(line).width / 2;
                }

                chars.forEach((char, charIndex) => {
                    const hue = ((localTime * 100) + charIndex * 30) % 360;
                    ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                    ctx.fillText(char, charX, y);
                    charX += ctx.measureText(char).width;
                });
            }
            // Gradient text
            else if (textStyle === 'gradient') {
                const gradient = ctx.createLinearGradient(0, y - fontSize / 2, 0, y + fontSize / 2);
                gradient.addColorStop(0, element.gradientStart || element.color || '#6366f1');
                gradient.addColorStop(1, element.gradientEnd || '#a855f7');
                ctx.fillStyle = gradient;
                ctx.fillText(line, x, y);
            }
            // Outline text
            else if (textStyle === 'outline') {
                ctx.strokeStyle = element.color || '#ffffff';
                ctx.lineWidth = element.outlineWidth || 3;
                ctx.strokeText(line, x, y);
            }
            // Outline with fill
            else if (textStyle === 'outline-fill') {
                ctx.fillStyle = element.color || '#ffffff';
                ctx.fillText(line, x, y);
                ctx.strokeStyle = element.outlineColor || '#000000';
                ctx.lineWidth = element.outlineWidth || 2;
                ctx.strokeText(line, x, y);
            }
            // Neon style (fill with glow already applied)
            else if (textStyle === 'neon') {
                ctx.fillStyle = element.color || '#6366f1';
                // Draw multiple times for stronger glow
                ctx.fillText(line, x, y);
                ctx.fillText(line, x, y);
            }
            // Letter spacing effect
            else if (element.letterSpacing && element.letterSpacing !== 0) {
                const chars = line.split('');
                let charX = x;
                if (element.textAlign === 'center') {
                    const totalWidth = chars.reduce((w, c) => w + ctx.measureText(c).width + element.letterSpacing, -element.letterSpacing);
                    charX = x - totalWidth / 2;
                }
                ctx.fillStyle = element.color || '#ffffff';
                chars.forEach(char => {
                    ctx.fillText(char, charX, y);
                    charX += ctx.measureText(char).width + element.letterSpacing;
                });
            }
            // Default solid text
            else {
                ctx.fillStyle = element.color || '#ffffff';
                ctx.fillText(line, x, y);
            }
        });

        // Typewriter cursor
        if ((animation === 'typewriter' || animation === 'typewriter-slow' || animation === 'typewriter-fast') && animProgress < 1) {
            const cursorBlink = Math.floor(localTime * 2) % 2 === 0;
            if (cursorBlink) {
                const lastLine = displayText.split('\n').pop() || '';
                const textWidth = ctx.measureText(lastLine).width;
                const cursorX = element.textAlign === 'center' ? element.width / 2 + textWidth / 2 + 5 : textWidth + 5;
                const cursorY = startY + (lines.length - 1) * lineHeight;
                ctx.fillRect(cursorX, cursorY - lineHeight / 3, 4, lineHeight * 0.6);
            }
        }
    }

    renderChart(ctx, element, localTime, progress) {
        const data = element.data || [
            { label: 'A', value: 80, color: '#6366f1' },
            { label: 'B', value: 60, color: '#a855f7' },
            { label: 'C', value: 90, color: '#22c55e' },
            { label: 'D', value: 45, color: '#f59e0b' }
        ];

        const animDuration = element.animationDuration || 1.5;
        const animProgress = Math.min(localTime / animDuration, 1);
        const eased = this.easeOutCubic(animProgress);

        ctx.translate(element.x, element.y);

        switch (element.type) {
            case 'bar-chart':
                this.drawBarChart(ctx, element, data, eased);
                break;
            case 'line-chart':
                this.drawLineChart(ctx, element, data, eased);
                break;
            case 'pie-chart':
            case 'donut-chart':
                this.drawPieChart(ctx, element, data, eased, element.type === 'donut-chart');
                break;
        }
    }

    drawBarChart(ctx, element, data, progress) {
        const w = element.width;
        const h = element.height;
        const padding = 40;
        const barWidth = (w - padding * 2) / data.length - 20;
        const maxValue = Math.max(...data.map(d => d.value));

        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * (h - padding * 2) * progress;
            const x = padding + index * (barWidth + 20);
            const y = h - padding - barHeight;

            // Bar gradient
            const gradient = ctx.createLinearGradient(x, y + barHeight, x, y);
            gradient.addColorStop(0, item.color);
            gradient.addColorStop(1, this.lightenColor(item.color, 30));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 8);
            ctx.fill();

            // Label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '500 24px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, h - 10);

            // Value
            if (progress > 0.5) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '700 28px Inter';
                ctx.fillText(Math.round(item.value * progress), x + barWidth / 2, y - 15);
            }
        });
    }

    drawLineChart(ctx, element, data, progress) {
        const w = element.width;
        const h = element.height;
        const padding = 50;
        const maxValue = Math.max(...data.map(d => d.value));
        const points = [];

        data.forEach((item, index) => {
            const x = padding + (index / (data.length - 1)) * (w - padding * 2);
            const y = h - padding - (item.value / maxValue) * (h - padding * 2);
            points.push({ x, y, value: item.value, color: item.color });
        });

        // Draw line with progress
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();

        const visiblePoints = Math.ceil(points.length * progress);
        for (let i = 0; i < visiblePoints; i++) {
            if (i === 0) {
                ctx.moveTo(points[i].x, points[i].y);
            } else {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }
        ctx.stroke();

        // Draw points
        points.slice(0, visiblePoints).forEach((point, index) => {
            ctx.fillStyle = point.color || '#6366f1';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawPieChart(ctx, element, data, progress, isDonut) {
        const w = element.width;
        const h = element.height;
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) / 2 - 20;
        const innerRadius = isDonut ? radius * 0.6 : 0;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * Math.PI * 2 * progress;

            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Inner circle for donut
            if (isDonut) {
                ctx.fillStyle = '#0a0a0f';
                ctx.beginPath();
                ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            currentAngle += sliceAngle;
        });
    }

    renderCounter(ctx, element, localTime, progress) {
        const animDuration = element.animationDuration || 2;
        const animProgress = Math.min(localTime / animDuration, 1);
        const eased = this.easeOutCubic(animProgress);

        const startValue = element.startValue || 0;
        const endValue = element.endValue || 1000000;
        const currentValue = Math.floor(startValue + (endValue - startValue) * eased);

        const prefix = element.prefix || '';
        const suffix = element.suffix || '';
        const formatted = prefix + currentValue.toLocaleString() + suffix;

        ctx.fillStyle = element.color || '#ffffff';
        ctx.font = `${element.fontWeight || 800} ${element.fontSize || 120}px ${element.fontFamily || 'Space Mono'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatted, element.x + element.width / 2, element.y + element.height / 2);
    }

    renderProgress(ctx, element, localTime, progress) {
        const animDuration = element.animationDuration || 1.5;
        const animProgress = Math.min(localTime / animDuration, 1);
        const eased = this.easeOutCubic(animProgress);

        const value = (element.value || 75) * eased;
        const w = element.width;
        const h = element.height || 24;

        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(element.x, element.y, w, h, h / 2);
        ctx.fill();

        // Progress fill
        const progressWidth = (value / 100) * w;
        const gradient = ctx.createLinearGradient(element.x, 0, element.x + progressWidth, 0);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#a855f7');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(element.x, element.y, progressWidth, h, h / 2);
        ctx.fill();

        // Label
        if (element.showLabel !== false) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 28px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(`${Math.round(value)}%`, element.x + w, element.y - 10);
        }
    }

    renderShape(ctx, element, localTime, progress) {
        const animDuration = element.animationDuration || 0.5;
        const animProgress = Math.min(localTime / animDuration, 1);
        const eased = this.easeOutCubic(animProgress);

        ctx.globalAlpha = eased;
        ctx.fillStyle = element.color || '#6366f1';
        ctx.strokeStyle = element.strokeColor || element.color || '#6366f1';
        ctx.lineWidth = element.strokeWidth || 4;

        switch (element.type) {
            case 'rectangle':
                ctx.beginPath();
                ctx.roundRect(element.x, element.y, element.width * eased, element.height * eased, element.cornerRadius || 0);
                if (element.fill !== false) ctx.fill();
                if (element.stroke) ctx.stroke();
                break;
            case 'circle':
                const radius = Math.min(element.width, element.height) / 2 * eased;
                ctx.beginPath();
                ctx.arc(element.x + element.width / 2, element.y + element.height / 2, radius, 0, Math.PI * 2);
                if (element.fill !== false) ctx.fill();
                if (element.stroke) ctx.stroke();
                break;
            case 'line':
                ctx.beginPath();
                ctx.moveTo(element.x, element.y + element.height / 2);
                ctx.lineTo(element.x + element.width * eased, element.y + element.height / 2);
                ctx.stroke();
                break;
            case 'arrow':
                const arrowWidth = element.width * eased;
                ctx.beginPath();
                ctx.moveTo(element.x, element.y + element.height / 2);
                ctx.lineTo(element.x + arrowWidth - 20, element.y + element.height / 2);
                ctx.stroke();
                // Arrow head
                ctx.beginPath();
                ctx.moveTo(element.x + arrowWidth, element.y + element.height / 2);
                ctx.lineTo(element.x + arrowWidth - 20, element.y + element.height / 2 - 15);
                ctx.lineTo(element.x + arrowWidth - 20, element.y + element.height / 2 + 15);
                ctx.closePath();
                ctx.fill();
                break;
        }
    }

    // Helper functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
}
