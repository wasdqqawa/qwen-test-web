# Minecraft-Style 3D WebGL Game (重构版 - 优化版)

这是一个使用Unity开发的Minecraft风格3D WebGL游戏，支持单人和多人模式，使用WebSocket进行网络通信。经过全面优化，支持Firefox浏览器和移动设备，并包含多语言、存档、设置等完整功能。

## 特性

- **Minecraft风格的3D世界** - 可以破坏和放置方块
- **多人游戏支持** - 通过WebSocket实现的实时多人游戏
- **Firefox兼容** - 使用WebSocket替代WebRTC，确保在Firefox等浏览器中正常运行
- **主菜单界面** - 类似Minecraft的主菜单，可以选择单人或多人模式
- **多语言支持** - 支持中文和英文界面
- **移动设备适配** - 自动检测移动设备并提供触摸控制
- **存档功能** - 支持游戏进度保存和加载
- **性能优化** - 针对移动设备的性能优化
- **设置界面** - 包含语言、按键绑定等设置选项
- **P2P网络** - 支持P2P连接模式（通过中央服务器协调）
- **黑屏修复** - 自动检测并修复场景中缺失的摄像机、灯光等基本对象
- **性能优化** - 针对Firefox和移动设备的特定优化
- **设置界面增强** - 包含语言、全屏、音量、按键绑定等完整设置选项
- **UI优化** - 增加了设置菜单，包含完整的配置选项

## 技术架构

- **前端**: Unity 3D游戏引擎，导出为WebGL
- **网络**: WebSocket协议进行实时通信
- **后端**: Node.js WebSocket服务器
- **多语言**: 基于本地化数据的多语言支持
- **存档系统**: JSON格式存档，支持WebGL环境

## 运行说明

### 1. 启动WebSocket服务器

```bash
npm install
npm start
```

或者

```bash
./start_server.sh
```

服务器将运行在 `ws://localhost:8080`

### 2. 在浏览器中打开游戏

打开 `index.html` 文件即可开始游戏。

### 3. 游戏模式

- **单人模式**: 直接在本地玩，无需网络连接
- **多人模式**: 
  - **创建游戏**: 作为主机创建一个房间
  - **加入游戏**: 输入房间ID加入其他玩家的房间

## 控制方式

### 桌面设备
- **WASD/方向键**: 移动
- **鼠标**: 视角控制
- **空格键**: 跳跃
- **左键**: 破坏方块
- **右键**: 放置方块

### 移动设备
- **虚拟摇杆**: 移动控制
- **虚拟按钮**: 跳跃、破坏、放置方块

## 网络通信

游戏使用WebSocket进行网络通信，支持以下消息类型：

- 方块更新消息 (BlockUpdateMessage)
- 玩家位置消息 (PlayerPositionMessage)
- 玩家加入/离开消息 (PlayerJoined/PlayerLeftMessage)

## 多语言支持

当前支持以下语言：
- 英语 (en)
- 中文 (zh)

语言可以在设置界面中切换。

## 存档功能

游戏支持自动和手动存档：
- **自动存档**: 游戏退出时自动保存
- **手动存档**: 通过设置界面保存游戏进度

存档文件保存在 `Application.persistentDataPath/Saves/` 目录下。

## 移动设备适配

游戏会自动检测设备类型：
- 移动设备：启用触摸控制，降低渲染质量以提高性能
- 桌面设备：启用键盘鼠标控制，使用高质量渲染

## Firefox兼容性

通过使用WebSocket替代WebRTC，确保了在Firefox浏览器中的兼容性。WebSocket是标准的Web API，在所有现代浏览器中都有良好支持。

## GitHub Pages 部署

项目支持部署到GitHub Pages：
1. 构建WebGL版本: `./build_webgl.sh`
2. 将 `Build/WebGL` 目录中的文件推送到GitHub仓库
3. 在仓库设置中启用GitHub Pages，选择根目录作为源

## 项目结构

- `index.html`: 主HTML页面，包含Minecraft风格的主菜单
- `WebSocketServer.js`: WebSocket服务器实现
- `start_server.sh`: 服务器启动脚本
- `build_webgl.sh`: WebGL构建脚本
- `Assets/Scripts/`: Unity C#脚本
  - `WebSocketNetworkManager.cs`: WebSocket网络管理器
  - `ImprovedWebSocketNetworkManager.cs`: 改进的网络管理器
  - `NetworkUIManager.cs`: 网络UI管理器
  - `MainMenuUI.cs`: 主菜单UI管理器
  - `SettingsManager.cs`: 设置和多语言管理器
  - `SaveSystem.cs`: 存档系统
  - `MobileUIManager.cs`: 移动设备UI管理器
  - `PlayerController.cs`: 玩家控制器
  - `BlockInteraction.cs`: 方块交互逻辑
  - `World.cs`: 世界生成和管理
  - `WorldGenerator.cs`: 世界生成器
  - `BlockType.cs`: 方块类型定义
  - `Network/`: 网络相关脚本
    - `NetworkPlayerController.cs`: 网络玩家控制器
    - `NetworkPlayerManager.cs`: 网络玩家管理器
    - `RemotePlayerController.cs`: 远程玩家控制器

## 开发说明

此项目已重构为使用WebSocket替代WebRTC，以提供更好的浏览器兼容性（特别是Firefox）。网络架构设计为客户端-服务器模式，所有玩家通过中央WebSocket服务器进行通信。

项目现在包含以下增强功能：
- 多语言支持
- 移动设备适配
- 存档系统
- 设置界面
- 性能优化
- P2P网络连接（通过中央服务器协调）
- GitHub Pages 部署支持
