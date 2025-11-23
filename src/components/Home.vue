<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to My Blog</h1>
      <p>A place to share thoughts, ideas, and experiences</p>
    </section>

    <div class="content-container">
      <section class="blog-posts">
        <div class="post-card" v-for="post in posts" :key="post.id">
          <h2 class="post-title">
            <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
          </h2>
          <p class="post-meta">
            By {{ post.author }} on {{ formatDate(post.date) }}
          </p>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <router-link :to="`/post/${post.id}`" class="read-more">Read More</router-link>
        </div>
      </section>
      
      <Sidebar />
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import { getAllPosts } from '../data/posts.js';

export default {
  name: 'Home',
  components: {
    Sidebar
  },
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    this.loadPosts();
  },
  methods: {
    loadPosts() {
      this.posts = getAllPosts();
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.blog-posts {
  display: grid;
  gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.post-title {
  margin: 0 0 0.5rem 0;
}

.post-title a {
  color: #333;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
}

.post-title a:hover {
  color: #667eea;
}

.post-meta {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-excerpt {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-more {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .blog-posts {
    grid-template-columns: repeat(2, 1fr);
  }
}

.content-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (min-width: 1024px) {
  .content-container {
    grid-template-columns: 2fr 1fr;
  }
}
</style>