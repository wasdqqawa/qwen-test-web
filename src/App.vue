<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="nav-logo">{{ $t('message.welcome') }}</RouterLink>
        <ul class="nav-menu">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">{{ $t('message.home') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">{{ $t('message.about') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link">{{ $t('message.contact') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/categories" class="nav-link">{{ $t('message.categories') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/manage" class="nav-link">{{ $t('message.manage_posts') }}</RouterLink>
          </li>
        </ul>
        <LanguageSwitcher />
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <p>&copy; 2025 {{ $t('message.welcome') }}. {{ $t('message.all_rights_reserved') }}.</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(90deg, #343a40 0%, #495057 100%);
  padding: 1rem 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.nav-logo {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nav-logo i {
  margin-right: 0.5rem;
}

.nav-menu {
  display: flex;
  list-style: none;
}

.nav-item {
  margin-left: 2rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: #4da0ff;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

main {
  flex: 1;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  padding: 2rem;
}

.footer {
  background: linear-gradient(90deg, #343a40 0%, #495057 100%);
  color: #ffffff;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-menu {
    margin: 1rem 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-item {
    margin: 0.5rem;
  }
  
  main {
    margin: 1rem auto;
    padding: 1rem;
  }
}
</style>
