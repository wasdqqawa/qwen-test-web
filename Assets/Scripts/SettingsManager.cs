using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

[System.Serializable]
public class LocalizationData
{
    public string languageCode;
    public Dictionary<string, string> translations = new Dictionary<string, string>();
}

public class SettingsManager : MonoBehaviour
{
    public static SettingsManager Instance { get; private set; }
    
    [Header("UI Elements")]
    public GameObject settingsPanel;
    public Dropdown languageDropdown;
    public Toggle keybindingToggle;
    public GameObject keybindingPanel;
    public Text[] keybindingTexts;
    public Slider volumeSlider;
    public Toggle fullscreenToggle;
    
    [Header("Localization")]
    public List<LocalizationData> localizations = new List<LocalizationData>();
    private string currentLanguage = "en";
    
    [Header("Key Bindings")]
    public KeyCode moveForward = KeyCode.W;
    public KeyCode moveBackward = KeyCode.S;
    public KeyCode moveLeft = KeyCode.A;
    public KeyCode moveRight = KeyCode.D;
    public KeyCode jump = KeyCode.Space;
    public KeyCode breakBlock = KeyCode.Mouse0;
    public KeyCode placeBlock = KeyCode.Mouse1;
    
    [Header("Mobile Detection")]
    public bool isMobileDevice = false;
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeSettings();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    void InitializeSettings()
    {
        isMobileDevice = DetectMobileDevice();
        SetupLocalization();
        SetupKeyBindings();
    }
    
    bool DetectMobileDevice()
    {
        // 检测是否为移动设备
#if UNITY_ANDROID || UNITY_IOS || UNITY_WEBGL
        return true;
#else
        return false;
#endif
    }
    
    void SetupLocalization()
    {
        // 初始化多语言数据
        InitializeLocalizationData();
        
        if (languageDropdown != null)
        {
            languageDropdown.ClearOptions();
            List<string> languages = new List<string>();
            
            foreach (var loc in localizations)
            {
                languages.Add(GetLanguageName(loc.languageCode));
            }
            
            languageDropdown.AddOptions(languages);
            
            // 设置默认语言
            int defaultIndex = GetLanguageIndex(currentLanguage);
            if (defaultIndex >= 0)
            {
                languageDropdown.value = defaultIndex;
            }
            
            // 移除之前的监听器以避免重复添加
            languageDropdown.onValueChanged.RemoveAllListeners();
            languageDropdown.onValueChanged.AddListener(OnLanguageChanged);
        }
        
        // 设置音量滑块
        if (volumeSlider != null)
        {
            volumeSlider.onValueChanged.AddListener(OnVolumeChanged);
            volumeSlider.value = PlayerPrefs.GetFloat("Volume", 0.8f) * 100; // 0-100范围
        }
        
        // 设置全屏切换
        if (fullscreenToggle != null)
        {
            fullscreenToggle.onValueChanged.AddListener(OnFullscreenChanged);
            fullscreenToggle.isOn = Screen.fullScreen;
        }
    }
    
    void InitializeLocalizationData()
    {
        // 英语
        LocalizationData english = new LocalizationData();
        english.languageCode = "en";
        english.translations.Add("single_player", "Single Player");
        english.translations.Add("multiplayer", "Multiplayer");
        english.translations.Add("quit", "Quit");
        english.translations.Add("create_game", "Create Game");
        english.translations.Add("join_game", "Join Game");
        english.translations.Add("room_id", "Room ID");
        english.translations.Add("back", "Back");
        english.translations.Add("settings", "Settings");
        english.translations.Add("language", "Language");
        english.translations.Add("key_bindings", "Key Bindings");
        english.translations.Add("move_forward", "Move Forward");
        english.translations.Add("move_backward", "Move Backward");
        english.translations.Add("move_left", "Move Left");
        english.translations.Add("move_right", "Move Right");
        english.translations.Add("jump", "Jump");
        english.translations.Add("break_block", "Break Block");
        english.translations.Add("place_block", "Place Block");
        localizations.Add(english);
        
        // 中文
        LocalizationData chinese = new LocalizationData();
        chinese.languageCode = "zh";
        chinese.translations.Add("single_player", "单人游戏");
        chinese.translations.Add("multiplayer", "多人游戏");
        chinese.translations.Add("quit", "退出");
        chinese.translations.Add("create_game", "创建游戏");
        chinese.translations.Add("join_game", "加入游戏");
        chinese.translations.Add("room_id", "房间ID");
        chinese.translations.Add("back", "返回");
        chinese.translations.Add("settings", "设置");
        chinese.translations.Add("language", "语言");
        chinese.translations.Add("key_bindings", "按键绑定");
        chinese.translations.Add("move_forward", "向前移动");
        chinese.translations.Add("move_backward", "向后移动");
        chinese.translations.Add("move_left", "向左移动");
        chinese.translations.Add("move_right", "向右移动");
        chinese.translations.Add("jump", "跳跃");
        chinese.translations.Add("break_block", "破坏方块");
        chinese.translations.Add("place_block", "放置方块");
        localizations.Add(chinese);
    }
    
    string GetLanguageName(string code)
    {
        switch (code)
        {
            case "en": return "English";
            case "zh": return "中文";
            default: return "English";
        }
    }
    
    int GetLanguageIndex(string code)
    {
        for (int i = 0; i < localizations.Count; i++)
        {
            if (localizations[i].languageCode == code)
                return i;
        }
        return -1;
    }
    
    void SetupKeyBindings()
    {
        // 更新按键显示文本
        UpdateKeyBindingTexts();
    }
    
    void UpdateKeyBindingTexts()
    {
        if (keybindingTexts != null && keybindingTexts.Length >= 7)
        {
            keybindingTexts[0].text = moveForward.ToString();
            keybindingTexts[1].text = moveBackward.ToString();
            keybindingTexts[2].text = moveLeft.ToString();
            keybindingTexts[3].text = moveRight.ToString();
            keybindingTexts[4].text = jump.ToString();
            keybindingTexts[5].text = "Left Click";
            keybindingTexts[6].text = "Right Click";
        }
    }
    
    void OnLanguageChanged(int index)
    {
        if (index >= 0 && index < localizations.Count)
        {
            currentLanguage = localizations[index].languageCode;
            PlayerPrefs.SetString("Language", currentLanguage);
            PlayerPrefs.Save();
            ApplyLocalization();
        }
    }
    
    void OnVolumeChanged(float volume)
    {
        // 将0-100范围转换为0-1范围
        float normalizedVolume = volume / 100f;
        PlayerPrefs.SetFloat("Volume", normalizedVolume);
        PlayerPrefs.Save();
        
        // 应用音量设置（这里只是存储，实际应用需要在音频管理器中实现）
        AudioListener.volume = normalizedVolume;
    }
    
    void OnFullscreenChanged(bool isFullscreen)
    {
        Screen.fullScreen = isFullscreen;
        PlayerPrefs.SetInt("Fullscreen", isFullscreen ? 1 : 0);
        PlayerPrefs.Save();
    }
    
    void ApplyLocalization()
    {
        // 应用本地化到UI元素
        // 这里需要根据实际UI元素来更新文本
        UpdateUIElements();
    }
    
    void UpdateUIElements()
    {
        // 通知所有UI元素更新本地化
        MainMenuUI mainMenu = FindObjectOfType<MainMenuUI>();
        if (mainMenu != null)
        {
            mainMenu.UpdateLocalization();
        }
    }
    
    public string GetLocalizedText(string key)
    {
        foreach (var loc in localizations)
        {
            if (loc.languageCode == currentLanguage && loc.translations.ContainsKey(key))
            {
                return loc.translations[key];
            }
        }
        
        // 如果当前语言中没有找到，尝试英语
        foreach (var loc in localizations)
        {
            if (loc.languageCode == "en" && loc.translations.ContainsKey(key))
            {
                return loc.translations[key];
            }
        }
        
        // 如果还是没有找到，返回key本身
        return key;
    }
    
    // 供JavaScript调用的方法
    public void OnLanguageChangedFromJS(string languageCode)
    {
        int index = GetLanguageIndex(languageCode);
        if (index >= 0)
        {
            languageDropdown.value = index; // 这会触发OnLanguageChanged回调
        }
    }
    
    public void OnVolumeChangedFromJS(float volume)
    {
        if (volumeSlider != null)
        {
            volumeSlider.value = volume; // 这会触发OnVolumeChanged回调
        }
    }
    
    public bool IsMobileDevice()
    {
        return isMobileDevice;
    }
    
    public void ToggleSettingsPanel()
    {
        if (settingsPanel != null)
        {
            settingsPanel.SetActive(!settingsPanel.activeSelf);
        }
    }
    
    public void ToggleKeyBindingsPanel()
    {
        if (keybindingPanel != null)
        {
            keybindingPanel.SetActive(!keybindingPanel.activeSelf);
        }
    }
}