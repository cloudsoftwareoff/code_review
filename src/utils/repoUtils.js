export const filterRepos = (repos, filter) => {
  return repos.filter(repo =>
    repo.name.toLowerCase().includes(filter.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(filter.toLowerCase()))
  );
};

export const sortRepos = (repos, sort) => {
  return [...repos].sort((a, b) => {
    switch (sort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stars':
        return b.stargazers_count - a.stargazers_count;
      case 'updated':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at);
    }
  });
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const getLanguageClass = (language) => {
  const languageClasses = {
    'JavaScript': 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600/30',
    'TypeScript': 'bg-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600/30',
    'HTML': 'bg-orange-200 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600/30',
    'CSS': 'bg-purple-200 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600/30',
    'Python': 'bg-green-200 text-green-900 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600/30',
    'Java': 'bg-red-200 text-red-900 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600/30',
    'C#': 'bg-indigo-200 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-600/30',
    'PHP': 'bg-pink-200 text-pink-900 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-600/30',
    'Ruby': 'bg-rose-200 text-rose-900 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-600/30',
    'Go': 'bg-cyan-200 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-600/30',
    'Swift': 'bg-amber-200 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600/30',
    'Kotlin': 'bg-violet-200 text-violet-900 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-600/30',
    'Rust': 'bg-orange-200 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600/30',
    'C++': 'bg-slate-200 text-slate-900 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-600/30',
    'C': 'bg-gray-200 text-gray-900 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600/30',
    'Shell': 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600/30',
    'Dockerfile': 'bg-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600/30',
    'YAML': 'bg-teal-200 text-teal-900 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-600/30',
    'JSON': 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600/30',
    'Markdown': 'bg-gray-200 text-gray-900 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600/30',
  };
  return languageClasses[language] || 'bg-gray-200 text-gray-900 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600/30';
};

// Enhanced UI color utilities for dark mode
export const getUIColors = () => ({
  // Background colors
  background: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50',
    card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  },
  
  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
    muted: 'text-gray-400 dark:text-gray-600',
    inverse: 'text-white dark:text-gray-900',
  },
  
  // Border colors
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    focus: 'border-blue-500 dark:border-blue-400',
  },
  
  // Interactive elements
  interactive: {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
  },
  
  // Status colors
  status: {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  
  // Input elements
  input: {
    base: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400',
    disabled: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed',
  },
});

// Repository card styling helper
export const getRepoCardClasses = () => {
  const colors = getUIColors();
  return {
    container: `${colors.background.card} rounded-lg p-6 hover:shadow-md transition-shadow duration-200`,
    title: `${colors.text.primary} text-lg font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400`,
    description: `${colors.text.secondary} text-sm mb-4 line-clamp-2`,
    meta: `${colors.text.tertiary} text-xs flex items-center gap-4`,
    stats: `${colors.text.secondary} text-sm flex items-center gap-1`,
  };
};

// Enhanced file type icons and colors
export const getFileTypeInfo = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const fileTypes = {
    // Code files
    'js': { icon: '📄', color: 'text-yellow-600 dark:text-yellow-400' },
    'ts': { icon: '📘', color: 'text-blue-600 dark:text-blue-400' },
    'jsx': { icon: '⚛️', color: 'text-cyan-600 dark:text-cyan-400' },
    'tsx': { icon: '⚛️', color: 'text-blue-600 dark:text-blue-400' },
    'py': { icon: '🐍', color: 'text-green-600 dark:text-green-400' },
    'java': { icon: '☕', color: 'text-red-600 dark:text-red-400' },
    'html': { icon: '🌐', color: 'text-orange-600 dark:text-orange-400' },
    'css': { icon: '🎨', color: 'text-purple-600 dark:text-purple-400' },
    'php': { icon: '🐘', color: 'text-purple-600 dark:text-purple-400' },
    'rb': { icon: '💎', color: 'text-red-600 dark:text-red-400' },
    'go': { icon: '🐹', color: 'text-cyan-600 dark:text-cyan-400' },
    'rs': { icon: '🦀', color: 'text-orange-600 dark:text-orange-400' },
    'swift': { icon: '🕊️', color: 'text-orange-600 dark:text-orange-400' },
    'kt': { icon: '🅺', color: 'text-purple-600 dark:text-purple-400' },
    
    // Config files
    'json': { icon: '📋', color: 'text-yellow-600 dark:text-yellow-400' },
    'yaml': { icon: '📝', color: 'text-teal-600 dark:text-teal-400' },
    'yml': { icon: '📝', color: 'text-teal-600 dark:text-teal-400' },
    'xml': { icon: '📰', color: 'text-orange-600 dark:text-orange-400' },
    'toml': { icon: '⚙️', color: 'text-gray-600 dark:text-gray-400' },
    
    // Documentation
    'md': { icon: '📖', color: 'text-gray-600 dark:text-gray-400' },
    'txt': { icon: '📄', color: 'text-gray-600 dark:text-gray-400' },
    'pdf': { icon: '📕', color: 'text-red-600 dark:text-red-400' },
    
    // Images
    'jpg': { icon: '🖼️', color: 'text-green-600 dark:text-green-400' },
    'jpeg': { icon: '🖼️', color: 'text-green-600 dark:text-green-400' },
    'png': { icon: '🖼️', color: 'text-green-600 dark:text-green-400' },
    'gif': { icon: '🎞️', color: 'text-pink-600 dark:text-pink-400' },
    'svg': { icon: '🎨', color: 'text-purple-600 dark:text-purple-400' },
    
    // Other
    'zip': { icon: '🗜️', color: 'text-gray-600 dark:text-gray-400' },
    'tar': { icon: '📦', color: 'text-brown-600 dark:text-brown-400' },
    'sql': { icon: '🗄️', color: 'text-blue-600 dark:text-blue-400' },
  };
  
  return fileTypes[extension] || { icon: '📄', color: 'text-gray-600 dark:text-gray-400' };
};

export const fetchRepoContents = async (repo, path = '', accessToken, setRepoContents) => {
  try {
    const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Note: localStorage usage removed for Claude.ai compatibility
        // localStorage.removeItem('github_access_token');
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        throw new Error('GitHub authentication error. Please sign in again.');
      }
      throw new Error(`Failed to fetch repo contents: ${response.statusText}`);
    }

    const data = await response.json();
    setRepoContents(Array.isArray(data) ? data : [data]);
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    setRepoContents([]);
    throw error;
  }
};

export const fetchFileContent = async (file, accessToken) => {
  try {
    const response = await fetch(file.download_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
};