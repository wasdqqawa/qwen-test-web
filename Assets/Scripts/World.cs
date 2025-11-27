using UnityEngine;
using System.Collections.Generic;

public enum BlockType
{
    Air = -1,
    Bedrock = 0,
    Stone = 1,
    Dirt = 2,
    Grass = 3
}

public class World : MonoBehaviour
{
    public static World Instance;
    
    [Header("World Settings")]
    public int worldSize = 64;
    public int worldHeight = 32;
    public GameObject blockPrefab;
    public Material[] blockMaterials;
    
    private Dictionary<Vector3Int, GameObject> worldBlocks = new Dictionary<Vector3Int, GameObject>();
    private Dictionary<Vector3Int, BlockType> blockTypes = new Dictionary<Vector3Int, BlockType>();
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeWorld();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    void InitializeWorld()
    {
        // 初始化世界数据结构
        Debug.Log("World initialized with size: " + worldSize + "x" + worldHeight + "x" + worldSize);
    }
    
    public void SetBlock(int x, int y, int z, BlockType blockType)
    {
        Vector3Int position = new Vector3Int(x, y, z);
        
        // 如果位置已有方块，先移除
        if (worldBlocks.ContainsKey(position))
        {
            RemoveBlock(x, y, z);
        }
        
        // 只在非空气方块时创建
        if (blockType != BlockType.Air)
        {
            GameObject newBlock = CreateBlock(position, blockType);
            if (newBlock != null)
            {
                worldBlocks[position] = newBlock;
                blockTypes[position] = blockType;
            }
        }
        else
        {
            // 确保记录空气方块
            blockTypes[position] = BlockType.Air;
        }
    }
    
    public void RemoveBlock(int x, int y, int z)
    {
        Vector3Int position = new Vector3Int(x, y, z);
        
        if (worldBlocks.ContainsKey(position))
        {
            GameObject block = worldBlocks[position];
            if (block != null)
            {
                DestroyImmediate(block);
            }
            worldBlocks.Remove(position);
        }
        
        // 从类型记录中移除
        if (blockTypes.ContainsKey(position))
        {
            blockTypes.Remove(position);
        }
    }
    
    public BlockType GetBlockType(int x, int y, int z)
    {
        Vector3Int position = new Vector3Int(x, y, z);
        
        if (blockTypes.ContainsKey(position))
        {
            return blockTypes[position];
        }
        
        // 如果没有记录，返回空气
        return BlockType.Air;
    }
    
    public bool HasBlockAt(int x, int y, int z)
    {
        return GetBlockType(x, y, z) != BlockType.Air;
    }
    
    GameObject CreateBlock(Vector3Int position, BlockType blockType)
    {
        GameObject block;
        
        if (blockPrefab != null)
        {
            block = Instantiate(blockPrefab, position, Quaternion.identity);
        }
        else
        {
            // 创建一个默认立方体
            block = GameObject.CreatePrimitive(PrimitiveType.Cube);
            block.transform.position = position;
            
            // 移除默认的碰撞器并添加新的
            DestroyImmediate(block.GetComponent<BoxCollider>());
            block.AddComponent<BoxCollider>();
        }
        
        // 应用材质
        if (blockMaterials != null && blockMaterials.Length > (int)blockType && (int)blockType >= 0)
        {
            Renderer renderer = block.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material = blockMaterials[(int)blockType];
            }
        }
        
        block.name = "Block_" + position.x + "_" + position.y + "_" + position.z;
        
        return block;
    }
    
    // 批量设置方块（用于初始世界生成）
    public void SetBlocksInArea(int startX, int startY, int startZ, int endX, int endY, int endZ, BlockType blockType)
    {
        for (int x = startX; x <= endX; x++)
        {
            for (int y = startY; y <= endY; y++)
            {
                for (int z = startZ; z <= endZ; z++)
                {
                    SetBlock(x, y, z, blockType);
                }
            }
        }
    }
    
    void OnDestroy()
    {
        if (Instance == this)
        {
            Instance = null;
        }
    }
    
    // 为存档系统添加的公共方法
    public Dictionary<Vector3Int, GameObject> GetWorldBlocksInternal()
    {
        return worldBlocks;
    }
    
    public void ClearWorld()
    {
        // 清除所有方块
        List<Vector3Int> positions = new List<Vector3Int>(worldBlocks.Keys);
        
        foreach (Vector3Int pos in positions)
        {
            RemoveBlock(pos.x, pos.y, pos.z);
        }
    }
}