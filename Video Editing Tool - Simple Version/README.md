# Typography Video Editor 🎬

A modern web-based video editor for creating aesthetic Instagram-format videos with typography, charts, shapes, and animations.

## ✨ Features

### Typography & Text
- **7 Aesthetic Fonts**: Inter, Playfair Display, Montserrat, Poppins, Bebas Neue, Raleway
- **8 Text Animations**: Typing effect with cursor, Fade In, Slide Up, Slide Left, Scale, Bounce, Glitch, Neon
- **Full Customization**: Font size (20-200px), color, opacity, animation duration

### Charts & Data Visualization
- **3 Chart Types**: Bar, Line, and Pie charts
- **Custom Data Input**: Enter comma-separated values
- **Adjustable Size**: Width and height controls
- **Color Customization**: Choose any color for your charts

### Shapes & Design Elements
- **3 Shape Types**: Rectangle, Circle, Rounded Rectangle
- **Full Control**: Size, color, opacity, border radius
- **Layer Management**: Move shapes up/down in layer order

### Backgrounds
- **8 Preset Backgrounds**: Purple, Blue, Pink, Green, Orange gradients + Dark, Black, White
- **Smooth Transitions**: Background changes animate smoothly

### Video Features
- **Instagram Format**: 1080x1920 vertical video (perfect for Reels/Stories)
- **Real-time Preview**: Play/pause to see animations
- **High-Quality Export**: Export to WebM format
- **Drag & Drop**: Move elements freely on canvas
- **Layer System**: Manage element order with visual layers panel

### Editing Tools
- **Undo/Redo**: Full history support
- **Delete**: Remove elements with Delete key or button
- **Selection**: Click to select and edit properties
- **Keyboard Shortcuts**: Delete key for quick removal

## 🚀 Installation

```bash
npm install
```

## 💻 Run Development Server

```bash
npm run dev
```

Open your browser to the URL shown (usually http://localhost:5173)

## 📦 Build for Production

```bash
npm run build
```

## 🎯 Usage Guide

### Adding Text
1. Enter your text in the input field
2. Press Enter or click any typography style button
3. Text appears on canvas with typing animation

### Adding Charts
1. Enter comma-separated data (e.g., 10,20,30,40,50)
2. Click Bar, Line, or Pie chart button
3. Adjust size and color in properties panel

### Adding Shapes
1. Click Rectangle, Circle, or Rounded button
2. Drag to position
3. Customize size, color, and opacity

### Customizing Elements
1. Click any element to select it
2. Use the Properties panel to adjust:
   - Font size, color, opacity (text)
   - Animation type and duration (text)
   - Width, height, color (charts/shapes)
   - Border radius (rounded shapes)

### Managing Layers
- View all elements in the Layers panel
- Click to select an element
- Use ↑↓ buttons to reorder
- Click 🗑 to delete

### Exporting Video
1. Add and position your elements
2. Click Play to preview animations
3. Click "Export Video" button
4. Video downloads automatically as .webm file

## ⌨️ Keyboard Shortcuts

- **Delete**: Remove selected element
- **Ctrl/Cmd + Z**: Undo (via toolbar)
- **Ctrl/Cmd + Y**: Redo (via toolbar)

## 🎨 Tips for Best Results

- Use high contrast colors for text visibility
- Layer shapes behind text for backgrounds
- Combine multiple animations for dynamic effects
- Keep text concise for better readability
- Use the Neon animation for eye-catching titles
- Experiment with opacity for layered effects

## 🛠️ Tech Stack

- React 18
- Vite
- Chart.js
- html2canvas
- CSS3 Animations

## 📱 Perfect For

- Instagram Reels
- Instagram Stories
- TikTok videos
- Social media content
- AI-generated content presentations
- Data visualization videos
- Typography showcases

## 🐛 Known Limitations

- Export format is WebM (convert to MP4 if needed)
- Export captures visual elements only
- Best performance in Chrome/Edge browsers
