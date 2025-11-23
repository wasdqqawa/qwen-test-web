<template>
  <div class="post-manager">
    <section class="hero">
      <h1>管理博客文章</h1>
      <p>创建、编辑和管理您的博客内容</p>
    </section>

    <div class="content-container">
      <div class="post-form">
        <h2>{{ editingPost ? '编辑文章' : '创建新文章' }}</h2>
        
        <form @submit.prevent="savePost">
          <div class="form-group">
            <label for="title">标题</label>
            <input 
              type="text" 
              id="title" 
              v-model="currentPost.title" 
              required 
              class="form-input"
              placeholder="输入文章标题"
            >
          </div>
          
          <div class="form-group">
            <label for="excerpt">摘要</label>
            <textarea 
              id="excerpt" 
              v-model="currentPost.excerpt" 
              required 
              class="form-textarea"
              placeholder="文章的简要描述"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="author">作者</label>
            <input 
              type="text" 
              id="author" 
              v-model="currentPost.author" 
              required 
              class="form-input"
              placeholder="作者姓名"
            >
          </div>
          
          <div class="form-group">
            <label for="date">日期</label>
            <input 
              type="date" 
              id="date" 
              v-model="currentPost.date" 
              required 
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="category">分类</label>
            <select 
              id="category" 
              v-model="currentPost.category" 
              required 
              class="form-input"
            >
              <option value="">选择分类</option>
              <option value="技术">技术</option>
              <option value="Web开发">Web开发</option>
              <option value="前端">前端</option>
              <option value="后端">后端</option>
              <option value="设计">设计</option>
              <option value="教程">教程</option>
              <option value="新闻">新闻</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="tags">标签 (逗号分隔)</label>
            <input 
              type="text" 
              id="tags" 
              v-model="tagsInput" 
              class="form-input"
              placeholder="vuejs, javascript, 教程"
            >
            <div class="tag-suggestions">
              <span 
                v-for="tag in suggestedTags" 
                :key="tag"
                class="tag-suggestion"
                @click="addTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="content">内容</label>
            <textarea 
              id="content" 
              v-model="currentPost.content" 
              required 
              class="form-textarea"
              placeholder="在这里撰写您的文章内容..."
              rows="15"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ editingPost ? '更新文章' : '发布文章' }}
            </button>
            <button 
              v-if="editingPost" 
              type="button" 
              @click="cancelEdit"
              class="btn btn-secondary"
            >
              取消
            </button>
          </div>
        </form>
      </div>
      
      <div class="post-list">
        <h2>已发布文章</h2>
        <div class="search-filter">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索文章..."
            class="form-input search-input"
          >
          <select v-model="filterCategory" class="form-input">
            <option value="">所有分类</option>
            <option value="技术">技术</option>
            <option value="Web开发">Web开发</option>
            <option value="前端">前端</option>
            <option value="后端">后端</option>
            <option value="设计">设计</option>
            <option value="教程">教程</option>
            <option value="新闻">新闻</option>
          </select>
        </div>
        
        <div class="posts">
          <div 
            v-for="post in filteredPosts" 
            :key="post.id" 
            class="post-item"
          >
            <div class="post-header">
              <h3>{{ post.title }}</h3>
              <div class="post-meta">
                <span class="date">{{ formatDate(post.date) }}</span>
                <span class="author">作者 {{ post.author }}</span>
              </div>
            </div>
            
            <div class="post-tags">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            
            <p class="post-excerpt">{{ post.excerpt }}</p>
            
            <div class="post-actions">
              <button @click="editPost(post)" class="btn btn-outline">编辑</button>
              <button @click="deletePost(post.id)" class="btn btn-danger">删除</button>
            </div>
          </div>
          
          <div v-if="filteredPosts.length === 0" class="no-posts">
            <p>未找到文章。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { posts, getAllPosts, getPostById } from '../data/posts.js';

export default {
  name: 'PostManager',
  data() {
    return {
      currentPost: {
        id: null,
        title: '',
        excerpt: '',
        date: this.getCurrentDate(),
        author: '',
        tags: [],
        category: '',
        content: ''
      },
      editingPost: false,
      searchQuery: '',
      filterCategory: '',
      suggestedTags: ['Vue.js', 'JavaScript', 'Web Development', 'CSS', 'HTML', 'Frontend', 'Backend', 'Tutorial', 'Tips']
    }
  },
  computed: {
    tagsInput: {
      get() {
        return this.currentPost.tags.join(', ');
      },
      set(value) {
        this.currentPost.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    },
    allPosts() {
      return getAllPosts();
    },
    filteredPosts() {
      let filtered = this.allPosts;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply category filter
      if (this.filterCategory) {
        filtered = filtered.filter(post => post.category === this.filterCategory);
      }
      
      // Sort by date (newest first)
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    },
    savePost() {
      if (this.editingPost) {
        // Update existing post
        const index = posts.findIndex(post => post.id === this.currentPost.id);
        if (index !== -1) {
          posts[index] = { ...this.currentPost };
        }
      } else {
        // Create new post
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
        posts.push({
          ...this.currentPost,
          id: newId
        });
      }
      
      // Reset form
      this.resetForm();
      alert('Post saved successfully!');
    },
    editPost(post) {
      this.currentPost = { ...post };
      this.editingPost = true;
    },
    cancelEdit() {
      this.resetForm();
    },
    deletePost(id) {
      if (confirm('Are you sure you want to delete this post?')) {
        const index = posts.findIndex(post => post.id === id);
        if (index !== -1) {
          posts.splice(index, 1);
        }
      }
    },
    addTag(tag) {
      if (!this.currentPost.tags.includes(tag)) {
        this.currentPost.tags = [...this.currentPost.tags, tag];
      }
    },
    resetForm() {
      this.currentPost = {
        id: null,
        title: '',
        excerpt: '',
        date: this.getCurrentDate(),
        author: '',
        tags: [],
        category: '',
        content: ''
      };
      this.editingPost = false;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  }
}
</script>

<style scoped>
.post-manager {
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

.content-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr 1fr;
  }
}

.post-form, .post-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-form h2, .post-list h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
}

.tag-suggestions {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-suggestion {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tag-suggestion:hover {
  background: #667eea;
  color: white;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.search-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.post-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.post-header h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.post-excerpt {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.no-posts {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>