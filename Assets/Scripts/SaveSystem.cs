using UnityEngine;
using System.Collections.Generic;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;
using System;

public class SaveSystem : MonoBehaviour
{
    public static SaveSystem Instance { get; private set; }
    
    [System.Serializable]
    public class GameData
    {
        public Dictionary<string, int> blockTypes; // position as string key, block type as int value
        public Vector3 playerPosition;
        public Vector3 playerRotation;
        public string lastPlayedDate;
        public int worldSize;
        public int worldHeight;
        
        public GameData()
        {
            blockTypes = new Dictionary<string, int>();
            playerPosition = Vector3.zero;
            playerRotation = Vector3.zero;
            lastPlayedDate = DateTime.Now.ToString();
            worldSize = 64;
            worldHeight = 32;
        }
    }
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void SaveGame(string saveSlot = "default")
    {
        GameData data = CaptureCurrentGameData();
        
        string savePath = GetSavePath(saveSlot);
        BinaryFormatter formatter = new BinaryFormatter();
        
        try
        {
            using (FileStream fileStream = new FileStream(savePath, FileMode.Create))
            {
                formatter.Serialize(fileStream, data);
                Debug.Log("Game saved successfully to " + savePath);
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error saving game: " + e.Message);
        }
    }
    
    public GameData LoadGame(string saveSlot = "default")
    {
        string savePath = GetSavePath(saveSlot);
        
        if (!File.Exists(savePath))
        {
            Debug.Log("No save file found at " + savePath);
            return null;
        }
        
        BinaryFormatter formatter = new BinaryFormatter();
        
        try
        {
            using (FileStream fileStream = new FileStream(savePath, FileMode.Open))
            {
                GameData data = (GameData)formatter.Deserialize(fileStream);
                Debug.Log("Game loaded successfully from " + savePath);
                return data;
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error loading game: " + e.Message);
            return null;
        }
    }
    
    private GameData CaptureCurrentGameData()
    {
        GameData data = new GameData();
        
        // 捕获当前世界数据
        if (World.Instance != null)
        {
            // 遍历世界中的所有方块
            foreach (var kvp in World.Instance.GetWorldBlocks())
            {
                string key = kvp.Key.x + "," + kvp.Key.y + "," + kvp.Key.z;
                data.blockTypes[key] = (int)World.Instance.GetBlockType(kvp.Key.x, kvp.Key.y, kvp.Key.z);
            }
            
            data.worldSize = World.Instance.worldSize;
            data.worldHeight = World.Instance.worldHeight;
        }
        
        // 捕获玩家位置（如果存在）
        PlayerController player = FindObjectOfType<PlayerController>();
        if (player != null)
        {
            data.playerPosition = player.transform.position;
            data.playerRotation = player.transform.eulerAngles;
        }
        
        data.lastPlayedDate = DateTime.Now.ToString();
        
        return data;
    }
    
    public void ApplyGameData(GameData data)
    {
        if (data == null) return;
        
        if (World.Instance != null)
        {
            // 重新生成世界
            World.Instance.ClearWorld();
            
            // 重建方块
            foreach (var kvp in data.blockTypes)
            {
                string[] coords = kvp.Key.Split(',');
                if (coords.Length == 3)
                {
                    int x = int.Parse(coords[0]);
                    int y = int.Parse(coords[1]);
                    int z = int.Parse(coords[2]);
                    
                    BlockType blockType = (BlockType)kvp.Value;
                    World.Instance.SetBlock(x, y, z, blockType);
                }
            }
        }
        
        // 恢复玩家位置（如果存在）
        PlayerController player = FindObjectOfType<PlayerController>();
        if (player != null && data.playerPosition != Vector3.zero)
        {
            player.transform.position = data.playerPosition;
        }
    }
    
    private string GetSavePath(string saveSlot)
    {
        string saveFolder = Path.Combine(Application.persistentDataPath, "Saves");
        if (!Directory.Exists(saveFolder))
        {
            Directory.CreateDirectory(saveFolder);
        }
        
        return Path.Combine(saveFolder, "save_" + saveSlot + ".dat");
    }
    
    // 用于WebGL的JSON保存方法
    public void SaveGameJSON(string saveSlot = "default")
    {
        GameData data = CaptureCurrentGameData();
        string json = JsonUtility.ToJson(data, true);
        
        string savePath = GetSavePathJSON(saveSlot);
        File.WriteAllText(savePath, json);
        
        Debug.Log("Game saved as JSON to " + savePath);
    }
    
    public GameData LoadGameJSON(string saveSlot = "default")
    {
        string savePath = GetSavePathJSON(saveSlot);
        
        if (!File.Exists(savePath))
        {
            Debug.Log("No JSON save file found at " + savePath);
            return null;
        }
        
        string json = File.ReadAllText(savePath);
        GameData data = JsonUtility.FromJson<GameData>(json);
        
        Debug.Log("Game loaded from JSON " + savePath);
        return data;
    }
    
    private string GetSavePathJSON(string saveSlot)
    {
        string saveFolder = Path.Combine(Application.persistentDataPath, "Saves");
        if (!Directory.Exists(saveFolder))
        {
            Directory.CreateDirectory(saveFolder);
        }
        
        return Path.Combine(saveFolder, "save_" + saveSlot + ".json");
    }
}

// 扩展World类以提供访问内部数据的方法
public static class WorldExtensions
{
    public static Dictionary<UnityEngine.Vector3Int, UnityEngine.GameObject> GetWorldBlocks(this World world)
    {
        // 使用反射或通过公开方法访问私有字段
        // 这里我们直接添加一个公共方法到World类中
        return world.GetWorldBlocksInternal();
    }
    
    public static void ClearWorld(this World world)
    {
        // 清除所有方块
        List<UnityEngine.Vector3Int> positions = new List<UnityEngine.Vector3Int>();
        foreach (var kvp in world.GetWorldBlocksInternal())
        {
            positions.Add(kvp.Key);
        }
        
        foreach (var pos in positions)
        {
            world.RemoveBlock(pos.x, pos.y, pos.z);
        }
    }
}