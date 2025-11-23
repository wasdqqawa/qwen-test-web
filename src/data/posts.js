// 博客文章数据
export let posts = [
  {
    id: 1,
    title: 'Vue.js入门指南',
    excerpt: 'Vue.js是一个用于构建用户界面的渐进式JavaScript框架。它被设计为可以自底向上逐层应用...',
    date: '2025-01-15',
    author: '简·多伊',
    tags: ['Vue.js', 'JavaScript', '教程'],
    category: '前端',
    content: `Vue.js是一个用于构建用户界面的渐进式JavaScript框架。它被设计为可以自底向上逐层应用，这意味着你可以根据需要使用少量或大量的Vue。这使其成为简单和复杂应用程序的绝佳选择。

Vue的核心库只关注视图层，使其易于拾取并与其他库或现有项目集成。另一方面，当与支持库和现代工具结合使用时，Vue也完全有能力驱动复杂的单页应用程序。

Vue的主要优势之一是其温和的学习曲线。如果你有HTML、CSS和JavaScript的经验，你会发现Vue非常容易上手。它的模板语法允许你使用扩展HTML的简单语法声明性地将数据渲染到DOM中。

Vue还提供了一个组件系统，允许你构建封装的、可重用的组件，形成一个完整应用程序。这些组件可以嵌套、组合和独立管理，使开发和维护大型应用程序变得更加容易。`
  },
  {
    id: 2,
    title: '理解现代Web开发',
    excerpt: '现代Web开发涉及在过去几年中显著发展的各种技术和实践...',
    date: '2025-01-10',
    author: '约翰·史密斯',
    tags: ['Web开发', 'JavaScript', '前端'],
    category: 'Web开发',
    content: `现代Web开发是一个快速发展的领域，涵盖了广泛的技术、工具和方法。今天的Web开发人员不仅需要熟悉HTML、CSS和JavaScript，还需要了解框架、构建工具、版本控制系统和部署策略。

JavaScript框架如Vue、React和Angular的兴起改变了我们构建Web应用程序的方式。这些框架提供了强大的工具来创建动态、交互式用户界面，同时管理应用程序状态和数据流。

此外，现代Web开发强调响应式设计、可访问性、性能优化和跨浏览器兼容性。随着访问Web的设备多样性不断增加，开发人员必须确保他们的应用程序在所有平台上都能良好运行。

开发过程也变得更加复杂，使用Webpack、Vite等工具处理捆绑、缩小和优化。这些工具帮助开发人员创建高效的、快速加载并提供流畅用户体验的应用程序。`
  },
  {
    id: 3,
    title: 'Web技术的未来',
    excerpt: '展望未来，几种新兴技术即将重塑Web开发格局...',
    date: '2025-01-05',
    author: '亚历克斯·约翰逊',
    tags: ['未来技术', 'WebAssembly', 'PWA'],
    category: '技术',
    content: `Web开发格局在不断变化，新的技术和趋势定期出现。展望未来，几个关键领域可能会塑造Web开发的方向。

WebAssembly（WASM）正在获得关注，成为一种在浏览器中运行高性能应用程序的方法，这些应用程序可能是用C、C++或Rust等语言编写的。这为以前只能作为本机应用程序的更复杂应用程序开辟了可能性。

渐进式Web应用程序（PWA）继续模糊Web和本机应用程序之间的界限，直接通过浏览器提供类似应用程序的体验。它们可以安装、离线工作并提供推送通知，使其成为传统移动应用程序的有吸引力的替代品。

人工智能和机器学习也正在进入Web应用程序。借助TensorFlow.js等API和库，开发人员现在可以直接将ML功能集成到Web应用程序中，而无需服务器端处理。

无服务器架构和边缘计算正在改变我们对后端基础设施的思考方式，允许开发人员专注于编写代码，而不是管理服务器。这些技术使Web应用程序更具可扩展性和成本效益。`
  }
];

// 获取所有文章
export const getAllPosts = () => {
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    author: post.author,
    tags: post.tags,
    category: post.category
  }));
};

// 根据ID获取特定文章
export const getPostById = (id) => {
  return posts.find(post => post.id === parseInt(id));
};

// 获取最近的文章
export const getRecentPosts = (count = 3) => {
  return [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};

// 搜索文章
export const searchPosts = (query) => {
  if (!query) return posts;
  
  const searchTerm = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) || 
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// 获取所有标签
export const getAllTags = () => {
  const allTags = posts.flatMap(post => post.tags);
  return [...new Set(allTags)];
};

// 获取所有分类
export const getAllCategories = () => {
  const allCategories = posts.map(post => post.category);
  return [...new Set(allCategories)];
};

// 根据分类获取文章
export const getPostsByCategory = (category) => {
  return posts.filter(post => post.category === category);
};

// 根据标签获取文章
export const getPostsByTag = (tag) => {
  return posts.filter(post => post.tags.includes(tag));
};

// 创建新文章
export const createPost = (postData) => {
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  const newPost = {
    id: newId,
    ...postData,
    date: postData.date || new Date().toISOString().split('T')[0]
  };
  posts.push(newPost);
  return newPost;
};

// 更新文章
export const updatePost = (id, postData) => {
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...postData };
    return posts[index];
  }
  return null;
};

// 删除文章
export const deletePost = (id) => {
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
    return true;
  }
  return false;
};