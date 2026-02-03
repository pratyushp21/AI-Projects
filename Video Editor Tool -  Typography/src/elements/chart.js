// Chart element classes
export class ChartElement {
    constructor(options = {}) {
        this.type = options.type || 'bar-chart';
        this.id = options.id || null;
        this.name = options.name || 'Chart';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 500;
        this.height = options.height || 400;
        this.data = options.data || [];
        this.animation = options.animation || 'fade';
        this.animationDuration = options.animationDuration || 1.5;
        this.startTime = options.startTime || 0;
        this.duration = options.duration || 10;
    }

    clone() {
        return new ChartElement({ ...this, data: [...this.data] });
    }
}
