using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class MainMenuUI : MonoBehaviour
{
    [Header("Main Menu UI Elements")]
    public GameObject mainMenuPanel;
    public Button singlePlayerButton;
    public Button multiplayerButton;
    public Button quitButton;
    
    [Header("Multiplayer Menu UI Elements")]
    public GameObject multiplayerMenuPanel;
    public Button hostButton;
    public Button joinButton;
    public Button backButton;
    public InputField roomIdInput;
    
    [Header("Game Scene")]
    public string gameSceneName = "SampleScene";
    
    [Header("Settings")]
    public GameObject settingsPanel;
    public Button settingsButton;
    public Button settingsBackButton;

    void Start()
    {
        InitializeUI();
        SetupButtonCallbacks();
    }

    void InitializeUI()
    {
        // 确保所有面板初始状态正确
        if (mainMenuPanel != null) mainMenuPanel.SetActive(true);
        if (multiplayerMenuPanel != null) multiplayerMenuPanel.SetActive(false);
        if (settingsPanel != null) settingsPanel.SetActive(false);
    }

    void SetupButtonCallbacks()
    {
        // 主菜单按钮事件
        if (singlePlayerButton != null)
        {
            singlePlayerButton.onClick.AddListener(OnSinglePlayerButtonClicked);
        }
        
        if (multiplayerButton != null)
        {
            multiplayerButton.onClick.AddListener(OnMultiplayerButtonClicked);
        }
        
        if (quitButton != null)
        {
            quitButton.onClick.AddListener(OnQuitButtonClicked);
        }
        
        // 设置按钮事件
        if (settingsButton != null)
        {
            settingsButton.onClick.AddListener(OnSettingsButtonClicked);
        }
        
        if (settingsBackButton != null)
        {
            settingsBackButton.onClick.AddListener(OnSettingsBackButtonClicked);
        }
        
        // 多人游戏菜单按钮事件
        if (hostButton != null)
        {
            hostButton.onClick.AddListener(OnHostButtonClicked);
        }
        
        if (joinButton != null && roomIdInput != null)
        {
            joinButton.onClick.AddListener(OnJoinButtonClicked);
        }
        
        if (backButton != null)
        {
            backButton.onClick.AddListener(OnBackButtonClicked);
        }
    }

    void OnSinglePlayerButtonClicked()
    {
        // 设置网络管理器为单人模式
        ImprovedWebSocketNetworkManager.Instance?.StartSinglePlayerMode();
        
        // 加载游戏场景
        SceneManager.LoadScene(gameSceneName);
    }

    void OnMultiplayerButtonClicked()
    {
        // 切换到多人游戏菜单
        if (mainMenuPanel != null) mainMenuPanel.SetActive(false);
        if (multiplayerMenuPanel != null) multiplayerMenuPanel.SetActive(true);
    }

    void OnHostButtonClicked()
    {
        // 设置网络管理器为主机模式
        ImprovedWebSocketNetworkManager.Instance?.StartHost();
        
        // 加载游戏场景
        SceneManager.LoadScene(gameSceneName);
    }

    void OnJoinButtonClicked()
    {
        if (!string.IsNullOrEmpty(roomIdInput.text))
        {
            // 设置网络管理器为加入游戏模式
            ImprovedWebSocketNetworkManager.Instance?.JoinGame(roomIdInput.text);
            
            // 加载游戏场景
            SceneManager.LoadScene(gameSceneName);
        }
    }

    void OnSettingsButtonClicked()
    {
        // 显示设置面板
        if (mainMenuPanel != null) mainMenuPanel.SetActive(false);
        if (settingsPanel != null) settingsPanel.SetActive(true);
    }

    void OnSettingsBackButtonClicked()
    {
        // 返回主菜单
        if (settingsPanel != null) settingsPanel.SetActive(false);
        if (mainMenuPanel != null) mainMenuPanel.SetActive(true);
    }

    void OnBackButtonClicked()
    {
        // 返回主菜单
        if (multiplayerMenuPanel != null) multiplayerMenuPanel.SetActive(false);
        if (mainMenuPanel != null) mainMenuPanel.SetActive(true);
    }

    void OnQuitButtonClicked()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        // 在WebGL中，关闭标签页
        UnityEngine.WebGLTemplates.WebGLUI.CloseWindow();
#else
        // 在编辑器或其他平台中退出应用
        Application.Quit();
#endif
    }

    public void UpdateLocalization()
    {
        // 更新UI本地化文本
        if (SettingsManager.Instance != null)
        {
            if (singlePlayerButton != null)
                singlePlayerButton.GetComponent<UnityEngine.UI.Text>().text = SettingsManager.Instance.GetLocalizedText("single_player");
            if (multiplayerButton != null)
                multiplayerButton.GetComponent<UnityEngine.UI.Text>().text = SettingsManager.Instance.GetLocalizedText("multiplayer");
            if (quitButton != null)
                quitButton.GetComponent<UnityEngine.UI.Text>().text = SettingsManager.Instance.GetLocalizedText("quit");
            if (settingsButton != null)
                settingsButton.GetComponent<UnityEngine.UI.Text>().text = SettingsManager.Instance.GetLocalizedText("settings");
        }
    }
}