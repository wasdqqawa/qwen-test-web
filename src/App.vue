<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="nav-logo">My Blog</RouterLink>
        <ul class="nav-menu">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">About</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/categories" class="nav-link">Categories</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/manage" class="nav-link">Manage Posts</RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <p>&copy; 2025 My Blog. All rights reserved.</p>
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
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #343a40;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
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
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #adb5bd;
}

main {
  flex: 1;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  width: 100%;
}

.footer {
  background-color: #343a40;
  color: #ffffff;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}
</style>
