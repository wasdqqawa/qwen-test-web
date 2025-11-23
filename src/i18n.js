import { createI18n } from 'vue-i18n'
import messages from './locales'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'en', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages, // 语言资源
})

export default i18n