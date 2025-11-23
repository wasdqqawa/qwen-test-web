# Vue Blog for GitHub Pages

A modern, responsive blog built with Vue 3 and Vite, optimized for deployment on GitHub Pages. This project includes advanced features like post navigation, search functionality, categories, comments, and a responsive design with a content management system.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Blog Posts**: View and navigate between blog posts with next/previous navigation
- **Search Functionality**: Search through blog posts by title, content, or excerpt
- **Categories**: Browse posts by category with filtering capability
- **Comments System**: Interactive comment system with replies and likes
- **Sidebar**: Includes recent posts, popular posts, and tags
- **Content Management**: Create, edit, and manage posts through the Post Manager interface
- **Modern UI**: Clean and attractive user interface
- **Static File Deployment**: Optimized for GitHub Pages hosting

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Deploying to GitHub Pages

### Method 1: Using gh-pages (Recommended)

1. Modify the `base` option in `vite.config.js` to match your repository name:
```js
export default defineConfig({
  // ...
  base: '/your-repository-name/', // Replace with your GitHub repository name
  // ...
})
```

2. Build the project:
```bash
npm run build
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Method 2: Using GitHub Actions (Recommended for automated deployment)

The project includes a GitHub Actions workflow file at `.github/workflows/deploy.yml` that will automatically deploy your site when you push to the main branch.

## Content Management

The blog includes a Post Manager feature accessible through the "Manage Posts" link in the navigation. You can:

- Create new blog posts
- Edit existing posts
- Delete posts
- Filter and search posts
- Organize posts by category and tags

All posts are stored in the client-side data layer in `/src/data/posts.js`.

## Project Structure

```
src/
├── components/
│   ├── About.vue          # About page component
│   ├── BlogPost.vue       # Individual blog post view with comments
│   ├── Category.vue       # Category browsing component
│   ├── Comments.vue       # Comments system component
│   ├── Contact.vue        # Contact page component with form
│   ├── Home.vue           # Main home page with posts and sidebar
│   ├── PostManager.vue    # Content management interface
│   ├── Search.vue         # Search functionality component
│   └── Sidebar.vue        # Sidebar with recent/popular posts and tags
├── data/                  # Centralized data management
│   └── posts.js           # All blog posts data and helper functions
├── App.vue               # Main application component with navigation
├── main.js               # Vue application entry and router configuration
└── assets/               # Static assets
```

## Customization

You can easily customize the blog:

1. Modify `src/components/Home.vue` to change the home page content
2. Update `src/components/About.vue` for the about page
3. Update `src/components/Contact.vue` for the contact page
4. Add more blog posts in `src/data/posts.js`
5. Add new categories in `src/components/Category.vue`
6. Update navigation links in `src/App.vue`
7. Modify styling in the `<style>` tags of each component
