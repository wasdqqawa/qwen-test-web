<template>
  <div class="category">
    <section class="hero">
      <h1>Categories</h1>
      <p>Browse posts by category</p>
    </section>

    <div class="content">
      <div class="category-list">
        <div 
          v-for="category in categories" 
          :key="category" 
          class="category-card"
          @click="goToCategory(category)"
        >
          <h3>{{ category }}</h3>
          <p>{{ getCategoryPostCount(category) }} posts</p>
        </div>
      </div>

      <div v-if="selectedCategory" class="category-posts">
        <h2>{{ selectedCategory }} Posts</h2>
        <div class="posts-grid">
          <div 
            v-for="post in categoryPosts" 
            :key="post.id" 
            class="post-card"
          >
            <h3>{{ post.title }}</h3>
            <p class="post-meta">
              By {{ post.author }} on {{ formatDate(post.date) }}
            </p>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <router-link :to="`/post/${post.id}`" class="read-more">Read More</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllCategories, getPostsByCategory, getAllPosts } from '../data/posts.js';

export default {
  name: 'Category',
  data() {
    return {
      selectedCategory: null,
      allPosts: []
    }
  },
  computed: {
    categories() {
      return getAllCategories();
    },
    categoryPosts() {
      if (!this.selectedCategory) return [];
      return getPostsByCategory(this.selectedCategory);
    }
  },
  mounted() {
    this.allPosts = getAllPosts();
  },
  methods: {
    goToCategory(category) {
      this.selectedCategory = category;
      // Scroll to the category posts section
      this.$nextTick(() => {
        const element = document.querySelector('.category-posts');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
    getCategoryPostCount(category) {
      return this.allPosts.filter(post => post.category === category).length;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
}
</script>

<style scoped>
.category {
  padding: 2rem 1rem;
}

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

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.category-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.category-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.category-card p {
  color: #6c757d;
  margin: 0;
}

.category-posts h2 {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.post-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
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

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .category-list {
    grid-template-columns: 1fr;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>