<template>
  <div class="blog-post">
    <article class="post-content" v-if="post">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <p>作者 {{ post.author }} 发布于 {{ formatDate(post.date) }}</p>
      </div>
      <div class="post-body" v-html="formatContent(post.content)"></div>
      
      <div class="post-navigation">
        <router-link 
          v-if="prevPost" 
          :to="`/post/${prevPost.id}`" 
          class="nav-link prev"
        >
          ← {{ prevPost.title }}
        </router-link>
        
        <router-link to="/" class="nav-link home">返回首页</router-link>
        
        <router-link 
          v-if="nextPost" 
          :to="`/post/${nextPost.id}`" 
          class="nav-link next"
        >
          {{ nextPost.title }} →
        </router-link>
      </div>
      
      <Comments :postId="post.id" />
    </article>
    
    <div v-else class="not-found">
      <h2>未找到文章</h2>
      <p>您查找的文章不存在。</p>
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script>
import Comments from './Comments.vue';
import { getPostById, getAllPosts } from '../data/posts.js';

export default {
  name: 'BlogPost',
  components: {
    Comments
  },
  props: ['id'],
  data() {
    return {
      posts: getAllPosts()
    }
  },
  computed: {
    post() {
      return getPostById(this.id);
    },
    prevPost() {
      if (!this.post) return null;
      const currentIndex = this.posts.findIndex(p => p.id === this.post.id);
      return currentIndex > 0 ? this.posts[currentIndex - 1] : null;
    },
    nextPost() {
      if (!this.post) return null;
      const currentIndex = this.posts.findIndex(p => p.id === this.post.id);
      return currentIndex < this.posts.length - 1 ? this.posts[currentIndex + 1] : null;
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatContent(content) {
      // Simple markdown-like formatting for paragraphs
      return content
        .split('\n\n')
        .map(paragraph => `<p>${paragraph.trim()}</p>`)
        .join('');
    }
  }
}
</script>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.post-meta {
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.post-body {
  line-height: 1.8;
  color: #495057;
  font-size: 1.1rem;
}

.post-body p {
  margin-bottom: 1.5rem;
}

.post-navigation {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-decoration: none;
  color: #495057;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.nav-link:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

.nav-link.prev {
  text-align: left;
}

.nav-link.next {
  text-align: right;
}

.nav-link.home {
  flex: 2;
}

.not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.not-found h2 {
  margin-bottom: 1rem;
  color: #333;
}

.not-found a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.not-found a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .blog-post {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 2rem;
  }
  
  .post-navigation {
    flex-direction: column;
  }
  
  .nav-link {
    width: 100%;
  }
}
</style>