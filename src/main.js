import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import i18n from './i18n'

// Import components
import Home from './components/Home.vue'
import About from './components/About.vue'
import Contact from './components/Contact.vue'
import BlogPost from './components/BlogPost.vue'
import Category from './components/Category.vue'
import Search from './components/Search.vue'
import PostManager from './components/PostManager.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/post/:id', name: 'BlogPost', component: BlogPost, props: true },
  { path: '/categories', component: Category },
  { path: '/search', component: Search },
  { path: '/manage', component: PostManager }
]

const router = createRouter({
  history: createWebHistory('./'), // 使用相对路径用于GitHub Pages部署
  routes
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')