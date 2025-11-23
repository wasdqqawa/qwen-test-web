// 博客文章数据
export const posts = [
  {
    id: 1,
    title: 'Getting Started with Vue.js',
    excerpt: 'Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable...',
    date: '2025-01-15',
    author: 'Jane Doe',
    tags: ['Vue.js', 'JavaScript', 'Tutorial'],
    category: 'Frontend',
    content: `Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable, meaning you can use as little or as much of Vue as you need. This makes it a great choice for both simple and complex applications.

Vue's core library focuses on the view layer only, making it easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with supporting libraries and modern tooling.

One of the main advantages of Vue is its gentle learning curve. If you have experience with HTML, CSS, and JavaScript, you'll find Vue very approachable. Its template syntax allows you to declaratively render data to the DOM using simple syntax that extends HTML.

Vue also provides a component system that allows you to build encapsulated, reusable components that form a whole application. These components can be nested, composed, and managed independently, making it easier to develop and maintain large applications.`
  },
  {
    id: 2,
    title: 'Understanding Modern Web Development',
    excerpt: 'Modern web development involves various technologies and practices that have evolved significantly over the past few years...',
    date: '2025-01-10',
    author: 'John Smith',
    tags: ['Web Development', 'JavaScript', 'Frontend'],
    category: 'Web Development',
    content: `Modern web development is a rapidly evolving field that encompasses a wide range of technologies, tools, and methodologies. Today's web developers need to be familiar with not just HTML, CSS, and JavaScript, but also frameworks, build tools, version control systems, and deployment strategies.

The rise of JavaScript frameworks like Vue, React, and Angular has transformed how we build web applications. These frameworks provide powerful tools for creating dynamic, interactive user interfaces while managing application state and data flow.

Additionally, modern web development emphasizes responsive design, accessibility, performance optimization, and cross-browser compatibility. With the increasing diversity of devices accessing the web, developers must ensure their applications work well across all platforms.

The development process has also become more sophisticated with tools like Webpack, Vite, and other build systems that handle bundling, minification, and optimization. These tools help developers create efficient applications that load quickly and provide a smooth user experience.`
  },
  {
    id: 3,
    title: 'The Future of Web Technologies',
    excerpt: 'As we look ahead, several emerging technologies are poised to reshape the web development landscape...',
    date: '2025-01-05',
    author: 'Alex Johnson',
    tags: ['Future Tech', 'WebAssembly', 'PWA'],
    category: 'Technology',
    content: `The web development landscape is constantly evolving, with new technologies and trends emerging regularly. As we look toward the future, several key areas are likely to shape the direction of web development.

WebAssembly (WASM) is gaining traction as a way to run high-performance applications in the browser, potentially written in languages like C, C++, or Rust. This opens up possibilities for more complex applications that were previously only possible as native applications.

Progressive Web Apps (PWAs) continue to blur the lines between web and native applications, offering app-like experiences directly through the browser. They can be installed, work offline, and provide push notifications, making them an attractive alternative to traditional mobile apps.

Artificial Intelligence and Machine Learning are also making their way into web applications. With APIs and libraries like TensorFlow.js, developers can now integrate ML capabilities directly into their web applications without requiring server-side processing.

Serverless architectures and edge computing are changing how we think about backend infrastructure, allowing developers to focus on writing code rather than managing servers. These technologies are making web applications more scalable and cost-effective.`
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