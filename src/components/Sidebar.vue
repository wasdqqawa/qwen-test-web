<template>
  <div class="sidebar">
    <div class="widget search-widget">
      <h3>Search Posts</h3>
      <Search />
    </div>
    
    <div class="widget recent-posts">
      <h3>Recent Posts</h3>
      <div 
        v-for="post in recentPosts" 
        :key="post.id" 
        class="recent-post-item"
        @click="goToPost(post.id)"
      >
        <h4>{{ post.title }}</h4>
        <p class="post-date">{{ formatDate(post.date) }}</p>
      </div>
    </div>
    
    <div class="widget popular-posts">
      <h3>Popular Posts</h3>
      <div 
        v-for="post in popularPosts" 
        :key="post.id" 
        class="popular-post-item"
        @click="goToPost(post.id)"
      >
        <h4>{{ post.title }}</h4>
        <p class="post-stats">❤️ {{ post.likes }} likes | 💬 {{ post.comments }} comments</p>
      </div>
    </div>
    
    <div class="widget tags">
      <h3>Tags</h3>
      <div class="tag-list">
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="tag"
          @click="searchByTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './Search.vue';
import { getRecentPosts, getAllPosts, getAllTags } from '../data/posts.js';

export default {
  name: 'Sidebar',
  components: {
    Search
  },
  data() {
    return {
      allPosts: getAllPosts(),
      tags: getAllTags()
    }
  },
  computed: {
    recentPosts() {
      // 按日期排序，获取最新的3篇文章
      return getRecentPosts(3);
    },
    popularPosts() {
      // 按点赞数排序，获取最热门的3篇文章
      // 在实际应用中，这应该基于真实的点赞数据
      return [...this.allPosts]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 3);
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`);
    },
    searchByTag(tag) {
      // 在实际应用中，这里会触发搜索功能
      alert(`Searching for posts with tag: ${tag}`);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 100%;
  max-width: 300px;
  margin-left: 2rem;
}

.widget {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.widget h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.recent-post-item, .popular-post-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recent-post-item:last-child, .popular-post-item:last-child {
  border-bottom: none;
}

.recent-post-item:hover, .popular-post-item:hover {
  background-color: #f8f9fa;
}

.recent-post-item h4, .popular-post-item h4 {
  margin: 0 0 0.25rem 0;
  color: #495057;
  font-size: 1rem;
}

.post-date, .post-stats {
  color: #868e96;
  font-size: 0.8rem;
  margin: 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .sidebar {
    max-width: 100%;
    margin-left: 0;
    margin-top: 2rem;
  }
}
</style>