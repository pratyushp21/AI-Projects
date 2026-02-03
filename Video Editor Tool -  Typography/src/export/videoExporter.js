// Video Exporter - Export canvas as MP4
export class VideoExporter {
    constructor(state, canvas, soundManager) {
        this.state = state;
        this.canvas = canvas;
        this.soundManager = soundManager;
        this.isExporting = false;
    }

    async export(onProgress) {
        if (this.isExporting) {
            throw new Error('Export already in progress');
        }

        this.isExporting = true;

        try {
            const settings = this.state.exportSettings;
            const fps = settings.fps || 30;
            const duration = this.state.duration;

            // Get resolution
            let width, height;
            switch (settings.quality) {
                case '720':
                    width = 720;
                    height = 1280;
                    break;
                case '4k':
                    width = 2160;
                    height = 3840;
                    break;
                default: // 1080
                    width = 1080;
                    height = 1920;
            }

            onProgress(0, 'Preparing frames...');

            // Create offscreen canvas for rendering
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;
            const offscreenCtx = offscreenCanvas.getContext('2d');

            // Calculate total frames
            const totalFrames = Math.ceil(duration * fps);
            const frames = [];

            // Render each frame
            for (let frame = 0; frame < totalFrames; frame++) {
                const time = frame / fps;

                // Render to main canvas
                this.canvas.render(time);

                // Scale and copy to offscreen canvas
                offscreenCtx.fillStyle = '#0a0a0f';
                offscreenCtx.fillRect(0, 0, width, height);

                // Draw main canvas content scaled
                offscreenCtx.drawImage(
                    this.canvas.canvas,
                    0, 0, this.canvas.baseWidth, this.canvas.baseHeight,
                    0, 0, width, height
                );

                // Capture frame as blob
                const blob = await new Promise(resolve => {
                    offscreenCanvas.toBlob(resolve, 'image/webp', 0.95);
                });
                frames.push(blob);

                // Progress update
                const progress = (frame / totalFrames) * 50;
                onProgress(progress, `Rendering frame ${frame + 1}/${totalFrames}`);

                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            onProgress(50, 'Creating video...');

            // Create video using MediaRecorder
            const video = await this.createVideoFromFrames(frames, fps, width, height, duration,
                (percent, status) => onProgress(50 + percent * 0.5, status));

            onProgress(100, 'Complete!');

            // Download
            this.downloadBlob(video, `instavid-export-${Date.now()}.webm`);

            return video;
        } finally {
            this.isExporting = false;
            // Reset canvas to current time
            this.canvas.render();
        }
    }

    async createVideoFromFrames(frames, fps, width, height, duration, onProgress) {
        return new Promise((resolve, reject) => {
            // Create a video element and use MediaRecorder
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Use canvas stream for MediaRecorder
            const stream = canvas.captureStream(fps);

            // Add audio track if enabled
            if (this.state.exportSettings.includeAudio) {
                // Audio would be added here with AudioContext
                // For now, we'll export video only
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 8000000 // 8 Mbps for high quality
            });

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            mediaRecorder.onerror = (e) => {
                reject(e.error);
            };

            mediaRecorder.start();

            // Play frames
            let frameIndex = 0;
            const frameInterval = 1000 / fps;

            const playFrame = async () => {
                if (frameIndex >= frames.length) {
                    mediaRecorder.stop();
                    return;
                }

                const frameBlob = frames[frameIndex];
                const bitmap = await createImageBitmap(frameBlob);

                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(bitmap, 0, 0);
                bitmap.close();

                frameIndex++;

                const progress = (frameIndex / frames.length) * 100;
                onProgress(progress, `Encoding frame ${frameIndex}/${frames.length}`);

                setTimeout(playFrame, frameInterval);
            };

            playFrame();
        });
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Alternative: Simple frame-by-frame WebM export using basic encoding
    async exportSimple(onProgress) {
        if (this.isExporting) {
            throw new Error('Export already in progress');
        }

        this.isExporting = true;

        try {
            const fps = this.state.exportSettings.fps || 30;
            const duration = this.state.duration;
            const totalFrames = Math.ceil(duration * fps);

            onProgress(0, 'Starting recording...');

            // Get canvas stream
            const stream = this.canvas.canvas.captureStream(fps);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 10000000
            });

            const chunks = [];

            return new Promise((resolve, reject) => {
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    this.downloadBlob(blob, `instavid-${Date.now()}.webm`);
                    this.isExporting = false;
                    resolve(blob);
                };

                mediaRecorder.onerror = (e) => {
                    this.isExporting = false;
                    reject(e.error);
                };

                mediaRecorder.start(100); // Collect data every 100ms

                // Play animation
                let frame = 0;
                const frameTime = 1000 / fps;

                const renderFrame = () => {
                    if (frame >= totalFrames) {
                        mediaRecorder.stop();
                        return;
                    }

                    const time = frame / fps;
                    this.canvas.render(time);

                    const progress = (frame / totalFrames) * 100;
                    onProgress(progress, `Recording... ${Math.round(time)}s / ${duration}s`);

                    frame++;
                    setTimeout(renderFrame, frameTime);
                };

                renderFrame();
            });
        } catch (error) {
            this.isExporting = false;
            throw error;
        }
    }
}
