using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using AOT;
using System.Runtime.InteropServices;

public class WebRTCNetworkManager : MonoBehaviour
{
    public static WebRTCNetworkManager Instance;
    
    [Header("Network Settings")]
    public bool isHost = false;
    public bool isSinglePlayerMode = false;  // 添加单人模式标志
    public int maxPlayers = 4;
    public float syncRate = 0.1f;
    
    private Dictionary<string, NetworkPlayer> connectedPlayers = new Dictionary<string, NetworkPlayer>();
    private string localPlayerId;
    private bool isInitialized = false;
    
    [Header("Debug")]
    public bool debugMode = true;
    
#if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern bool WebRTC_Init();
    
    [DllImport("__Internal")]
    private static extern bool WebRTC_JoinRoom(string roomId);
    
    [DllImport("__Internal")]
    private static extern bool WebRTC_CreateRoom(string roomId);
    
    [DllImport("__Internal")]
    private static extern bool WebRTC_SendMessage(string message);
    
    [DllImport("__Internal")]
    private static extern bool WebRTC_IsConnected();
    
    [DllImport("__Internal")]
    private static extern int WebRTC_GetPeerCount();
    
    public delegate void NetworkMessageReceivedDelegate(string message);
    public event NetworkMessageReceivedDelegate OnNetworkMessageReceived;

    [MonoPInvokeCallback(typeof(Action<string>))]
    public static void OnWebRTCMessage(string message)
    {
        if (Instance != null)
        {
            Instance.OnMessageReceivedFromWebRTC(message);
        }
    }
#endif
    
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
        
#if UNITY_WEBGL && !UNITY_EDITOR
        if (WebRTC_Init())
        {
            isInitialized = true;
            if (debugMode)
                Debug.Log("WebRTC Network Manager Initialized. Local ID: " + localPlayerId);
        }
        else
        {
            Debug.LogError("Failed to initialize WebRTC");
        }
#else
        // 非WebGL平台的模拟实现
        isInitialized = true;
        if (debugMode)
            Debug.Log("Network Manager Initialized (Simulated). Local ID: " + localPlayerId);
#endif
    }
    
    string GeneratePlayerId()
    {
        return "player_" + System.DateTime.Now.Ticks.ToString();
    }
    
    public void StartHost()
    {
        if (!isInitialized) return;
        
#if UNITY_WEBGL && !UNITY_EDITOR
        string roomId = "mc_" + System.DateTime.Now.Ticks.ToString();
        if (WebRTC_CreateRoom(roomId))
        {
            isHost = true;
            connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, true);
            
            if (debugMode)
                Debug.Log("Started as Host. Room ID: " + roomId + ", Player ID: " + localPlayerId);
        }
        else
        {
            Debug.LogError("Failed to create WebRTC room");
        }
#else
        isHost = true;
        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, true);
        
        if (debugMode)
            Debug.Log("Started as Host (Simulated). Player ID: " + localPlayerId);
#endif
    }
    
    public void StartSinglePlayerMode()
    {
        // 在单人模式下，我们仍然初始化网络管理器，但不会尝试连接到任何其他玩家
        isSinglePlayerMode = true;
        isHost = true; // 在单人模式下，玩家就是主机
        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, true);
        
        if (debugMode)
            Debug.Log("Started in Single Player Mode. Player ID: " + localPlayerId);
    }
    
    public void JoinGame(string roomId)
    {
        if (!isInitialized) return;
        
#if UNITY_WEBGL && !UNITY_EDITOR
        if (WebRTC_JoinRoom(roomId))
        {
            isHost = false;
            connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, false);
            
            if (debugMode)
                Debug.Log("Joined Game. Room ID: " + roomId + ", Player ID: " + localPlayerId);
        }
        else
        {
            Debug.LogError("Failed to join WebRTC room");
        }
#else
        isHost = false;
        connectedPlayers[localPlayerId] = new NetworkPlayer(localPlayerId, false);
        
        if (debugMode)
            Debug.Log("Joined Game (Simulated). Player ID: " + localPlayerId);
#endif
    }
    
    public void SendBlockUpdate(int x, int y, int z, BlockType blockType, bool isPlacing)
    {
        if (!isInitialized) return;
        
        var blockUpdate = new BlockUpdateMessage
        {
            playerId = localPlayerId,
            position = new Vector3Int(x, y, z),
            blockType = blockType,
            isPlacing = isPlacing
        };
        
        string jsonMessage = JsonUtility.ToJson(blockUpdate);
        
#if UNITY_WEBGL && !UNITY_EDITOR
        WebRTC_SendMessage(jsonMessage);
#else
        // 非WebGL平台的模拟实现
        BroadcastMessage(blockUpdate);
#endif
    }
    
    public void SendPlayerPosition(Vector3 position, Vector3 rotation)
    {
        if (!isInitialized) return;
        
        var playerUpdate = new PlayerPositionMessage
        {
            playerId = localPlayerId,
            position = position,
            rotation = rotation
        };
        
        string jsonMessage = JsonUtility.ToJson(playerUpdate);
        
        // 只有主机才广播位置更新，以减少网络流量
        if (isHost)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            WebRTC_SendMessage(jsonMessage);
#else
            // 非WebGL平台的模拟实现
            BroadcastMessage(playerUpdate);
#endif
        }
    }
    
    void BroadcastMessage(object message)
    {
        // 在实际WebRTC实现中，这里会通过数据通道发送消息
        // 模拟网络广播
        OnMessageReceived(message);
    }
    
    public void OnMessageReceived(object message)
    {
        if (message is BlockUpdateMessage blockMsg)
        {
            HandleBlockUpdate(blockMsg);
        }
        else if (message is PlayerPositionMessage playerMsg)
        {
            HandlePlayerPosition(playerMsg);
        }
    }
    
    public void OnMessageReceivedFromWebRTC(string jsonMessage)
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
            
            // 触发消息接收事件，供其他脚本使用
            OnNetworkMessageReceived?.Invoke(jsonMessage);
        }
        catch (System.Exception e)
        {
            Debug.LogError("Error parsing WebRTC message: " + e.Message + " | Message: " + jsonMessage);
        }
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
        
        // 在实际实现中，这里会更新远程玩家的位置
        // 目前只做日志记录
        if (debugMode)
            Debug.Log($"Player {msg.playerId} position: {msg.position}");
    }
    
    public bool IsConnected()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        return isInitialized && (isSinglePlayerMode || WebRTC_IsConnected());
#else
        return isInitialized && (isSinglePlayerMode || connectedPlayers.Count > 0);
#endif
    }
    
    public int GetPlayerCount()
    {
        if (isSinglePlayerMode)
        {
            return 1; // 在单人模式下，只计算本地玩家
        }
        
#if UNITY_WEBGL && !UNITY_EDITOR
        return isInitialized ? WebRTC_GetPeerCount() + 1 : connectedPlayers.Count; // +1 for local player
#else
        return connectedPlayers.Count;
#endif
    }
    
    public string GetLocalPlayerId()
    {
        return localPlayerId;
    }
    
    public bool IsLocalPlayerHost()
    {
        return isHost;
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