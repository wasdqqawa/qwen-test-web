// 改进的WebSocket服务器，支持P2P连接协调
const WebSocket = require('ws');

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8080 });

console.log('改进的WebSocket服务器已启动，端口 8080');

// 存储房间和客户端信息
wss.rooms = {};
wss.clients = {};

wss.on('connection', (ws, req) => {
    console.log('新客户端连接');
    
    // 解析URL参数
    const url = new URL(req.url, `http://${req.headers.host}`);
    const roomId = url.searchParams.get('roomId') || 'default';
    const playerId = url.searchParams.get('playerId');
    const mode = url.searchParams.get('mode');
    
    console.log(`客户端信息 - Room: ${roomId}, Player: ${playerId}, Mode: ${mode}`);
    
    // 存储客户端信息
    ws.roomId = roomId;
    ws.playerId = playerId;
    ws.mode = mode;
    
    // 将客户端添加到房间
    if (!wss.rooms[roomId]) {
        wss.rooms[roomId] = {
            clients: new Set(),
            host: null
        };
    }
    
    // 如果是主机且还没有主机，则设置为主机
    if (mode === 'host' && !wss.rooms[roomId].host) {
        wss.rooms[roomId].host = playerId;
    }
    
    wss.rooms[roomId].clients.add(ws);
    
    // 将客户端添加到全局客户端列表
    wss.clients[playerId] = ws;
    
    // 向房间内其他客户端广播新玩家加入
    broadcastToRoom(roomId, {
        type: 'player_joined',
        playerId: playerId,
        roomId: roomId,
        playerCount: wss.rooms[roomId].clients.size
    }, ws);
    
    // 发送房间当前状态给新加入的客户端
    const roomClients = Array.from(wss.rooms[roomId].clients).map(client => ({
        playerId: client.playerId,
        isHost: client.playerId === wss.rooms[roomId].host
    }));
    
    ws.send(JSON.stringify({
        type: 'room_state',
        players: roomClients,
        host: wss.rooms[roomId].host,
        playerCount: wss.rooms[roomId].clients.size
    }));
    
    // 处理接收到的消息
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`收到消息: ${data.type}`);
            
            // 根据消息类型进行不同处理
            switch (data.type) {
                case 'block_update':
                    // 转发方块更新消息
                    broadcastToRoom(roomId, data, ws);
                    break;
                    
                case 'player_position':
                    // 转发玩家位置消息
                    broadcastToRoom(roomId, data, ws);
                    break;
                    
                case 'chat_message':
                    // 转发聊天消息
                    broadcastToRoom(roomId, data, ws);
                    break;
                    
                case 'p2p_signal':
                    // P2P信号传输 - 转发给指定玩家
                    const targetClient = wss.clients[data.targetPlayerId];
                    if (targetClient && targetClient.readyState === WebSocket.OPEN) {
                        targetClient.send(JSON.stringify({
                            type: 'p2p_signal',
                            signal: data.signal,
                            senderId: playerId,
                            signalType: data.signalType
                        }));
                    }
                    break;
                    
                case 'request_p2p_connect':
                    // 请求P2P连接 - 通知目标玩家
                    const targetPlayer = wss.clients[data.targetPlayerId];
                    if (targetPlayer && targetPlayer.readyState === WebSocket.OPEN) {
                        targetPlayer.send(JSON.stringify({
                            type: 'p2p_request',
                            requesterId: playerId,
                            requesterInfo: data.requesterInfo
                        }));
                    }
                    break;
                    
                default:
                    // 默认情况下转发给同房间的其他客户端
                    broadcastToRoom(roomId, data, ws);
                    break;
            }
        } catch (e) {
            console.error('解析消息错误:', e);
            console.error('错误消息:', message);
        }
    });
    
    // 处理连接关闭
    ws.on('close', () => {
        console.log(`客户端断开连接 - Player: ${playerId}`);
        
        // 从房间中移除客户端
        if (wss.rooms[roomId]) {
            wss.rooms[roomId].clients.delete(ws);
            
            // 如果房间为空，删除房间
            if (wss.rooms[roomId].clients.size === 0) {
                delete wss.rooms[roomId];
            } else {
                // 如果断开的是主机，选择新的主机
                if (wss.rooms[roomId].host === playerId) {
                    const remainingClients = Array.from(wss.rooms[roomId].clients);
                    if (remainingClients.length > 0) {
                        wss.rooms[roomId].host = remainingClients[0].playerId;
                        console.log(`新的主机: ${wss.rooms[roomId].host}`);
                    }
                }
                
                // 向房间内其他客户端广播玩家离开
                broadcastToRoom(roomId, {
                    type: 'player_left',
                    playerId: playerId,
                    roomId: roomId,
                    newHost: wss.rooms[roomId].host,
                    playerCount: wss.rooms[roomId].clients.size
                }, ws);
            }
        }
        
        // 从全局客户端列表中移除
        if (wss.clients[playerId]) {
            delete wss.clients[playerId];
        }
    });
    
    // 处理错误
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });
});

// 向指定房间广播消息（除了发送者）
function broadcastToRoom(roomId, message, senderWs) {
    if (wss.rooms[roomId]) {
        const data = typeof message === 'string' ? message : JSON.stringify(message);
        
        wss.rooms[roomId].clients.forEach(client => {
            if (client !== senderWs && client.readyState === WebSocket.OPEN) {
                try {
                    client.send(data);
                } catch (e) {
                    console.error('发送消息错误:', e);
                }
            }
        });
    }
}

// 向所有客户端广播消息
function broadcastToAll(message) {
    const data = typeof message === 'string' ? message : JSON.stringify(message);
    
    for (const playerId in wss.clients) {
        const client = wss.clients[playerId];
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(data);
            } catch (e) {
                console.error('发送消息错误:', e);
            }
        }
    }
}

console.log('WebSocket服务器监听中...');