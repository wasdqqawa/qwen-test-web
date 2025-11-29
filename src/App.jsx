import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Main App Component
function App() {
  const [photos, setPhotos] = useState([]);
  const [currentStream, setCurrentStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setCurrentStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        // Fallback: show a placeholder or error message
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture photo function
  const capturePhoto = async () => {
    if (!videoRef.current) return;

    // Play shutter sound
    playShutterSound();

    // Create canvas to capture video frame
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    
    // Generate AI caption (simulated for now)
    const caption = await generateAICaption(imageDataUrl);
    
    // Create new photo object
    const newPhoto = {
      id: Date.now(),
      imageDataUrl,
      caption: caption,
      date: new Date().toLocaleDateString(),
      position: { x: 0, y: 0 },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      isDeveloping: true
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    
    // Simulate developing effect
    setTimeout(() => {
      setPhotos(prev => prev.map(photo => 
        photo.id === newPhoto.id ? { ...photo, isDeveloping: false } : photo
      ));
    }, 2000);
  };

  // Play shutter sound
  const playShutterSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Generate AI caption (simulated)
  const generateAICaption = async (imageDataUrl) => {
    // In a real implementation, this would call the Gemini Flash API
    // For now, return a placeholder based on browser language
    const userLang = navigator.language || 'en';
    const captions = {
      'en': 'A beautiful moment captured in time!',
      'zh': '时光定格的美好瞬间！',
      'ja': '時の瞬間を捉えた美しい写真！',
      'es': '¡Un hermoso momento capturado en el tiempo!',
      'fr': 'Un beau moment capturé dans le temps !',
      'de': 'Ein wunderschöner Moment, eingefangen in der Zeit!',
      'it': 'Un momento bellissimo catturato nel tempo!',
      'pt': 'Um momento lindo capturado no tempo!',
      'ko': '시간 속에 간직된 아름다운 순간!',
      'ru': 'Прекрасный момент, зафиксированный во времени!'
    };
    
    return captions[userLang.split('-')[0]] || captions['en'];
  };

  // Handle drag start for photo
  const handleDragStart = (e, photoId) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setPhotos(prev => prev.map(p => 
      p.id === photoId 
        ? { ...p, isDragging: true, dragOffset: { x: offsetX, y: offsetY } } 
        : p
    ));
  };

  // Handle drag
  const handleDrag = (e, photoId) => {
    if (!e.buttons) {
      handleDragEnd(photoId);
      return;
    }
    
    setPhotos(prev => prev.map(photo => {
      if (photo.id === photoId && photo.isDragging) {
        return {
          ...photo,
          position: {
            x: e.clientX - photo.dragOffset.x,
            y: e.clientY - photo.dragOffset.y
          }
        };
      }
      return photo;
    }));
  };

  // Handle drag end
  const handleDragEnd = (photoId) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, isDragging: false } : photo
    ));
  };

  // Update caption
  const updateCaption = (photoId, newCaption) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, caption: newCaption } : photo
    ));
  };

  // Delete photo
  const deletePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // Download photo
  const downloadPhoto = (photoId) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = photo.imageDataUrl;
    link.download = `retro-photo-${photoId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      {/* Camera Container */}
      <div 
        ref={containerRef}
        className="camera-container"
        style={{
          position: 'fixed',
          bottom: '64px',
          left: '64px',
          width: '450px',
          height: '450px',
          zIndex: 20,
          backgroundImage: 'url(https://s.baoyu.io/images/retro-camera.webp)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'left bottom',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Video Viewfinder */}
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            position: 'absolute',
            bottom: '32%',
            left: '62%',
            transform: 'translateX(-50%)',
            width: '27%',
            height: '27%',
            borderRadius: '50%',
            zIndex: 30,
            objectFit: 'cover'
          }}
        />
        
        {/* Shutter Button */}
        <div
          className="shutter-button"
          onClick={capturePhoto}
          style={{
            position: 'absolute',
            bottom: '40%',
            left: '18%',
            width: '11%',
            height: '11%',
            cursor: 'pointer',
            zIndex: 30,
            backgroundColor: 'transparent' // Invisible
          }}
        />
        
        {/* Photo Ejection Slot */}
        <div
          className="photo-slot"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '35%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          {photos
            .filter(photo => photo.isDeveloping)
            .map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isEjecting={true}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onUpdateCaption={updateCaption}
                onDelete={deletePhoto}
                onDownload={downloadPhoto}
              />
            ))
          }
        </div>
      </div>

      {/* Photo Wall */}
      <div className="photo-wall">
        {photos
          .filter(photo => !photo.isDeveloping)
          .map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isEjecting={false}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onUpdateCaption={updateCaption}
              onDelete={deletePhoto}
              onDownload={downloadPhoto}
            />
          ))
        }
      </div>

      {/* Title */}
      <h1 className="title">Bao Retro Camera</h1>

      {/* Instructions */}
      <div className="instructions">
        <p>Click the camera button to take a photo. Drag photos to arrange them on the wall.</p>
      </div>
    </div>
  );
}

// Photo Card Component
const PhotoCard = ({ 
  photo, 
  isEjecting, 
  onDragStart, 
  onDrag, 
  onDragEnd, 
  onUpdateCaption, 
  onDelete, 
  onDownload 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(photo.caption);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showTextControls, setShowTextControls] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditText(photo.caption);
  };

  const handleSave = () => {
    onUpdateCaption(photo.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(photo.caption);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleRegenerate = async () => {
    // Simulate AI regeneration
    const newCaption = await regenerateAICaption(photo.imageDataUrl);
    onUpdateCaption(photo.id, newCaption);
  };

  const regenerateAICaption = async (imageDataUrl) => {
    // In a real implementation, this would call the Gemini Flash API
    // For now, return a different placeholder
    const options = [
      'What a wonderful sight!',
      'A memory to cherish!',
      'Perfectly captured!',
      'Such a beautiful moment!',
      'Timeless beauty!',
      'A picture worth a thousand words!'
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  // Calculate position based on whether it's ejecting or on the wall
  const positionStyle = isEjecting 
    ? {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '100%',
        zIndex: 10,
        animation: 'ejectPhoto 1.5s forwards'
      }
    : {
        position: 'absolute',
        left: `${photo.position.x}px`,
        top: `${photo.position.y}px`,
        zIndex: 25,
        cursor: 'move',
        transition: photo.isDragging ? 'none' : 'left 0.2s, top 0.2s'
      };

  return (
    <div
      className="photo-card"
      style={{
        ...positionStyle,
        width: isEjecting ? '100%' : '200px', // Adjust width as needed
        aspectRatio: '3/4', // 3:4 portrait aspect ratio
      }}
      onMouseDown={(e) => {
        if (!isEjecting) {
          onDragStart(e, photo.id);
        }
      }}
      onMouseMove={(e) => {
        if (!isEjecting && photo.isDragging) {
          onDrag(e, photo.id);
        }
      }}
      onMouseUp={() => {
        if (!isEjecting) {
          onDragEnd(photo.id);
        }
      }}
      onMouseLeave={() => {
        if (!isEjecting) {
          onDragEnd(photo.id);
        }
      }}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {/* Photo Frame */}
      <div 
        className="photo-frame"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Toolbar (shows on hover) */}
        {showToolbar && !isEjecting && (
          <div 
            className="toolbar"
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              display: 'flex',
              gap: '5px',
              zIndex: 30
            }}
          >
            <button 
              className="toolbar-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo.id);
              }}
              title="Download"
            >
              ↓
            </button>
            <button 
              className="toolbar-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo.id);
              }}
              title="Delete"
            >
              ×
            </button>
          </div>
        )}

        {/* Photo Area */}
        <div 
          className="photo-area"
          style={{
            flex: '1',
            backgroundImage: `url(${photo.imageDataUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: photo.isDeveloping ? 'blur(5px) grayscale(100%) brightness(0.7)' : 'none',
            transition: photo.isDeveloping ? 'none' : 'filter 2s ease-in-out',
            position: 'relative'
          }}
        >
          {photo.isDeveloping && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#666'
              }}
            >
              Developing...
            </div>
          )}
        </div>

        {/* Text Area */}
        <div 
          className="text-area"
          style={{
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #eee',
            minHeight: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onMouseEnter={() => setShowTextControls(true)}
          onMouseLeave={() => setShowTextControls(false)}
        >
          {/* Date */}
          <div 
            className="date"
            style={{
              fontSize: '12px',
              color: '#888',
              marginBottom: '4px'
            }}
          >
            {photo.date}
          </div>
          
          {/* Caption */}
          <div 
            className="caption"
            style={{
              fontFamily: 'cursive, "Comic Sans MS", sans-serif',
              fontSize: '14px',
              color: '#333',
              cursor: 'text',
              minHeight: '20px'
            }}
            onDoubleClick={handleEdit}
          >
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                autoFocus
                style={{
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  padding: '2px 4px',
                  fontFamily: 'cursive, "Comic Sans MS", sans-serif'
                }}
              />
            ) : (
              photo.caption
            )}
          </div>
          
          {/* Text Controls (pencil and refresh icons) */}
          {showTextControls && !isEditing && (
            <div 
              className="text-controls"
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                display: 'flex',
                gap: '5px',
                zIndex: 30
              }}
            >
              <button 
                className="text-control-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                title="Edit"
              >
                ✏️
              </button>
              <button 
                className="text-control-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegenerate();
                }}
                title="Regenerate"
              >
                ♻️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;