using UnityEngine;
using UnityEngine.UI;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 10f;
    public float jumpForce = 10f;
    public Transform groundCheck;
    public LayerMask groundMask;
    public float positionSyncRate = 0.1f; // 位置同步频率
    
    // 移动设备控制变量
    private Vector3 mobileMovementInput;
    private bool mobileJumpInput;

    private CharacterController characterController;
    private Vector3 moveDirection;
    private bool isGrounded;
    private float gravity = -9.81f;
    private float verticalVelocity;
    private float lastPositionSyncTime;
    private NetworkPlayerController networkPlayerController;
    
    // 游戏内UI元素
    public GameObject inGameUI;
    public Text playerPositionText;
    public Text fpsCounter;

    void Start()
    {
        characterController = GetComponent<CharacterController>();
        moveDirection = Vector3.zero;
        
        // 获取NetworkPlayerController组件
        networkPlayerController = GetComponent<NetworkPlayerController>();
        if (networkPlayerController == null)
        {
            networkPlayerController = gameObject.AddComponent<NetworkPlayerController>();
        }
        
        // 设置为本地玩家
        networkPlayerController.SetAsLocalPlayer();
        networkPlayerController.SetPlayerId(ImprovedWebSocketNetworkManager.Instance?.GetLocalPlayerId() ?? "local");
        
        // 初始化游戏内UI
        InitializeInGameUI();
    }

    void InitializeInGameUI()
    {
        if (inGameUI != null)
        {
            inGameUI.SetActive(true);
        }
    }

    void Update()
    {
        // 检查是否在地面上
        isGrounded = Physics.CheckSphere(groundCheck.position, 0.1f, groundMask);
        
        if(isGrounded && verticalVelocity < 0)
        {
            verticalVelocity = -2f;
        }

        // 水平移动 - 支持桌面和移动设备
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        // 如果是移动设备，使用移动输入
        if (MobileUIManager.Instance != null && MobileUIManager.Instance.IsMobile())
        {
            horizontal = mobileMovementInput.x;
            vertical = mobileMovementInput.z;
        }

        Vector3 forward = transform.TransformDirection(Vector3.forward);
        Vector3 right = transform.TransformDirection(Vector3.right);

        moveDirection = (forward * vertical + right * horizontal).normalized * moveSpeed;

        // 跳跃 - 支持桌面和移动设备
        bool shouldJump = Input.GetButtonDown("Jump") && isGrounded;
        
        // 如果是移动设备，使用移动跳跃输入
        if (MobileUIManager.Instance != null && MobileUIManager.Instance.IsMobile())
        {
            shouldJump = mobileJumpInput && isGrounded;
            mobileJumpInput = false; // 重置跳跃输入
        }
        
        if (shouldJump)
        {
            verticalVelocity = Mathf.Sqrt(jumpForce * -2f * gravity);
        }

        // 应用重力
        verticalVelocity += gravity * Time.deltaTime;
        moveDirection.y = verticalVelocity;

        // 移动角色
        characterController.Move(moveDirection * Time.deltaTime);
        
        // 同步位置到网络
        if (ImprovedWebSocketNetworkManager.Instance != null && ImprovedWebSocketNetworkManager.Instance.IsConnected())
        {
            if (Time.time - lastPositionSyncTime >= positionSyncRate)
            {
                ImprovedWebSocketNetworkManager.Instance.SendPlayerPosition(transform.position, transform.eulerAngles);
                lastPositionSyncTime = Time.time;
            }
        }
        
        // 更新游戏内UI
        UpdateInGameUI();
    }
    
    void UpdateInGameUI()
    {
        // 更新玩家位置显示
        if (playerPositionText != null)
        {
            playerPositionText.text = $"Position: {transform.position.x:F1}, {transform.position.y:F1}, {transform.position.z:F1}";
        }
        
        // 更新FPS计数器
        if (fpsCounter != null)
        {
            float fps = 1.0f / Time.deltaTime;
            fpsCounter.text = $"FPS: {fps:F0}";
        }
    }
    
    // 公共方法供移动UI管理器调用
    public void SetMobileMovementInput(Vector3 direction)
    {
        // 将方向向量转换为适合的输入值
        mobileMovementInput = new Vector3(direction.x, 0, direction.z).normalized;
    }
    
    public void SetMobileJumpInput(bool jump)
    {
        mobileJumpInput = jump;
    }
}