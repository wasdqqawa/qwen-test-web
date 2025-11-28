// 计算器功能
let calcInput = '';

function appendToCalc(value) {
    calcInput += value;
    document.getElementById('calc-display').value = calcInput;
}

function clearCalc() {
    calcInput = '';
    document.getElementById('calc-display').value = '';
}

function deleteCalc() {
    calcInput = calcInput.slice(0, -1);
    document.getElementById('calc-display').value = calcInput;
}

function calculate() {
    try {
        // 使用 Function 构造函数安全地计算表达式
        const result = Function('"use strict"; return (' + calcInput + ')')();
        document.getElementById('calc-display').value = result;
        calcInput = result.toString();
    } catch (error) {
        document.getElementById('calc-display').value = '错误';
        calcInput = '';
    }
}

// 单位转换器功能
document.addEventListener('DOMContentLoaded', function() {
    updateUnitOptions();
    document.getElementById('conversion-type').addEventListener('change', updateUnitOptions);
    
    // 初始化颜色选择器
    setupColorPicker();
});

function updateUnitOptions() {
    const conversionType = document.getElementById('conversion-type').value;
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    
    // 清空选项
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    let units = [];
    
    switch(conversionType) {
        case 'length':
            units = [
                { value: 'mm', text: '毫米 (mm)' },
                { value: 'cm', text: '厘米 (cm)' },
                { value: 'm', text: '米 (m)' },
                { value: 'km', text: '千米 (km)' },
                { value: 'in', text: '英寸 (in)' },
                { value: 'ft', text: '英尺 (ft)' },
                { value: 'yd', text: '码 (yd)' },
                { value: 'mi', text: '英里 (mi)' }
            ];
            break;
        case 'weight':
            units = [
                { value: 'mg', text: '毫克 (mg)' },
                { value: 'g', text: '克 (g)' },
                { value: 'kg', text: '千克 (kg)' },
                { value: 't', text: '吨 (t)' },
                { value: 'oz', text: '盎司 (oz)' },
                { value: 'lb', text: '磅 (lb)' }
            ];
            break;
        case 'temperature':
            units = [
                { value: 'c', text: '摄氏度 (°C)' },
                { value: 'f', text: '华氏度 (°F)' },
                { value: 'k', text: '开尔文 (K)' }
            ];
            break;
        case 'area':
            units = [
                { value: 'mm2', text: '平方毫米 (mm²)' },
                { value: 'cm2', text: '平方厘米 (cm²)' },
                { value: 'm2', text: '平方米 (m²)' },
                { value: 'km2', text: '平方千米 (km²)' },
                { value: 'in2', text: '平方英寸 (in²)' },
                { value: 'ft2', text: '平方英尺 (ft²)' },
                { value: 'ac', text: '英亩 (ac)' },
                { value: 'ha', text: '公顷 (ha)' }
            ];
            break;
    }
    
    // 添加选项
    units.forEach(unit => {
        const fromOption = document.createElement('option');
        fromOption.value = unit.value;
        fromOption.textContent = unit.text;
        fromUnitSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unit.value;
        toOption.textContent = unit.text;
        toUnitSelect.appendChild(toOption);
    });
    
    // 默认选中第一个
    fromUnitSelect.selectedIndex = 0;
    toUnitSelect.selectedIndex = 1;
}

function convertUnit() {
    const fromValue = parseFloat(document.getElementById('from-value').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;
    const conversionType = document.getElementById('conversion-type').value;
    
    if (isNaN(fromValue)) {
        alert('请输入有效数值');
        return;
    }
    
    let result;
    
    // 转换为标准单位，然后转为目标单位
    if (conversionType === 'temperature') {
        // 温度转换需要特殊处理
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        // 其他单位转换
        const baseValue = toBaseUnit(fromValue, fromUnit, conversionType);
        result = fromBaseUnit(baseValue, toUnit, conversionType);
    }
    
    document.getElementById('result').value = result.toFixed(6);
}

function toBaseUnit(value, unit, type) {
    switch(type) {
        case 'length':
            switch(unit) {
                case 'mm': return value / 1000;
                case 'cm': return value / 100;
                case 'm': return value;
                case 'km': return value * 1000; // 1 km = 1000 m
                case 'in': return value * 0.0254;
                case 'ft': return value * 0.3048;
                case 'yd': return value * 0.9144;
                case 'mi': return value * 1609.344;
                default: return value;
            }
        case 'weight':
            switch(unit) {
                case 'mg': return value / 1000000;
                case 'g': return value / 1000;
                case 'kg': return value;
                case 't': return value * 1000;
                case 'oz': return value * 0.0283495;
                case 'lb': return value * 0.453592;
                default: return value;
            }
        case 'area':
            switch(unit) {
                case 'mm2': return value / 1000000;
                case 'cm2': return value / 10000;
                case 'm2': return value;
                case 'km2': return value * 1000000;
                case 'in2': return value * 0.00064516;
                case 'ft2': return value * 0.092903;
                case 'ac': return value * 4046.86;
                case 'ha': return value * 10000;
                default: return value;
            }
        default: return value;
    }
}

function fromBaseUnit(value, unit, type) {
    switch(type) {
        case 'length':
            switch(unit) {
                case 'mm': return value * 1000;
                case 'cm': return value * 100;
                case 'm': return value;
                case 'km': return value / 1000;
                case 'in': return value / 0.0254;
                case 'ft': return value / 0.3048;
                case 'yd': return value / 0.9144;
                case 'mi': return value / 1609.344;
                default: return value;
            }
        case 'weight':
            switch(unit) {
                case 'mg': return value * 1000000;
                case 'g': return value * 1000;
                case 'kg': return value;
                case 't': return value / 1000;
                case 'oz': return value / 0.0283495;
                case 'lb': return value / 0.453592;
                default: return value;
            }
        case 'area':
            switch(unit) {
                case 'mm2': return value * 1000000;
                case 'cm2': return value * 10000;
                case 'm2': return value;
                case 'km2': return value / 1000000;
                case 'in2': return value / 0.00064516;
                case 'ft2': return value / 0.092903;
                case 'ac': return value / 4046.86;
                case 'ha': return value / 10000;
                default: return value;
            }
        default: return value;
    }
}

function convertTemperature(value, fromUnit, toUnit) {
    // 先转换为摄氏度
    let celsius;
    switch(fromUnit) {
        case 'c': celsius = value; break;
        case 'f': celsius = (value - 32) * 5/9; break;
        case 'k': celsius = value - 273.15; break;
        default: celsius = value;
    }
    
    // 从摄氏度转换为目标单位
    switch(toUnit) {
        case 'c': return celsius;
        case 'f': return celsius * 9/5 + 32;
        case 'k': return celsius + 273.15;
        default: return celsius;
    }
}

// 文本工具功能
function uppercaseText() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.toUpperCase();
    updateWordCount();
}

function lowercaseText() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.toLowerCase();
    updateWordCount();
}

function reverseText() {
    const input = document.getElementById('text-input').value;
    document.getElementById('text-output').value = input.split('').reverse().join('');
    updateWordCount();
}

function countWords() {
    const input = document.getElementById('text-input').value;
    const wordCount = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const charCount = input.length;
    const charCountNoSpaces = input.replace(/\s/g, '').length;
    
    document.getElementById('text-output').value = 
        `字数统计:\n单词数: ${wordCount}\n字符数(含空格): ${charCount}\n字符数(不含空格): ${charCountNoSpaces}`;
    updateWordCount();
}

function clearText() {
    document.getElementById('text-input').value = '';
    document.getElementById('text-output').value = '';
    updateWordCount();
}

function updateWordCount() {
    const input = document.getElementById('text-input').value;
    const wordCount = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const charCount = input.length;
    document.getElementById('word-count').textContent = `字数: ${wordCount} | 字符数: ${charCount}`;
}

// 颜色选择器功能
function setupColorPicker() {
    const colorInput = document.getElementById('color-input');
    const colorValue = document.getElementById('color-value');
    const colorPreview = document.getElementById('color-preview');
    
    colorInput.addEventListener('input', function() {
        const color = this.value;
        colorPreview.style.backgroundColor = color;
        colorValue.value = color;
    });
    
    // 初始化显示
    colorInput.dispatchEvent(new Event('input'));
}

// 二维码生成器功能
function generateQRCode() {
    const text = document.getElementById('qrcode-input').value.trim();
    const qrDisplay = document.getElementById('qrcode-display');
    
    if (!text) {
        alert('请输入要生成二维码的内容');
        return;
    }
    
    // 清空之前的结果
    qrDisplay.innerHTML = '';
    
    // 创建一个img元素来显示二维码
    // 使用在线API生成二维码
    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    img.alt = '二维码';
    img.style.width = '200px';
    img.style.height = '200px';
    
    qrDisplay.appendChild(img);
}

// 密码生成器功能
function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value);
    const includeUppercase = document.getElementById('uppercase-chk').checked;
    const includeLowercase = document.getElementById('lowercase-chk').checked;
    const includeNumbers = document.getElementById('numbers-chk').checked;
    const includeSymbols = document.getElementById('symbols-chk').checked;
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
        alert('请至少选择一种字符类型');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    document.getElementById('generated-password').value = password;
}

function copyPassword() {
    const passwordField = document.getElementById('generated-password');
    if (!passwordField.value) {
        alert('请先生成密码');
        return;
    }
    
    // 使用现代Clipboard API，如果不可用则回退到旧方法
    if (navigator.clipboard) {
        navigator.clipboard.writeText(passwordField.value).then(() => {
            // 显示复制成功提示
            const copyButton = document.querySelector('#password button[onclick="copyPassword()"]');
            if (copyButton) {
                const originalText = copyButton.textContent;
                copyButton.textContent = '已复制';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('复制失败:', err);
            // 回退到旧方法
            fallbackCopyTextToClipboard(passwordField);
        });
    } else {
        // 回退到旧方法
        fallbackCopyTextToClipboard(passwordField);
    }
}

// 旧的复制方法作为回退
function fallbackCopyTextToClipboard(passwordField) {
    passwordField.select();
    document.execCommand('copy');
    
    // 显示复制成功提示
    const copyButton = document.querySelector('#password button[onclick="copyPassword()"]');
    if (copyButton) {
        const originalText = copyButton.textContent;
        copyButton.textContent = '已复制';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    }
}

// 添加回车键支持到计算器
document.addEventListener('DOMContentLoaded', function() {
    const calcDisplay = document.getElementById('calc-display');
    if (calcDisplay) {
        calcDisplay.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculate();
            }
        });
    }
});