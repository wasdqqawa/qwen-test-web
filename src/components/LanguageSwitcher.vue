<template>
  <div class="language-switcher">
    <select @change="changeLanguage" v-model="currentLanguage">
      <option value="en">{{ $t('message.english') }}</option>
      <option value="zh">{{ $t('message.chinese') }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = ref(locale.value)

const changeLanguage = (event) => {
  const newLocale = event.target.value
  locale.value = newLocale
  currentLanguage.value = newLocale
  // 保存用户选择的语言到本地存储
  localStorage.setItem('language', newLocale)
}

// 页面加载时从本地存储恢复语言设置
onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
    currentLanguage.value = savedLanguage
  }
})
</script>

<style scoped>
.language-switcher {
  margin-left: 1rem;
}

.language-switcher select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}
</style>