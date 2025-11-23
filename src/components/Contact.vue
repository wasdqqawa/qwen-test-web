<template>
  <div class="contact">
    <section class="hero">
      <h1>联系我们</h1>
      <p>有问题或反馈？请随时与我们联系</p>
    </section>

    <section class="content">
      <div class="contact-info">
        <h2>联系我们</h2>
        <p>如果您有任何问题、建议或只是想打个招呼，请随时使用以下任何方式与我们联系。</p>
        
        <div class="contact-details">
          <div class="contact-item">
            <h3>邮箱</h3>
            <p><a href="mailto:hello@example.com">hello@example.com</a></p>
          </div>
          
          <div class="contact-item">
            <h3>关注我们</h3>
            <div class="social-links">
              <a href="#" target="_blank">Twitter</a>
              <a href="#" target="_blank">GitHub</a>
              <a href="#" target="_blank">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      <form class="contact-form" @submit.prevent="submitForm">
        <h2>发送消息</h2>
        
        <div class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="form.name" required>
        </div>
        
        <div class="form-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="form.email" required>
        </div>
        
        <div class="form-group">
          <label for="subject">主题</label>
          <input type="text" id="subject" v-model="form.subject" required>
        </div>
        
        <div class="form-group">
          <label for="message">消息</label>
          <textarea id="message" v-model="form.message" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="submit-btn">发送消息</button>
        
        <div v-if="submitted" class="success-message">
          感谢您的消息！我们会尽快回复您。
        </div>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      submitted: false
    }
  },
  methods: {
    submitForm() {
      // In a real application, this would send the form data to a server
      console.log('Form submitted:', this.form)
      this.submitted = true
      
      // Reset form after 5 seconds
      setTimeout(() => {
        this.submitted = false
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      }, 5000)
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

.content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.contact-info, .contact-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info h2, .contact-form h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.contact-details {
  margin-top: 1.5rem;
}

.contact-item {
  margin-bottom: 1.5rem;
}

.contact-item h3 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.contact-item a {
  color: #667eea;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-links a {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.social-links a:hover {
  background: #e9ecef;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background: #5a6fd8;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}

@media (min-width: 768px) {
  .content {
    grid-template-columns: 1fr 1fr;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
}
</style>