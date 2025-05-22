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
    'JavaScript': 'bg-yellow-100 text-yellow-800',
    'TypeScript': 'bg-blue-100 text-blue-800',
    'HTML': 'bg-orange-100 text-orange-800',
    'CSS': 'bg-purple-100 text-purple-800',
    'Python': 'bg-green-100 text-green-800',
    'Java': 'bg-red-100 text-red-800',
    'C#': 'bg-indigo-100 text-indigo-800',
    'PHP': 'bg-pink-100 text-pink-800',
    'Ruby': 'bg-red-100 text-red-800',
    'Go': 'bg-blue-100 text-blue-800',
    'Swift': 'bg-orange-100 text-orange-800',
    'Kotlin': 'bg-purple-100 text-purple-800',
    'Rust': 'bg-orange-100 text-orange-800',
  };
  return languageClasses[language] || 'bg-gray-100 text-gray-800';
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
        localStorage.removeItem('github_access_token');
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