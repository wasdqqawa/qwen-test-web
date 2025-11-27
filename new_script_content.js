        // 设置音量滑块事件
        document.getElementById('volumeSlider').addEventListener('input', function() {
            const volume = this.value;
            console.log("Volume changed to: " + volume);

            // 通知Unity更改音量
            if (window.unityInstance) {
                window.unityInstance.SendMessage('SettingsManager', 'OnVolumeChangedFromJS', volume);
            }
        });
        
        // 添加游戏内UI按钮事件
        document.getElementById('pauseButton').addEventListener('click', function() {
            if (window.unityInstance) {
                window.unityInstance.SendMessage('InGameUIManager', 'TogglePause', '');
            }
        });
        
        document.getElementById('resumeButton').addEventListener('click', function() {
            if (window.unityInstance) {
                window.unityInstance.SendMessage('InGameUIManager', 'ResumeGame', '');
            }
        });
        
        document.getElementById('settingsInGameButton').addEventListener('click', function() {
            if (window.unityInstance) {
                window.unityInstance.SendMessage('InGameUIManager', 'OpenSettings', '');
            }
        });
        
        document.getElementById('mainMenuButton').addEventListener('click', function() {
            if (window.unityInstance) {
                window.unityInstance.SendMessage('InGameUIManager', 'ReturnToMainMenu', '');
            }
        });
        
        document.getElementById('quitInGameButton').addEventListener('click', function() {
            if (window.unityInstance) {
                window.unityInstance.SendMessage('InGameUIManager', 'QuitGame', '');
            }
        });
        
        // 移动端控制事件
        document.getElementById('mobileJumpButton').addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (window.unityInstance) {
                window.unityInstance.SendMessage('PlayerController', 'SetMobileJumpInput', true);
            }
        });
        
        document.getElementById('mobileBreakButton').addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (window.unityInstance) {
                window.unityInstance.SendMessage('BlockPlacer', 'OnMobileBreakBlock', '');
            }
        });
        
        document.getElementById('mobilePlaceButton').addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (window.unityInstance) {
                window.unityInstance.SendMessage('BlockPlacer', 'OnMobilePlaceBlock', '');
            }
        });
        
        // 添加键盘事件处理
        document.addEventListener('keydown', function(event) {
            // 检测ESC键来暂停游戏
            if (event.key === 'Escape') {
                if (window.unityInstance) {
                    window.unityInstance.SendMessage('InGameUIManager', 'TogglePause', '');
                }
            }
        });
    </script>
</body>
</html>