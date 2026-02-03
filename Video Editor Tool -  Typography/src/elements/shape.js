// Shape element classes
export class ShapeElement {
    constructor(options = {}) {
        this.type = options.type || 'rectangle';
        this.id = options.id || null;
        this.name = options.name || 'Shape';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 200;
        this.height = options.height || 200;
        this.color = options.color || '#6366f1';
        this.strokeColor = options.strokeColor || null;
        this.strokeWidth = options.strokeWidth || 2;
        this.cornerRadius = options.cornerRadius || 0;
        this.fill = options.fill !== false;
        this.stroke = options.stroke || false;
        this.animation = options.animation || 'fade';
        this.animationDuration = options.animationDuration || 0.5;
        this.startTime = options.startTime || 0;
        this.duration = options.duration || 10;
    }

    clone() {
        return new ShapeElement({ ...this });
    }
}
