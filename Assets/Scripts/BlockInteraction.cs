using UnityEngine;
using System.Collections.Generic;

public class BlockInteraction : MonoBehaviour
{
    public Camera playerCamera;
    public float reachDistance = 5f;
    public GameObject blockPrefab;
    
    private Dictionary<Vector3, GameObject> worldBlocks = new Dictionary<Vector3, GameObject>();

    void Update()
    {
        // 检测鼠标点击
        if (Input.GetMouseButtonDown(0)) // 破坏方块
        {
            DestroyBlock();
        }
        else if (Input.GetMouseButtonDown(1)) // 放置方块
        {
            PlaceBlock();
        }
        
        // 移动设备触摸支持
        if (MobileUIManager.Instance != null && MobileUIManager.Instance.IsMobile())
        {
            // 移动设备上不使用鼠标输入
        }
    }
    
    // 供移动UI调用的模拟点击方法
    public void SimulateLeftClick()
    {
        DestroyBlock();
    }
    
    public void SimulateRightClick()
    {
        PlaceBlock();
    }

    void DestroyBlock()
    {
        Ray ray = playerCamera.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0)); // 从屏幕中心发射射线
        RaycastHit hit;

        if (Physics.Raycast(ray, out hit, reachDistance))
        {
            Vector3Int blockPos = Vector3Int.RoundToInt(hit.transform.position);
            
            // 检查是否是世界中的方块
            if (World.Instance != null)
            {
                // 销毁世界中的方块
                World.Instance.RemoveBlock(blockPos.x, blockPos.y, blockPos.z);
                
                // 如果在联机模式下，发送破坏方块的消息
                if (WebSocketNetworkManager.Instance != null && WebSocketNetworkManager.Instance.IsConnected())
                {
                    WebSocketNetworkManager.Instance.SendBlockUpdate(blockPos.x, blockPos.y, blockPos.z, BlockType.Air, false);
                }
            }
            else
            {
                // 销毁被点击的方块
                if (worldBlocks.ContainsKey(blockPos))
                {
                    Destroy(worldBlocks[blockPos]);
                    worldBlocks.Remove(blockPos);
                }
            }
        }
    }

    void PlaceBlock()
    {
        Ray ray = playerCamera.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0));
        RaycastHit hit;

        if (Physics.Raycast(ray, out hit, reachDistance))
        {
            // 计算放置位置（在被点击面的相邻位置）
            Vector3 placePosition = hit.point + hit.normal * 0.5f; // 在法线方向上偏移0.5个单位
            Vector3Int roundedPosition = Vector3Int.RoundToInt(placePosition);

            // 检查位置是否已有方块
            if (World.Instance != null)
            {
                // 放置世界中的方块
                World.Instance.SetBlock(roundedPosition.x, roundedPosition.y, roundedPosition.z, BlockType.Grass);
                
                // 如果在联机模式下，发送放置方块的消息
                if (WebSocketNetworkManager.Instance != null && WebSocketNetworkManager.Instance.IsConnected())
                {
                    WebSocketNetworkManager.Instance.SendBlockUpdate(roundedPosition.x, roundedPosition.y, roundedPosition.z, BlockType.Grass, true);
                }
            }
            else
            {
                if (!worldBlocks.ContainsKey(roundedPosition))
                {
                    GameObject newBlock = Instantiate(blockPrefab, roundedPosition, Quaternion.identity);
                    worldBlocks.Add(roundedPosition, newBlock);
                }
            }
        }
    }

    Vector3 RoundToBlockPosition(Vector3 position)
    {
        return new Vector3(
            Mathf.Round(position.x),
            Mathf.Round(position.y),
            Mathf.Round(position.z)
        );
    }
}