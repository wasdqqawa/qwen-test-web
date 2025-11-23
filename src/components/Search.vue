<template>
  <div class="search-container">
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search blog posts..." 
        @input="performSearch"
        class="search-input"
      />
      <button @click="performSearch" class="search-button">
        <span>🔍</span>
      </button>
    </div>
    
    <div v-if="searchResults.length > 0" class="search-results">
      <h3>Search Results ({{ searchResults.length }})</h3>
      <div 
        v-for="post in searchResults" 
        :key="post.id" 
        class="search-result-item"
        @click="goToPost(post.id)"
      >
        <h4>{{ post.title }}</h4>
        <p>{{ post.excerpt }}</p>
        <small>By {{ post.author }} on {{ formatDate(post.date) }}</small>
      </div>
    </div>
    
    <div v-else-if="searchQuery && searchResults.length === 0" class="no-results">
      <p>No results found for "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script>
import { getAllPosts, searchPosts } from '../data/posts.js';

export default {
  name: 'Search',
  data() {
    return {
      searchQuery: '',
      allPosts: [],
      searchResults: []
    }
  },
  mounted() {
    // 获取所有文章数据
    this.getAllPosts();
  },
  methods: {
    getAllPosts() {
      this.allPosts = getAllPosts();
    },
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        return;
      }
      
      this.searchResults = searchPosts(this.searchQuery);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`);
      this.searchQuery = '';
      this.searchResults = [];
    }
  }
}
</script>

<style scoped>
.search-container {
  position: relative;
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  border: 1px solid #ced4da;
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-button {
  padding: 0 1rem;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.search-button:hover {
  background: #5a6fd8;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.search-results h3 {
  padding: 1rem;
  margin: 0;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 4px 4px 0 0;
}

.search-result-item {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.search-result-item p {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.search-result-item small {
  color: #868e96;
  font-size: 0.8rem;
}

.no-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
}
</style>