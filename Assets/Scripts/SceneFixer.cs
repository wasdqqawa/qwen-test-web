using UnityEngine;

public class SceneFixer : MonoBehaviour
{
    void Start()
    {
        // 检查是否存在主摄像机
        if (Camera.main == null)
        {
            // 创建一个主摄像机
            GameObject cameraObj = new GameObject("Main Camera");
            Camera cam = cameraObj.AddComponent<Camera>();
            cam.tag = "MainCamera";
            
            // 设置摄像机属性
            cam.fieldOfView = 60f;
            cam.nearClipPlane = 0.1f;
            cam.farClipPlane = 1000f;
            cam.backgroundColor = Color.black; // 确保背景色为黑色，避免黑屏问题
            cam.clearFlags = CameraClearFlags.Skybox; // 使用天空盒作为清除标志
            
            // 设置默认位置
            cameraObj.transform.position = new Vector3(0, 5, -10);
            cameraObj.transform.LookAt(Vector3.zero);
            
            Debug.Log("Created Main Camera to fix black screen issue");
        }
        
        // 检查是否存在灯光
        if (FindObjectOfType<Light>() == null)
        {
            // 创建一个方向光
            GameObject lightObj = new GameObject("Directional Light");
            Light light = lightObj.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1f;
            light.color = Color.white;
            
            // 设置默认旋转
            lightObj.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
            
            Debug.Log("Created Directional Light to fix black screen issue");
        }
        
        // 初始化各个系统
        if (SettingsManager.Instance == null)
        {
            GameObject settingsObj = new GameObject("SettingsManager");
            settingsObj.AddComponent<SettingsManager>();
        }
        
        if (MobileUIManager.Instance == null)
        {
            GameObject mobileObj = new GameObject("MobileUIManager");
            mobileObj.AddComponent<MobileUIManager>();
        }
        
        if (SaveSystem.Instance == null)
        {
            GameObject saveObj = new GameObject("SaveSystem");
            saveObj.AddComponent<SaveSystem>();
        }
        
        if (World.Instance == null)
        {
            // 创建世界对象
            GameObject worldObj = new GameObject("World");
            World world = worldObj.AddComponent<World>();
            
            // 设置默认材质
            if (world.blockMaterials == null || world.blockMaterials.Length == 0)
            {
                // 创建默认材质
                Material bedrockMat = new Material(Shader.Find("Standard"));
                bedrockMat.color = Color.gray;
                
                Material stoneMat = new Material(Shader.Find("Standard"));
                stoneMat.color = Color.gray * 0.8f;
                
                Material dirtMat = new Material(Shader.Find("Standard"));
                dirtMat.color = new Color(0.6f, 0.4f, 0.2f);
                
                Material grassMat = new Material(Shader.Find("Standard"));
                grassMat.color = Color.green;
                
                world.blockMaterials = new Material[] { bedrockMat, stoneMat, dirtMat, grassMat };
            }
            
            // 生成世界
            WorldGenerator worldGen = worldObj.AddComponent<WorldGenerator>();
            worldGen.worldSize = 32;
            worldGen.worldHeight = 16;
            worldGen.GenerateWorld();
        }
        
        // 如果没有玩家控制器，创建一个
        if (FindObjectOfType<PlayerController>() == null)
        {
            GameObject playerObj = new GameObject("Player");
            playerObj.transform.position = new Vector3(0, 10, 0); // 稍微高一点的位置
            
            // 添加角色控制器
            CharacterController controller = playerObj.AddComponent<CharacterController>();
            controller.height = 2f;
            controller.radius = 0.5f;
            controller.center = new Vector3(0, 1f, 0);
            
            // 添加玩家控制器脚本
            PlayerController playerController = playerObj.AddComponent<PlayerController>();
            
            // 添加碰撞检测变换
            GameObject groundCheck = new GameObject("GroundCheck");
            groundCheck.transform.SetParent(playerObj.transform);
            groundCheck.transform.localPosition = new Vector3(0, -1.1f, 0);
            playerController.groundCheck = groundCheck.transform;
            
            // 添加摄像机
            GameObject playerCamera = new GameObject("PlayerCamera");
            playerCamera.transform.SetParent(playerObj.transform);
            playerCamera.transform.localPosition = new Vector3(0, 1.5f, 0);
            Camera cam = playerCamera.AddComponent<Camera>();
            cam.fieldOfView = 60f;
            cam.tag = "Untagged"; // 避免与主摄像机冲突
            
            // 添加玩家刚体（如果需要物理）
            Rigidbody rb = playerObj.AddComponent<Rigidbody>();
            rb.isKinematic = true;
            rb.useGravity = false; // 我们使用自定义重力
            
            Debug.Log("Created Player to fix black screen issue");
        }
    }
}