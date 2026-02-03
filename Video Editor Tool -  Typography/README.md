# InstaVid Editor - Typography & Charts 🎬✨

A professional-grade web-based video editor designed for creating stunning Instagram-format videos with advanced typography, animated charts, and timeline-based editing. Built with vanilla JavaScript for maximum performance.

## ✨ Features

### Typography Elements
- **6 Text Types**: Heading, Subheading, Body, Caption, Quote, Stat
- **Premium Fonts**: Inter, Playfair Display, Poppins, Bebas Neue, Outfit, Space Mono
- **Full Customization**: Size, color, opacity, and positioning

### Charts & Data Visualization
- **4 Chart Types**: Bar, Line, Pie, and Donut charts
- **Counter Element**: Animated number counters for statistics
- **Progress Bars**: Visual progress indicators
- **Custom Data Editor**: Interactive data entry with labels, values, and colors

### Shape Elements
- **4 Shape Types**: Rectangle, Circle, Line, Arrow
- **Flexible Styling**: Color, size, and positioning controls

### Timeline Editing
- **Visual Timeline**: Layer-based timeline with drag-and-drop
- **Keyframe Support**: Add keyframes for animations
- **Playhead Scrubbing**: Real-time preview with playhead control
- **Duration Control**: Adjustable video duration (1-60 seconds)

### Canvas Features
- **Instagram Reel Format**: 1080x1920 vertical video
- **Zoom Controls**: Zoom in/out for detailed editing
- **Background Customization**: Real-time background color picker
- **Element Overlay**: Visual selection and positioning

### Export Options
- **Quality Settings**: 720p, 1080p, or 4K
- **Frame Rate**: 24, 30, or 60 fps
- **Audio Toggle**: Include or exclude audio
- **Progress Indicator**: Real-time export progress with ring animation
- **MP4 Format**: Direct MP4 export

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd "Video Editor Tool -  Typography"

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser to the URL shown (usually http://localhost:5173)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage Guide

### Adding Elements

1. **Typography**: Click on any text element (Heading, Subheading, etc.) from the left panel
2. **Charts**: Select a chart type and customize data via the modal
3. **Shapes**: Click to add rectangles, circles, lines, or arrows

### Editing Elements

1. Click any element on the canvas to select it
2. Use the Properties panel (right side) to adjust:
   - Text content and styling
   - Chart data and appearance
   - Shape size and color
3. Drag elements to reposition them

### Timeline Management

1. Elements appear as layers in the timeline (bottom)
2. Drag to reorder layers
3. Use the playhead to scrub through the video
4. Adjust duration using the duration input

### Playback & Preview

- Click the **Play** button or press `Space` to preview
- View current time in the timeline ruler
- Background color can be changed in real-time

### Exporting Video

1. Click **Export MP4** button
2. Select quality (720p/1080p/4K)
3. Choose frame rate (24/30/60 fps)
4. Toggle audio on/off
5. Click **Export MP4** to begin
6. Progress ring shows export status

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `Delete` / `Backspace` | Remove selected element |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + S` | Save project (local) |
| `Escape` | Deselect element |

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No framework overhead
- **Vite** - Fast build tool
- **HTML5 Canvas** - High-performance rendering
- **CSS3** - Modern animations and styling

## 📁 Project Structure

```
├── src/
│   ├── audio/           # Sound management
│   │   └── soundManager.js
│   ├── editor/          # Core editor modules
│   │   ├── canvas.js
│   │   ├── elementPanel.js
│   │   ├── propertiesPanel.js
│   │   ├── state.js
│   │   └── timeline.js
│   ├── elements/        # Element definitions
│   ├── export/          # Video export functionality
│   │   └── videoExporter.js
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies
```

## 🎨 UI Components

- **Header**: Logo, New Project, Export buttons
- **Left Panel**: Element categories (Typography, Charts, Shapes)
- **Canvas Area**: Main editing canvas with toolbar
- **Right Panel**: Properties editor for selected elements
- **Timeline**: Layer management and playhead
- **Modals**: Export settings, Chart data editor
- **Toasts**: Success/Warning/Error notifications

## 📱 Perfect For

- Instagram Reels
- Instagram Stories
- TikTok videos
- YouTube Shorts
- Social media marketing content
- Data-driven presentations
- Typography showcases
- Animated infographics

## 🌟 What Makes This Different

| Feature | This Version | Simple Version |
|---------|--------------|----------------|
| Framework | Vanilla JS | React |
| Timeline | Full visual timeline | Basic layers |
| Export | MP4 with quality options | WebM only |
| Charts | 4 types + counter + progress | 3 types |
| Shapes | 4 types | 3 types |
| Audio | Yes | No |

## 🐛 Known Limitations

- Export requires browser with MediaRecorder support
- Best performance in Chrome/Edge browsers
- Large exports may take time depending on duration and quality

## 📄 License

This project is open source and available for personal and commercial use.

---

**Related Project**: Check out the [Video Editing Tool - Simple Version](../Video%20Editing%20Tool%20-%20Simple%20Version) for a simpler React-based alternative.
