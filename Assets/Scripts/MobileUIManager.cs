using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class MobileUIManager : MonoBehaviour
{
    public static MobileUIManager Instance { get; private set; }
    
    [Header("Mobile UI Elements")]
    public GameObject mobileControls;
    public Button mobileMoveForward;
    public Button mobileMoveBackward;
    public Button mobileMoveLeft;
    public Button mobileMoveRight;
    public Button mobileJump;
    public Button mobileBreakBlock;
    public Button mobilePlaceBlock;
    public GameObject desktopControls; // 隐藏桌面控制
    
    [Header("Mobile Touch Controls")]
    public Joystick joystick;
    public Button jumpButton;
    
    [Header("Performance")]
    public bool isMobileDevice = false;
    public int mobileTargetFrameRate = 30;
    public int desktopTargetFrameRate = 60;
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeMobileDetection();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    void InitializeMobileDetection()
    {
        isMobileDevice = DetectMobileDevice();
        
        if (isMobileDevice)
        {
            // 移动设备优化
            Application.targetFrameRate = mobileTargetFrameRate;
            QualitySettings.vSyncCount = 0;
            
            // 启用移动UI
            if (mobileControls != null) mobileControls.SetActive(true);
            if (desktopControls != null) desktopControls.SetActive(false);
            
            // 设置移动控制事件
            SetupMobileControls();
        }
        else
        {
            // 桌面设备设置
            Application.targetFrameRate = desktopTargetFrameRate;
            
            // 隐藏移动UI
            if (mobileControls != null) mobileControls.SetActive(false);
            if (desktopControls != null) desktopControls.SetActive(true);
        }
    }
    
    bool DetectMobileDevice()
    {
        // 更精确的移动设备检测
#if UNITY_ANDROID || UNITY_IOS
        return true;
#elif UNITY_WEBGL
        // 在WebGL中检测移动设备
        return IsMobileBrowser();
#else
        return false;
#endif
    }
    
    bool IsMobileBrowser()
    {
        // 通过JavaScript检测是否为移动浏览器
        #if UNITY_WEBGL
        return WebGLMobileDetector.IsMobile();
        #else
        return false;
        #endif
    }
    
    void SetupMobileControls()
    {
        if (mobileMoveForward != null)
            mobileMoveForward.onClick.AddListener(() => MobileMoveInput(Vector3.forward));
        
        if (mobileMoveBackward != null)
            mobileMoveBackward.onClick.AddListener(() => MobileMoveInput(Vector3.back));
        
        if (mobileMoveLeft != null)
            mobileMoveLeft.onClick.AddListener(() => MobileMoveInput(Vector3.left));
        
        if (mobileMoveRight != null)
            mobileMoveRight.onClick.AddListener(() => MobileMoveInput(Vector3.right));
        
        if (mobileJump != null)
            mobileJump.onClick.AddListener(() => MobileJumpInput());
        
        if (mobileBreakBlock != null)
            mobileBreakBlock.onClick.AddListener(() => MobileBreakBlockInput());
        
        if (mobilePlaceBlock != null)
            mobilePlaceBlock.onClick.AddListener(() => MobilePlaceBlockInput());
    }
    
    void MobileMoveInput(Vector3 direction)
    {
        PlayerController player = FindObjectOfType<PlayerController>();
        if (player != null)
        {
            player.SetMobileMovementInput(direction);
        }
    }
    
    void MobileJumpInput()
    {
        PlayerController player = FindObjectOfType<PlayerController>();
        if (player != null)
        {
            player.SetMobileJumpInput(true);
        }
    }
    
    void MobileBreakBlockInput()
    {
        BlockInteraction blockInteraction = FindObjectOfType<BlockInteraction>();
        if (blockInteraction != null)
        {
            blockInteraction.SimulateLeftClick();
        }
    }
    
    void MobilePlaceBlockInput()
    {
        BlockInteraction blockInteraction = FindObjectOfType<BlockInteraction>();
        if (blockInteraction != null)
        {
            blockInteraction.SimulateRightClick();
        }
    }
    
    public bool IsMobile()
    {
        return isMobileDevice;
    }
    
    public void OptimizeForMobile()
    {
        if (isMobileDevice)
        {
            // 降低渲染质量
            QualitySettings.SetQualityLevel(1); // 低质量设置
            
            // 禁用一些性能消耗大的效果
            DisableExpensiveEffects();
        }
    }
    
    void DisableExpensiveEffects()
    {
        // 禁用阴影、后期处理等效果
        QualitySettings.shadows = ShadowQuality.Disable;
        QualitySettings.shadowProjection = ShadowProjection.CloseFit;
        QualitySettings.shadowCascades = 1;
    }
}

// 为PlayerController添加移动控制方法
public static class PlayerControllerExtensions
{
    public static void SetMobileMovement(this PlayerController player, Vector3 direction)
    {
        // 通过反射或直接访问私有字段来设置移动方向
        // 由于无法直接访问私有字段，我们创建一个新方法
    }
    
    public static void SetMobileJump(this PlayerController player, bool jump)
    {
        // 模拟跳跃输入
        // 由于无法直接访问私有字段，我们使用PlayerController的公共方法
    }
}

// WebGL移动浏览器检测器
#if UNITY_WEBGL
public class WebGLMobileDetector
{
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern bool IsMobileBrowser();
    
    public static bool IsMobile()
    {
        return IsMobileBrowser();
    }
}
#endif