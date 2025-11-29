# Bao Retro Camera

A nostalgic retro camera web application built with React that allows users to take photos with their webcam and create AI-powered captions. The app features a vintage camera interface with photo ejection animation, drag-and-drop photo wall, and editable captions.

## Features

- **Retro Camera Interface**: Authentic vintage camera design with realistic UI elements
- **Webcam Integration**: Access to device camera for taking photos
- **Photo Ejection Animation**: Photos slide out from the camera with a developing effect
- **Drag-and-Drop Photo Wall**: Move photos around the screen after capturing
- **AI-Powered Captions**: Generate personalized captions based on photo content (simulated)
- **Multi-language Support**: Captions adapt to browser language
- **Editable Text**: Double-click or use pencil icon to edit captions
- **Photo Controls**: Download and delete functionality
- **Handwritten Font Style**: All text uses a retro handwritten style

## Technical Implementation

- **Frontend**: React with hooks for state management
- **Styling**: CSS with handwritten fonts and retro aesthetic
- **Camera Access**: WebRTC API for webcam integration
- **Canvas**: HTML5 Canvas for photo capture and processing
- **Drag-and-Drop**: Custom implementation using mouse events
- **Responsive Design**: Fixed camera position with relative element positioning

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the provided URL
5. Allow camera access when prompted
6. Click the camera button to take photos
7. Drag photos to arrange them on your wall

## GitHub Pages Deployment

This application is designed to work on GitHub Pages:

1. Run `npm run build` to create a production build
2. The `dist` folder contains the deployable application
3. Configure GitHub Pages to serve from the `dist` folder

## File Structure

```
src/
├── App.jsx         # Main application component
├── App.css         # Styling for the application
├── index.jsx       # Entry point that renders the app
public/
├── index.html      # HTML template
```

## Browser Compatibility

- Modern browsers with WebRTC support (Chrome, Firefox, Edge, Safari)
- Camera access requires HTTPS (except localhost for development)
- Works on mobile devices with camera access

## AI Integration

The application simulates AI caption generation based on the user's browser language. In a production environment, this would connect to the Gemini Flash API to analyze image content and generate personalized blessings or comments.

## Customization

The retro camera image is loaded from `https://s.baoyu.io/images/retro-camera.webp`. To use a different camera image, update the background image URL in the camera container styling.

## License

MIT License