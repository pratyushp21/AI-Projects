// Sound Manager - Audio effects for the editor
export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.lastTypingTime = 0;
        this.typingInterval = 50; // Minimum ms between typing sounds

        this.init();
    }

    async init() {
        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.loadSounds();
            }
        }, { once: true });
    }

    async loadSounds() {
        // Generate synthetic sounds since we don't have actual audio files
        this.sounds.typing = this.createTypingSound();
        this.sounds.pop = this.createPopSound();
        this.sounds.whoosh = this.createWhooshSound();
    }

    createTypingSound() {
        // Returns a function that plays a synthetic typing sound
        return () => {
            if (!this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Short click sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.05);

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }

    createPopSound() {
        return () => {
            if (!this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createWhooshSound() {
        return () => {
            if (!this.audioContext) return;

            const bufferSize = this.audioContext.sampleRate * 0.3;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            // White noise with envelope
            for (let i = 0; i < bufferSize; i++) {
                const t = i / bufferSize;
                const envelope = Math.sin(t * Math.PI);
                data[i] = (Math.random() * 2 - 1) * envelope * 0.1;
            }

            const source = this.audioContext.createBufferSource();
            const filter = this.audioContext.createBiquadFilter();

            source.buffer = buffer;
            filter.type = 'bandpass';
            filter.frequency.value = 1000;

            source.connect(filter);
            filter.connect(this.audioContext.destination);

            source.start();
        };
    }

    playTypingSound() {
        if (!this.enabled) return;

        const now = performance.now();
        if (now - this.lastTypingTime < this.typingInterval) return;
        this.lastTypingTime = now;

        if (this.sounds.typing) {
            this.sounds.typing();
        }
    }

    playPop() {
        if (!this.enabled || !this.sounds.pop) return;
        this.sounds.pop();
    }

    playWhoosh() {
        if (!this.enabled || !this.sounds.whoosh) return;
        this.sounds.whoosh();
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // For export - generate audio track
    async generateAudioTrack(elements, duration, fps = 30) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const sampleRate = this.audioContext.sampleRate;
        const totalSamples = Math.ceil(duration * sampleRate);
        const offlineContext = new OfflineAudioContext(2, totalSamples, sampleRate);

        // Generate typing sounds for typewriter animations
        for (const element of elements) {
            if (element.animation === 'typewriter' && element.text) {
                const text = element.text;
                const startTime = element.startTime || 0;
                const animDuration = element.animationDuration || 1;
                const charInterval = animDuration / text.length;

                for (let i = 0; i < text.length; i++) {
                    const time = startTime + i * charInterval;
                    if (time < duration) {
                        this.addTypingSoundToContext(offlineContext, time);
                    }
                }
            }
        }

        // Render the audio
        const renderedBuffer = await offlineContext.startRendering();
        return renderedBuffer;
    }

    addTypingSoundToContext(context, time) {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800 + Math.random() * 300, time);
        oscillator.frequency.exponentialRampToValueAtTime(200, time + 0.03);

        gainNode.gain.setValueAtTime(0.08, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

        oscillator.start(time);
        oscillator.stop(time + 0.03);
    }


    // Convert AudioBuffer to WAV for export
    audioBufferToWav(buffer) {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2;
        const bufferArr = new ArrayBuffer(44 + length);
        const view = new DataView(bufferArr);
        const channels = [];
        let offset = 0;
        let pos = 0;

        // Write WAV header
        const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
        const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

        setUint32(0x46464952); // "RIFF"
        setUint32(36 + length); // file length
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt "
        setUint32(16); // chunk length
        setUint16(1); // PCM format
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * numOfChan * 2); // byte rate
        setUint16(numOfChan * 2); // block align
        setUint16(16); // bits per sample
        setUint32(0x61746164); // "data"
        setUint32(length);

        // Write audio data
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < bufferArr.byteLength) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return new Blob([bufferArr], { type: 'audio/wav' });
    }
}
