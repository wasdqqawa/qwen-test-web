using UnityEngine;
using UnityEngine.UI;

public class NetworkUIManager : MonoBehaviour
{
    [Header("UI Elements")]
    public GameObject connectionPanel;
    public Button hostButton;
    public Button joinButton;
    public Button singlePlayerButton;  // 添加单人模式按钮
    public InputField roomIdInput;
    public Text statusText;
    public Text playerCountText;
    
    [Header("Game UI")]
    public GameObject gameUI;
    
    private bool isConnected = false;
    private bool isSinglePlayerMode = false;  // 添加单人模式标志

    void Start()
    {
        InitializeUI();
        SetupButtonCallbacks();
    }

    void InitializeUI()
    {
        if (connectionPanel != null) connectionPanel.SetActive(true);
        if (gameUI != null) gameUI.SetActive(false);
        if (statusText != null) statusText.text = "Not Connected";
        if (playerCountText != null) playerCountText.text = "Players: 0";
    }

    void SetupButtonCallbacks()
    {
        if (hostButton != null)
        {
            hostButton.onClick.AddListener(OnHostButtonClicked);
        }
        
        if (joinButton != null && roomIdInput != null)
        {
            joinButton.onClick.AddListener(OnJoinButtonClicked);
        }
        
        if (singlePlayerButton != null)
        {
            singlePlayerButton.onClick.AddListener(OnSinglePlayerButtonClicked);
        }
    }

    void OnHostButtonClicked()
    {
        if (WebRTCNetworkManager.Instance != null)
        {
            WebRTCNetworkManager.Instance.StartHost();
            isConnected = true;
            
            if (statusText != null) statusText.text = "Hosting Game";
            if (connectionPanel != null) connectionPanel.SetActive(false);
            if (gameUI != null) gameUI.SetActive(true);
            
            InvokeRepeating("UpdatePlayerCount", 0f, 1f); // 每秒更新玩家数量
        }
    }

    void OnSinglePlayerButtonClicked()
    {
        // 直接进入单人模式，不启动网络连接
        isSinglePlayerMode = true;
        isConnected = true;
        
        // 启动WebRTCNetworkManager的单人模式
        if (WebRTCNetworkManager.Instance != null)
        {
            WebRTCNetworkManager.Instance.StartSinglePlayerMode();
        }
        
        if (statusText != null) statusText.text = "Single Player Mode";
        if (connectionPanel != null) connectionPanel.SetActive(false);
        if (gameUI != null) gameUI.SetActive(true);
        
        // 在单人模式下，不需要更新玩家数量
    }

    void OnJoinButtonClicked()
    {
        if (WebRTCNetworkManager.Instance != null && !string.IsNullOrEmpty(roomIdInput.text))
        {
            WebRTCNetworkManager.Instance.JoinGame(roomIdInput.text);
            isConnected = true;
            
            if (statusText != null) statusText.text = "Joined Game: " + roomIdInput.text;
            if (connectionPanel != null) connectionPanel.SetActive(false);
            if (gameUI != null) gameUI.SetActive(true);
            
            InvokeRepeating("UpdatePlayerCount", 0f, 1f); // 每秒更新玩家数量
        }
    }

    void UpdatePlayerCount()
    {
        if (playerCountText != null && WebRTCNetworkManager.Instance != null)
        {
            int playerCount = WebRTCNetworkManager.Instance.GetPlayerCount();
            playerCountText.text = "Players: " + playerCount;
        }
    }

    void Update()
    {
        // 更新连接状态
        if (!isSinglePlayerMode && WebRTCNetworkManager.Instance != null)
        {
            if (!WebRTCNetworkManager.Instance.IsConnected() && isConnected)
            {
                // 连接断开
                isConnected = false;
                CancelInvoke("UpdatePlayerCount");
                
                if (statusText != null) statusText.text = "Connection Lost";
                if (connectionPanel != null) connectionPanel.SetActive(true);
                if (gameUI != null) gameUI.SetActive(false);
            }
        }
    }

    void OnDestroy()
    {
        CancelInvoke("UpdatePlayerCount");
    }
}