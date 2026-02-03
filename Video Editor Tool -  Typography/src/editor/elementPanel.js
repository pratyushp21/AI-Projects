// Element Panel - Add elements to canvas
export class ElementPanel {
    constructor(state, canvas) {
        this.state = state;
        this.canvas = canvas;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const elementButtons = document.querySelectorAll('.element-btn');

        elementButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const elementType = btn.dataset.element;
                this.addElement(elementType);
            });
        });
    }

    addElement(type) {
        let element = null;

        // Default positioning (centered)
        const baseProps = {
            type: type,
            x: 540 - 200, // Center of 1080 - half width
            y: 960 - 50, // Center of 1920 - half height
            width: 400,
            height: 100,
            startTime: 0,
            duration: this.state.duration,
            animation: 'fade',
            animationDuration: 1
        };

        switch (type) {
            // Typography elements
            case 'heading':
                element = {
                    ...baseProps,
                    name: 'Heading',
                    text: 'Your Headline',
                    fontFamily: 'Outfit',
                    fontSize: 96,
                    fontWeight: 800,
                    color: '#ffffff',
                    textAlign: 'center',
                    width: 800,
                    height: 150,
                    x: 140,
                    animation: 'slide-up',
                    shadow: true
                };
                break;

            case 'subheading':
                element = {
                    ...baseProps,
                    name: 'Subheading',
                    text: 'Subheading Text',
                    fontFamily: 'Inter',
                    fontSize: 56,
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                    width: 700,
                    height: 100,
                    x: 190,
                    animation: 'fade'
                };
                break;

            case 'body':
                element = {
                    ...baseProps,
                    name: 'Body Text',
                    text: 'Your body text goes here.\nAdd multiple lines for impact.',
                    fontFamily: 'Inter',
                    fontSize: 36,
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    width: 800,
                    height: 200,
                    x: 140
                };
                break;

            case 'caption':
                element = {
                    ...baseProps,
                    name: 'Caption',
                    text: '@yourusername',
                    fontFamily: 'Inter',
                    fontSize: 28,
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center',
                    width: 400,
                    height: 60,
                    x: 340,
                    y: 1800
                };
                break;

            case 'quote':
                element = {
                    ...baseProps,
                    name: 'Quote',
                    text: '"The future is now."',
                    fontFamily: 'Playfair Display',
                    fontSize: 64,
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: '#ffffff',
                    textAlign: 'center',
                    width: 800,
                    height: 200,
                    x: 140,
                    animation: 'scale'
                };
                break;

            case 'stat':
                element = {
                    ...baseProps,
                    name: 'Stat',
                    text: '100M+',
                    fontFamily: 'Space Mono',
                    fontSize: 120,
                    fontWeight: 700,
                    color: '#6366f1',
                    textAlign: 'center',
                    width: 600,
                    height: 180,
                    x: 240,
                    animation: 'bounce'
                };
                break;

            // Chart elements
            case 'bar-chart':
                element = {
                    ...baseProps,
                    name: 'Bar Chart',
                    width: 800,
                    height: 500,
                    x: 140,
                    y: 700,
                    animationDuration: 1.5,
                    data: [
                        { label: 'GPT', value: 80, color: '#6366f1' },
                        { label: 'Claude', value: 75, color: '#a855f7' },
                        { label: 'Gemini', value: 90, color: '#22c55e' },
                        { label: 'LLaMA', value: 60, color: '#f59e0b' }
                    ]
                };
                break;

            case 'line-chart':
                element = {
                    ...baseProps,
                    name: 'Line Chart',
                    width: 800,
                    height: 400,
                    x: 140,
                    y: 750,
                    animationDuration: 2,
                    data: [
                        { label: 'Jan', value: 30, color: '#6366f1' },
                        { label: 'Feb', value: 45, color: '#6366f1' },
                        { label: 'Mar', value: 40, color: '#6366f1' },
                        { label: 'Apr', value: 70, color: '#6366f1' },
                        { label: 'May', value: 85, color: '#6366f1' },
                        { label: 'Jun', value: 95, color: '#6366f1' }
                    ]
                };
                break;

            case 'pie-chart':
                element = {
                    ...baseProps,
                    name: 'Pie Chart',
                    width: 500,
                    height: 500,
                    x: 290,
                    y: 700,
                    animationDuration: 1.5,
                    data: [
                        { label: 'AI', value: 45, color: '#6366f1' },
                        { label: 'ML', value: 30, color: '#a855f7' },
                        { label: 'Data', value: 25, color: '#22c55e' }
                    ]
                };
                break;

            case 'donut-chart':
                element = {
                    ...baseProps,
                    type: 'donut-chart',
                    name: 'Donut Chart',
                    width: 500,
                    height: 500,
                    x: 290,
                    y: 700,
                    animationDuration: 1.5,
                    data: [
                        { label: 'Complete', value: 75, color: '#22c55e' },
                        { label: 'Remaining', value: 25, color: 'rgba(255,255,255,0.2)' }
                    ]
                };
                break;

            case 'counter':
                element = {
                    ...baseProps,
                    name: 'Counter',
                    width: 600,
                    height: 180,
                    x: 240,
                    y: 870,
                    startValue: 0,
                    endValue: 1000000,
                    prefix: '',
                    suffix: '+',
                    fontFamily: 'Space Mono',
                    fontSize: 100,
                    fontWeight: 700,
                    color: '#ffffff',
                    animationDuration: 2.5
                };
                break;

            case 'progress':
                element = {
                    ...baseProps,
                    name: 'Progress Bar',
                    width: 800,
                    height: 24,
                    x: 140,
                    y: 960,
                    value: 75,
                    showLabel: true,
                    animationDuration: 1.5
                };
                break;

            // Shape elements
            case 'rectangle':
                element = {
                    ...baseProps,
                    name: 'Rectangle',
                    width: 300,
                    height: 200,
                    x: 390,
                    y: 860,
                    color: '#6366f1',
                    cornerRadius: 16,
                    fill: true,
                    stroke: false,
                    animationDuration: 0.5
                };
                break;

            case 'circle':
                element = {
                    ...baseProps,
                    name: 'Circle',
                    width: 200,
                    height: 200,
                    x: 440,
                    y: 860,
                    color: '#a855f7',
                    fill: true,
                    stroke: false,
                    animationDuration: 0.5
                };
                break;

            case 'line':
                element = {
                    ...baseProps,
                    name: 'Line',
                    width: 600,
                    height: 10,
                    x: 240,
                    y: 955,
                    color: '#ffffff',
                    strokeWidth: 4,
                    animationDuration: 0.8
                };
                break;

            case 'arrow':
                element = {
                    ...baseProps,
                    name: 'Arrow',
                    width: 400,
                    height: 40,
                    x: 340,
                    y: 940,
                    color: '#6366f1',
                    strokeWidth: 4,
                    animationDuration: 0.8
                };
                break;

            default:
                element = {
                    ...baseProps,
                    name: 'Text',
                    text: 'New Text',
                    fontFamily: 'Inter',
                    fontSize: 48,
                    fontWeight: 500,
                    color: '#ffffff'
                };
        }

        this.state.addElement(element);
        this.state.selectElement(element);
        this.canvas.render();
    }
}
