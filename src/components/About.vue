<template>
  <div class="about">
    <section class="hero">
      <h1>关于本博客</h1>
      <p>了解我们的使命和价值观</p>
    </section>

    <section class="content">
      <div class="about-section">
        <h2>我们的故事</h2>
        <p>这个博客创建的目的是分享关于Web开发、技术和数字世界的知识、经验和见解。我们相信分享知识的力量，帮助他人学习和成长。</p>
        
        <p>成立于2025年，我们的使命是提供高质量、易获取的内容，帮助各个级别的开发人员提高技能，并了解技术领域的最新趋势。</p>
      </div>

      <div class="about-section">
        <h2>我们的工作</h2>
        <p>我们创建全面的教程、深入的文章和实用指南，涵盖各种主题，包括：</p>
        <ul>
          <li>前端框架（Vue.js、React、Angular）</li>
          <li>后端技术和API</li>
          <li>Web性能优化</li>
          <li>现代开发工具和实践</li>
          <li>UI/UX设计原则</li>
        </ul>
      </div>

      <div class="about-section">
        <h2>我们的团队</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="avatar">JD</div>
            <h3>简·多伊</h3>
            <p>高级前端开发工程师</p>
          </div>
          <div class="team-member">
            <div class="avatar">JS</div>
            <h3>约翰·史密斯</h3>
            <p>全栈工程师</p>
          </div>
          <div class="team-member">
            <div class="avatar">AJ</div>
            <h3>亚历克斯·约翰逊</h3>
            <p>技术作家和编辑</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About'
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

.content {
  max-width: 800px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.about-section p {
  line-height: 1.6;
  color: #495057;
  margin-bottom: 1rem;
}

.about-section ul {
  padding-left: 1.5rem;
  color: #495057;
  line-height: 1.8;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.team-member {
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.team-member h3 {
  margin: 0.5rem 0;
  color: #333;
}

.team-member p {
  color: #6c757d;
  margin: 0;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .about-section {
    padding: 1rem;
  }
}
</style>