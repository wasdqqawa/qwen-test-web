using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class InGameUIManager : MonoBehaviour
{
    [Header("UI Elements")]
    public GameObject inGameUI;
    public Button pauseButton;
    public GameObject pauseMenu;
    public Button resumeButton;
    public Button settingsButton;
    public Button mainMenuButton;
    public Button quitButton;
    
    [Header("Game Info")]
    public Text playerPositionText;
    public Text fpsCounter;
    public Text playerCountText;
    
    [Header("Block Selection UI")]
    public GameObject blockSelectionPanel;
    public Button[] blockButtons;
    public Text[] blockTexts;
    
    private bool isPaused = false;
    private float originalTimeScale;

    void Start()
    {
        InitializeUI();
        SetupButtonCallbacks();
    }

    void InitializeUI()
    {
        if (inGameUI != null)
        {
            inGameUI.SetActive(true);
        }
        
        if (pauseMenu != null)
        {
            pauseMenu.SetActive(false);
        }
        
        if (blockSelectionPanel != null)
        {
            blockSelectionPanel.SetActive(true);
        }
        
        originalTimeScale = Time.timeScale;
    }

    void SetupButtonCallbacks()
    {
        if (pauseButton != null)
        {
            pauseButton.onClick.AddListener(TogglePause);
        }
        
        if (resumeButton != null)
        {
            resumeButton.onClick.AddListener(ResumeGame);
        }
        
        if (settingsButton != null)
        {
            settingsButton.onClick.AddListener(OpenSettings);
        }
        
        if (mainMenuButton != null)
        {
            mainMenuButton.onClick.AddListener(ReturnToMainMenu);
        }
        
        if (quitButton != null)
        {
            quitButton.onClick.AddListener(QuitGame);
        }
    }

    void Update()
    {
        // 更新游戏信息
        UpdateGameInfo();
        
        // 检查ESC键来暂停/恢复游戏
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            TogglePause();
        }
    }

    void UpdateGameInfo()
    {
        // 更新玩家位置
        if (playerPositionText != null && Camera.main != null)
        {
            Vector3 pos = Camera.main.transform.position;
            playerPositionText.text = $"Position: {pos.x:F1}, {pos.y:F1}, {pos.z:F1}";
        }
        
        // 更新FPS
        if (fpsCounter != null)
        {
            float fps = 1.0f / Time.deltaTime;
            fpsCounter.text = $"FPS: {fps:F0}";
        }
        
        // 更新玩家数量（如果有网络管理器）
        if (playerCountText != null && ImprovedWebSocketNetworkManager.Instance != null)
        {
            int playerCount = ImprovedWebSocketNetworkManager.Instance.GetPlayerCount();
            playerCountText.text = $"Players: {playerCount}";
        }
    }

    public void TogglePause()
    {
        isPaused = !isPaused;
        
        if (isPaused)
        {
            PauseGame();
        }
        else
        {
            ResumeGame();
        }
    }

    void PauseGame()
    {
        Time.timeScale = 0f;
        Cursor.visible = true;
        Cursor.lockState = CursorLockMode.None;
        
        if (inGameUI != null)
        {
            inGameUI.SetActive(false);
        }
        
        if (pauseMenu != null)
        {
            pauseMenu.SetActive(true);
        }
    }

    void ResumeGame()
    {
        Time.timeScale = originalTimeScale;
        Cursor.visible = false;
        Cursor.lockState = CursorLockMode.Locked;
        
        if (pauseMenu != null)
        {
            pauseMenu.SetActive(false);
        }
        
        if (inGameUI != null)
        {
            inGameUI.SetActive(true);
        }
    }

    void OpenSettings()
    {
        // 暂停游戏并打开设置菜单
        if (SettingsManager.Instance != null)
        {
            SettingsManager.Instance.ToggleSettingsPanel();
        }
    }

    void ReturnToMainMenu()
    {
        // 恢复时间尺度
        Time.timeScale = originalTimeScale;
        
        // 退出到主菜单
        SceneManager.LoadScene("SampleScene"); // 假设主菜单场景名为SampleScene
    }

    void QuitGame()
    {
        // 确认退出
        if (confirmQuit())
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            UnityEngine.WebGLTemplates.WebGLUI.CloseWindow();
#else
            Application.Quit();
#endif
        }
    }
    
    bool confirmQuit()
    {
        // 在WebGL中，我们不能显示标准对话框，所以直接返回true
        // 在其他平台可以使用Unity的对话框
#if UNITY_EDITOR || UNITY_STANDALONE
        return true; // 在编辑器中直接退出
#else
        return true; // 在WebGL中直接退出
#endif
    }

    // 供外部调用的方法
    public void SetBlockSelectionActive(bool active)
    {
        if (blockSelectionPanel != null)
        {
            blockSelectionPanel.SetActive(active);
        }
    }
    
    public void UpdateBlockSelection(int selectedBlockIndex)
    {
        // 更新方块选择UI的显示
        if (blockButtons != null && blockTexts != null)
        {
            for (int i = 0; i < blockButtons.Length; i++)
            {
                if (i == selectedBlockIndex)
                {
                    // 高亮选中的方块
                    if (blockButtons[i] != null)
                    {
                        ColorBlock colors = blockButtons[i].colors;
                        colors.normalColor = Color.yellow;
                        blockButtons[i].colors = colors;
                    }
                }
                else
                {
                    // 普通状态的方块
                    if (blockButtons[i] != null)
                    {
                        ColorBlock colors = blockButtons[i].colors;
                        colors.normalColor = Color.white;
                        blockButtons[i].colors = colors;
                    }
                }
            }
        }
    }
}