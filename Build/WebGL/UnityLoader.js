// Unity WebGL Player Loader
// 这是一个模拟文件，实际项目中需要通过Unity构建生成

var unityInstance = null;

function createUnityInstance(canvas, unityArgs, onProgress) {
  // 模拟Unity实例创建
  console.log("Unity WebGL Player initialized");
  
  // 模拟加载进度
  if (onProgress) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      onProgress({loaded: progress, total: 100});
      if (progress >= 100) {
        clearInterval(interval);
        console.log("Unity WebGL Player loaded successfully");
      }
    }, 100);
  }
  
  return {
    Module: {},
    SendMessage: function(gameObject, method, message) {
      console.log("SendMessage:", gameObject, method, message);
    },
    SetFullscreen: function() {
      console.log("Fullscreen mode set");
    }
  };
}
