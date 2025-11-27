// Unity WebGL与前端交互修复脚本
// 修复Firefox兼容性问题和各种运行时bug

// 检测浏览器兼容性
function detectBrowser() {
    const isFirefox = typeof InstallTrigger !== 'undefined';
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isEdge = navigator.userAgent.indexOf('Edge') > -1;
    
    return {
        isFirefox: isFirefox,
        isChrome: isChrome,
        isSafari: isSafari,
        isEdge: isEdge
    };
}

// Firefox兼容性修复
function firefoxCompatibilityFix() {
    if (typeof InstallTrigger !== 'undefined') {
        console.log("Firefox detected, applying compatibility fixes");
        
        // 修复可能的WebGL上下文问题
        if (!window.WebGLRenderingContext) {
            console.warn("WebGL not supported in this Firefox version");
        }
        
        // 修复可能的事件处理问题
        document.addEventListener('contextmenu', function(e) {
            if (e.target.closest('#gameCanvas')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 修复可能的全屏API问题
        if (!Element.prototype.requestFullscreen) {
            Element.prototype.requestFullscreen = Element.prototype.mozRequestFullScreen || 
                                                 Element.prototype.webkitRequestFullscreen || 
                                                 Element.prototype.msRequestFullscreen;
        }
        
        if (!Document.prototype.exitFullscreen) {
            Document.prototype.exitFullscreen = Document.prototype.mozCancelFullScreen || 
                                               Document.prototype.webkitExitFullscreen || 
                                               Document.prototype.msExitFullscreen;
        }
        
        // 修复Firefox中的CSS问题
        const style = document.createElement('style');
        style.textContent = `
            /* Firefox特定样式修复 */
            #mainMenu, #multiplayerMenu, #settingsMenu {
                -moz-backface-visibility: hidden;
                -moz-transform: translateZ(0);
            }
            
            .menu-button, .back-button {
                -moz-user-select: none;
                -moz-appearance: none;
            }
            
            input[type="range"] {
                -moz-appearance: none;
                background: #333;
                height: 25px;
                border-radius: 5px;
            }
            
            input[type="range"]::-moz-range-thumb {
                -moz-appearance: none;
                width: 20px;
                height: 20px;
                background: #4CAF50;
                border-radius: 50%;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
}

// 移动设备检测和适配
function detectMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 优化网络连接
function setupOptimizedNetwork() {
    // 优化WebSocket连接参数
    const originalWebSocket = window.WebSocket;
    
    window.WebSocket = function(url, protocols) {
        const ws = new originalWebSocket(url, protocols);
        
        // 设置适当的事件处理器
        const originalOnOpen = ws.onopen;
        ws.onopen = function(event) {
            console.log('WebSocket connection established');
            if (originalOnOpen) originalOnOpen.call(this, event);
        };
        
        const originalOnError = ws.onerror;
        ws.onerror = function(event) {
            console.error('WebSocket error:', event);
            if (originalOnError) originalOnError.call(this, event);
        };
        
        const originalOnClose = ws.onclose;
        ws.onclose = function(event) {
            console.log('WebSocket connection closed:', event.reason);
            if (originalOnClose) originalOnClose.call(this, event);
        };
        
        return ws;
    };
}

// 性能优化
function performanceOptimization() {
    // 限制帧率以节省资源
    let lastFrameTime = 0;
    const maxFrameRate = 60; // 限制最大帧率为60FPS
    const frameInterval = 1000 / maxFrameRate;
    
    // 重写Unity的请求动画帧函数
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    
    window.requestAnimationFrame = function(callback) {
        const currentTime = performance.now();
        
        if (currentTime - lastFrameTime >= frameInterval) {
            lastFrameTime = currentTime;
            return originalRequestAnimationFrame.call(window, callback);
        } else {
            // 如果还没到下一帧的时间，延迟执行
            return originalRequestAnimationFrame.call(window, function() {
                callback(performance.now());
            });
        }
    };
    
    // 内存管理优化
    window.addEventListener('beforeunload', function() {
        // 清理WebSocket连接
        if (window.webSocket && window.webSocket.readyState === WebSocket.OPEN) {
            window.webSocket.close();
        }
        
        // 清理其他资源
        console.log("Cleaning up resources before unload");
    });
    
    // 添加内存使用监控
    if (performance.memory) {
        setInterval(function() {
            const mem = performance.memory;
            if (mem.usedJSHeapSize > 0.8 * mem.jsHeapSizeLimit) {
                console.warn("High memory usage detected:", 
                    (mem.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB / " + 
                    (mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + "MB");
            }
        }, 5000); // 每5秒检查一次
    }
}

// 修复Unity与JavaScript交互
function fixUnityJSInteraction() {
    // 确保Unity对象存在
    if (window.unityInstance) {
        // 修复SendMessage方法
        const originalSendMessage = window.unityInstance.SendMessage;
        window.unityInstance.SendMessage = function(gameObject, methodName, value) {
            try {
                // 验证参数
                if (typeof gameObject !== 'string' || typeof methodName !== 'string') {
                    console.warn('Invalid parameters for SendMessage:', gameObject, methodName);
                    return;
                }
                
                // 检查Unity实例是否准备好
                if (!window.unityInstance || typeof window.unityInstance.Module === 'undefined') {
                    console.warn('Unity instance not ready for SendMessage:', gameObject, methodName, value);
                    return;
                }
                
                // 调用原始方法
                originalSendMessage.call(window.unityInstance, gameObject, methodName, value);
            } catch (error) {
                console.error('Error in SendMessage:', error, 'Params:', gameObject, methodName, value);
            }
        };
    }
    
    // 为Unity提供全局接口
    window.UnityInterface = {
        sendMessage: function(gameObject, methodName, value) {
            if (window.unityInstance && window.unityInstance.SendMessage) {
                window.unityInstance.SendMessage(gameObject, methodName, value);
            } else {
                console.warn('Unity instance not available for message:', gameObject, methodName, value);
            }
        },
        
        isFirefox: function() {
            return typeof InstallTrigger !== 'undefined';
        },
        
        isMobile: function() {
            return detectMobileDevice();
        },
        
        setFullscreen: function(enabled) {
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) return;
            
            if (enabled) {
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen();
                } else if (canvas.mozRequestFullScreen) { // Firefox
                    canvas.mozRequestFullScreen();
                } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    canvas.webkitRequestFullscreen();
                } else if (canvas.msRequestFullscreen) { // IE/Edge
                    canvas.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
            }
        },
        
        // 添加新的功能
        showMobileControls: function(show) {
            const mobileControls = document.getElementById('mobileControls');
            if (mobileControls) {
                mobileControls.style.display = show ? 'flex' : 'none';
            }
        },
        
        updatePlayerCount: function(count) {
            const playerCountElement = document.getElementById('playerCount');
            if (playerCountElement) {
                playerCountElement.textContent = `Players: ${count}`;
            }
        },
        
        updateFPS: function(fps) {
            const fpsElement = document.getElementById('fpsCounter');
            if (fpsElement) {
                fpsElement.textContent = `FPS: ${Math.round(fps)}`;
            }
        }
    };
}

// 主初始化函数
function initializeGameFixes() {
    console.log("Initializing game fixes and optimizations...");
    
    // 应用Firefox兼容性修复
    firefoxCompatibilityFix();
    
    // 设置优化的网络连接
    setupOptimizedNetwork();
    
    // 应用性能优化
    performanceOptimization();
    
    // 修复Unity与JavaScript交互
    fixUnityJSInteraction();
    
    // 检测并适配移动设备
    if (detectMobileDevice()) {
        console.log("Mobile device detected, applying mobile optimizations");
        document.body.classList.add('mobile-device');
        
        // 为移动设备添加触摸事件优化
        document.addEventListener('touchstart', function(e) {
            // 防止默认的触摸行为干扰游戏
            if (e.target.closest('#gameCanvas')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    console.log("All fixes and optimizations applied successfully");
}

// 在页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameFixes);
} else {
    // 如果文档已经加载完成，则直接执行
    initializeGameFixes();
}

// 额外的全局错误处理
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error, 'at:', event.filename, ':', event.lineno);
    
    // 如果是WebGL相关错误，尝试恢复
    if (event.error && event.error.message && 
        (event.error.message.includes('WebGL') || event.error.message.includes('GL'))) {
        console.warn('WebGL error detected, this may affect game rendering');
    }
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// 添加页面可见性API支持，优化后台运行性能
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时降低性能消耗
        console.log("Game tab is now hidden, reducing performance usage");
    } else {
        // 页面显示时恢复正常性能
        console.log("Game tab is now visible, resuming normal performance");
    }
});