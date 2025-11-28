// Game state management
const gameState = {
    currentScreen: 'loading',
    gameStarted: false,
    gamePaused: false,
    playerHealth: 100,
    fps: 0,
    lastUpdate: 0,
    frameCount: 0,
    lastFpsUpdate: 0
};

// Three.js variables
let scene, camera, renderer;
let player, worldObjects = [];
let clock = new THREE.Clock();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    mainMenu: document.getElementById('mainMenu'),
    settingsMenu: document.getElementById('settingsMenu'),
    gameScreen: document.getElementById('gameScreen'),
    pauseMenu: document.getElementById('pauseMenu'),
    loadingProgress: document.getElementById('loadingProgress'),
    healthFill: document.getElementById('healthFill'),
    healthText: document.getElementById('healthText'),
    fpsCounter: document.getElementById('fpsCounter'),
    
    // Buttons
    singlePlayerBtn: document.getElementById('singlePlayerBtn'),
    multiplayerBtn: document.getElementById('multiplayerBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    quitBtn: document.getElementById('quitBtn'),
    backToMainBtn: document.getElementById('backToMainBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    pauseSettingsBtn: document.getElementById('pauseSettingsBtn'),
    returnToMainBtn: document.getElementById('returnToMainBtn'),
    quitGameBtn: document.getElementById('quitGameBtn')
};

// Initialize the game
function init() {
    setupEventListeners();
    simulateLoading();
}

// Simulate loading process
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                showScreen('mainMenu');
                gameState.currentScreen = 'mainMenu';
            }, 500);
        }
        elements.loadingProgress.style.width = progress + '%';
    }, 200);
}

// Set up all event listeners
function setupEventListeners() {
    // Main menu buttons
    elements.singlePlayerBtn.addEventListener('click', () => startGame('single'));
    elements.multiplayerBtn.addEventListener('click', () => startGame('multi'));
    elements.settingsBtn.addEventListener('click', () => showScreen('settingsMenu'));
    elements.quitBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to quit?')) {
            window.close();
        }
    });
    
    // Settings menu buttons
    elements.backToMainBtn.addEventListener('click', () => showScreen('mainMenu'));
    
    // Pause menu buttons
    elements.resumeBtn.addEventListener('click', resumeGame);
    elements.pauseSettingsBtn.addEventListener('click', () => {
        showScreen('settingsMenu');
        gameState.gamePaused = true;
    });
    elements.returnToMainBtn.addEventListener('click', returnToMainMenu);
    elements.quitGameBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to quit the game?')) {
            returnToMainMenu();
        }
    });
    
    // Keyboard controls for game
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    
    // Pause on ESC key
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && gameState.gameStarted && !gameState.gamePaused) {
            pauseGame();
        }
    });
}

// Start the game
function startGame(mode) {
    console.log(`Starting ${mode} game`);
    showScreen('gameScreen');
    gameState.currentScreen = 'game';
    gameState.gameStarted = true;
    gameState.gamePaused = false;
    
    // Initialize Three.js scene after a short delay to allow screen transition
    setTimeout(initGameScene, 100);
}

// Initialize Three.js game scene
function initGameScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 0, 500);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10); // Set initial camera position
    
    // Create renderer
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0.5).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2E8B57,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Create player (simple cube for now)
    const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x4cc9f0 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;
    player.castShadow = true;
    scene.add(player);
    
    // Create some environment objects
    createEnvironment();
    
    // Start game loop
    renderer.setAnimationLoop(animate);
    
    // Update health display
    updateHealthDisplay();
}

// Create environment objects
function createEnvironment() {
    // Trees
    for (let i = 0; i < 20; i++) {
        const tree = createTree();
        tree.position.x = (Math.random() - 0.5) * 80;
        tree.position.z = (Math.random() - 0.5) * 80;
        // Make sure trees don't spawn on top of each other
        scene.add(tree);
        worldObjects.push(tree);
    }
    
    // Rocks
    for (let i = 0; i < 15; i++) {
        const rock = createRock();
        rock.position.x = (Math.random() - 0.5) * 80;
        rock.position.z = (Math.random() - 0.5) * 80;
        scene.add(rock);
        worldObjects.push(rock);
    }
    
    // Buildings
    for (let i = 0; i < 5; i++) {
        const building = createBuilding();
        building.position.x = (Math.random() - 0.5) * 60;
        building.position.z = (Math.random() - 0.5) * 60;
        scene.add(building);
        worldObjects.push(building);
    }
}

// Create a tree
function createTree() {
    const group = new THREE.Group();
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    group.add(trunk);
    
    // Leaves
    const leavesGeometry = new THREE.SphereGeometry(2, 8, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 5;
    leaves.castShadow = true;
    group.add(leaves);
    
    return group;
}

// Create a rock
function createRock() {
    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x808080,
        roughness: 0.9,
        metalness: 0.1
    });
    const rock = new THREE.Mesh(geometry, material);
    rock.castShadow = true;
    return rock;
}

// Create a building
function createBuilding() {
    const group = new THREE.Group();
    
    // Building base
    const baseGeometry = new THREE.BoxGeometry(4, 6, 4);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x708090 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    group.add(base);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xB22222 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 4;
    roof.castShadow = true;
    group.add(roof);
    
    return group;
}

// Game animation loop
function animate() {
    if (!gameState.gameStarted || gameState.gamePaused) return;
    
    const delta = clock.getDelta();
    
    // Player movement
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    
    if (moveForward || moveBackward) velocity.z -= direction.z * 200.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 200.0 * delta;
    
    // Apply movement to player
    player.translateX(velocity.x * delta);
    player.translateZ(velocity.z * delta);
    
    // Keep player within bounds
    player.position.x = Math.max(-45, Math.min(45, player.position.x));
    player.position.z = Math.max(-45, Math.min(45, player.position.z));
    
    // Update camera to follow player
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10; // Behind player
    camera.position.y = player.position.y + 5; // Above player
    camera.lookAt(player.position.x, player.position.y, player.position.z);
    
    // Update FPS counter
    updateFPS(delta);
    
    renderer.render(scene, camera);
}

// Update FPS counter
function updateFPS(delta) {
    gameState.frameCount++;
    gameState.lastUpdate += delta;
    
    if (gameState.lastUpdate > 0.5) { // Update every 0.5 seconds
        gameState.fps = Math.round(gameState.frameCount / gameState.lastUpdate);
        elements.fpsCounter.textContent = `FPS: ${gameState.fps}`;
        
        gameState.frameCount = 0;
        gameState.lastUpdate = 0;
    }
}

// Update health display
function updateHealthDisplay() {
    elements.healthFill.style.width = gameState.playerHealth + '%';
    elements.healthText.textContent = `${gameState.playerHealth}%`;
}

// Keyboard event handlers
function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (canJump === true) velocity.y = 10;
            canJump = false;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

// Show a specific screen
function showScreen(screenName) {
    // Hide all screens
    elements.loadingScreen.classList.add('hidden');
    elements.mainMenu.classList.add('hidden');
    elements.settingsMenu.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.pauseMenu.classList.add('hidden');
    
    // Show requested screen
    elements[screenName].classList.remove('hidden');
    gameState.currentScreen = screenName;
    
    // Special handling for game screen
    if (screenName === 'gameScreen' && renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

// Pause the game
function pauseGame() {
    gameState.gamePaused = true;
    elements.pauseMenu.classList.remove('hidden');
    document.exitPointerLock();
}

// Resume the game
function resumeGame() {
    gameState.gamePaused = false;
    elements.pauseMenu.classList.add('hidden');
    document.body.requestPointerLock();
}

// Return to main menu
function returnToMainMenu() {
    gameState.gameStarted = false;
    gameState.gamePaused = false;
    
    if (renderer) {
        renderer.setAnimationLoop(null); // Stop animation loop
    }
    
    showScreen('mainMenu');
    
    // Reset game state
    gameState.playerHealth = 100;
    updateHealthDisplay();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Device detection
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

// Apply UI adjustments based on device
function adjustUIForDevice() {
    if (isMobile()) {
        // Mobile-specific UI adjustments
        document.body.classList.add('mobile-device');
    } else {
        // Desktop-specific UI adjustments
        document.body.classList.add('desktop-device');
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    adjustUIForDevice();
    init();
});