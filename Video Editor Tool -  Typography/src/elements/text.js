// Element base classes - for future extensibility
export class TextElement {
    constructor(options = {}) {
        this.type = options.type || 'text';
        this.id = options.id || null;
        this.name = options.name || 'Text';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 400;
        this.height = options.height || 100;
        this.text = options.text || '';
        this.fontFamily = options.fontFamily || 'Inter';
        this.fontSize = options.fontSize || 48;
        this.fontWeight = options.fontWeight || 500;
        this.color = options.color || '#ffffff';
        this.textAlign = options.textAlign || 'center';
        this.shadow = options.shadow || false;
        this.animation = options.animation || 'fade';
        this.animationDuration = options.animationDuration || 1;
        this.startTime = options.startTime || 0;
        this.duration = options.duration || 10;
    }

    clone() {
        return new TextElement({ ...this });
    }
}
