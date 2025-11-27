using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;

public class ImprovedWebSocketNetworkManager : MonoBehaviour
{
    public static ImprovedWebSocketNetworkManager Instance;
    
    [Header("Network Settings")]
    public bool isHost = false;
    public bool isSinglePlayerMode = false;
    public int maxPlayers = 4;
    public float syncRate = 0.1f;
    
    private Dictionary<string, NetworkPlayer> connectedPlayers = new Dictionary<string, NetworkPlayer>();
    private string localPlayerId;
    private bool isInitialized = false;
    
    [Header("WebSocket Settings")]
    public string serverUrl = "ws://localhost:8080"; // 默认WebSocket服务器地址
    
    private WebSocket webSocket;
    private bool isConnecting = false;
    
    [Header("Debug")]
    public bool debugMode = true;
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeNetwork();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    void InitializeNetwork()
    {
        localPlayerId = GeneratePlayerId();
        isInitialized = true;
        
        if (debugMode)
            Debug.Log("WebSocket Network Manager Initialized. Local ID: " + localPlayerId);
    }
    
    string GeneratePlayerId()
    {
        return "player_" + System.DateTime.Now.Ticks.ToString();
    }
    
    public void StartHost()
    {
        if (!isInitialized) return;
        
        // 在WebSocket实现中，主机需要启动服务器或连接到中央服务器
        // 这里我们只是设置为主机模式
        isHost = true;
        isSinglePlayerMode = false;
        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, true);
        
        // 连接到WebSocket服务器作为主机
        ConnectToServer("host");
        
        if (debugMode)
            Debug.Log("Started as Host. Player ID: " + localPlayerId);
    }
    
    public void StartSinglePlayerMode()
    {
        // 在单人模式下，我们不连接到任何网络
        isSinglePlayerMode = true;
        isHost = true;
        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, true);
        
        if (debugMode)
            Debug.Log("Started in Single Player Mode. Player ID: " + localPlayerId);
    }
    
    public void JoinGame(string roomId)
    {
        if (!isInitialized) return;
        
        // 在WebSocket实现中，加入游戏意味着连接到服务器
        isHost = false;
        isSinglePlayerMode = false;
        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, false);
        
        // 连接到WebSocket服务器作为客户端
        ConnectToServer("join", roomId);
        
        if (debugMode)
            Debug.Log("Joined Game. Room ID: " + roomId + ", Player ID: " + localPlayerId);
    }
    
    private void ConnectToServer(string mode, string roomId = "")
    {
        if (isConnecting) return;
        
        isConnecting = true;
        
        try
        {
            // 创建WebSocket连接
            string url = serverUrl;
            if (!string.IsNullOrEmpty(roomId))
            {
                url += "?roomId=" + roomId + "&playerId=" + localPlayerId + "&mode=" + mode;
            }
            else
            {
                url += "?playerId=" + localPlayerId + "&mode=" + mode;
            }
            
            webSocket = new WebSocket(url);
            
            webSocket.OnOpen += (sender, e) => {
                if (debugMode)
                    Debug.Log("WebSocket connected successfully");
                isConnecting = false;
                
                // 连接成功后，触发连接成功事件
                if (isHost)
                {
                    // 主机模式下，添加自己到玩家列表
                    if (!connectedPlayers.ContainsKey(localPlayerId))
                    {
                        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, true);
                    }
                }
            };
            
            webSocket.OnMessage += (sender, e) => {
                OnMessageReceivedFromWebSocket(e.Data);
                
                // 触发消息接收事件，供其他脚本使用
                OnNetworkMessageReceived?.Invoke(e.Data);
            };
            
            webSocket.OnError += (sender, e) => {
                Debug.LogError("WebSocket error: " + e.Message);
                isConnecting = false;
                
                // 连接失败时，切换到单人模式
                StartSinglePlayerMode();
            };
            
            webSocket.OnClose += (sender, e) => {
                Debug.Log("WebSocket connection closed: " + e.Reason);
                isConnecting = false;
                
                // 连接断开时，切换到单人模式
                StartSinglePlayerMode();
            };
            
            webSocket.ConnectAsync();
        }
        catch (Exception e)
        {
            Debug.LogError("Error connecting to WebSocket server: " + e.Message);
            isConnecting = false;
            
            // 连接失败时，切换到单人模式
            StartSinglePlayerMode();
        }
    }
    
    public delegate void NetworkMessageReceivedDelegate(string message);
    public event NetworkMessageReceivedDelegate OnNetworkMessageReceived;
    
    public void SendBlockUpdate(int x, int y, int z, BlockType blockType, bool isPlacing)
    {
        if (!isInitialized) return;
        
        if (isSinglePlayerMode) return; // 在单人模式下不发送网络消息
        
        var blockUpdate = new BlockUpdateMessage
        {
            playerId = localPlayerId,
            position = new Vector3Int(x, y, z),
            blockType = blockType,
            isPlacing = isPlacing
        };
        
        string jsonMessage = JsonUtility.ToJson(blockUpdate);
        SendMessageToServer(jsonMessage);
    }
    
    public void SendPlayerPosition(Vector3 position, Vector3 rotation)
    {
        if (!isInitialized) return;
        
        if (isSinglePlayerMode) return; // 在单人模式下不发送网络消息
        
        var playerUpdate = new PlayerPositionMessage
        {
            playerId = localPlayerId,
            position = position,
            rotation = rotation
        };
        
        string jsonMessage = JsonUtility.ToJson(playerUpdate);
        SendMessageToServer(jsonMessage);
    }
    
    private void SendMessageToServer(string message)
    {
        if (webSocket != null && webSocket.ReadyState == WebSocketState.Open)
        {
            webSocket.Send(message);
        }
        else
        {
            Debug.LogWarning("WebSocket not connected, cannot send message: " + message);
        }
    }
    
    public void OnMessageReceivedFromWebSocket(string jsonMessage)
    {
        try
        {
            // 尝试解析为BlockUpdateMessage
            if (jsonMessage.Contains("\"position\"") && jsonMessage.Contains("\"blockType\""))
            {
                BlockUpdateMessage blockMsg = JsonUtility.FromJson<BlockUpdateMessage>(jsonMessage);
                HandleBlockUpdate(blockMsg);
            }
            // 尝试解析为PlayerPositionMessage
            else if (jsonMessage.Contains("\"position\"") && jsonMessage.Contains("\"rotation\""))
            {
                PlayerPositionMessage playerMsg = JsonUtility.FromJson<PlayerPositionMessage>(jsonMessage);
                HandlePlayerPosition(playerMsg);
            }
            // 处理玩家加入消息
            else if (jsonMessage.Contains("\"type\"") && jsonMessage.Contains("\"player_joined\""))
            {
                HandlePlayerJoined(jsonMessage);
            }
            // 处理玩家离开消息
            else if (jsonMessage.Contains("\"type\"") && jsonMessage.Contains("\"player_left\""))
            {
                HandlePlayerLeft(jsonMessage);
            }
        }
        catch (System.Exception e)
        {
            Debug.LogError("Error parsing WebSocket message: " + e.Message + " | Message: " + jsonMessage);
        }
    }
    
    // JavaScript接口函数
    public void OnWebSocketMessage(string message)
    {
        OnMessageReceivedFromWebSocket(message);
    }
    
    void HandleBlockUpdate(BlockUpdateMessage msg)
    {
        if (msg.playerId == localPlayerId) return; // 不处理自己的消息
        
        if (msg.isPlacing)
        {
            World.Instance.SetBlock(msg.position.x, msg.position.y, msg.position.z, msg.blockType);
        }
        else
        {
            World.Instance.RemoveBlock(msg.position.x, msg.position.y, msg.position.z);
        }
        
        if (debugMode)
            Debug.Log($"Block update from {msg.playerId}: ({msg.position.x}, {msg.position.y}, {msg.position.z}) - {(msg.isPlacing ? "Place" : "Remove")}");
    }
    
    void HandlePlayerPosition(PlayerPositionMessage msg)
    {
        if (msg.playerId == localPlayerId) return; // 不处理自己的消息
        
        // 更新远程玩家的位置
        NetworkPlayerManager.Instance?.UpdateRemotePlayerPosition(msg.playerId, msg.position, msg.rotation);
        
        if (debugMode)
            Debug.Log($"Player {msg.playerId} position: {msg.position}");
    }
    
    void HandlePlayerJoined(string jsonMessage)
    {
        // 解析玩家加入消息
        try
        {
            var data = JsonUtility.FromJson<PlayerJoinedMessage>(jsonMessage);
            if (debugMode)
                Debug.Log($"Player joined: {data.playerId} in room {data.roomId}");
                
            // 添加到连接的玩家列表
            if (!connectedPlayers.ContainsKey(data.playerId))
            {
                connectedPlayers[data.playerId] = new NetworkPlayer(data.playerId, false);
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error parsing player joined message: " + e.Message);
        }
    }
    
    void HandlePlayerLeft(string jsonMessage)
    {
        // 解析玩家离开消息
        try
        {
            var data = JsonUtility.FromJson<PlayerLeftMessage>(jsonMessage);
            if (debugMode)
                Debug.Log($"Player left: {data.playerId} from room {data.roomId}");
                
            // 从连接的玩家列表中移除
            if (connectedPlayers.ContainsKey(data.playerId))
            {
                connectedPlayers.Remove(data.playerId);
            }
            
            // 移除远程玩家对象
            NetworkPlayerManager.Instance?.RemoveRemotePlayer(data.playerId);
        }
        catch (Exception e)
        {
            Debug.LogError("Error parsing player left message: " + e.Message);
        }
    }
    
    public bool IsConnected()
    {
        return isInitialized && 
               (isSinglePlayerMode || 
                (webSocket != null && webSocket.ReadyState == WebSocketState.Open));
    }
    
    public int GetPlayerCount()
    {
        if (isSinglePlayerMode)
        {
            return 1; // 在单人模式下，只计算本地玩家
        }
        
        // 返回连接的玩家数量
        return connectedPlayers.Count;
    }
    
    public string GetLocalPlayerId()
    {
        return localPlayerId;
    }
    
    public bool IsLocalPlayerHost()
    {
        return isHost;
    }
    
    void OnDestroy()
    {
        if (webSocket != null)
        {
            webSocket.Close();
        }
    }
}

[System.Serializable]
public class NetworkPlayer
{
    public string playerId;
    public bool isHost;
    public float lastUpdate;
    
    public NetworkPlayer(string id, bool host)
    {
        playerId = id;
        isHost = host;
        lastUpdate = Time.time;
    }
}

[System.Serializable]
public class BlockUpdateMessage
{
    public string playerId;
    public Vector3Int position;
    public BlockType blockType;
    public bool isPlacing;
}

[System.Serializable]
public class PlayerPositionMessage
{
    public string playerId;
    public Vector3 position;
    public Vector3 rotation;
}

// 消息类型用于玩家加入/离开
[System.Serializable]
public class PlayerJoinedMessage
{
    public string type;
    public string playerId;
    public string roomId;
}

[System.Serializable]
public class PlayerLeftMessage
{
    public string type;
    public string playerId;
    public string roomId;
}