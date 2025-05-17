import { useState } from 'react';
import PullRequestsList from './PullRequestsList';

function RepoList({ repos, accessToken }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('updated');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [viewMode, setViewMode] = useState('repos'); // 'repos' or 'pullRequests'

  // Filter repos by name or description
  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(filter.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(filter.toLowerCase()))
  );

  // Sort repos
  const sortedRepos = [...filteredRepos].sort((a, b) => {
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

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Get language class for the language badge
  const getLanguageClass = (language) => {
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

  // Handle view pull requests
  const handleViewPullRequests = (repo) => {
    setSelectedRepo(repo);
    setViewMode('pullRequests');
  };

  // Handle back to repos
  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setViewMode('repos');
  };

  // If we're viewing pull requests for a specific repo
  if (viewMode === 'pullRequests' && selectedRepo) {
    return (
      <div className="bg-violet-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center">
            <button
              onClick={handleBackToRepos}
              className="flex items-center text-violet-700 hover:text-violet-900 font-medium"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Repositories
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-violet-800">{selectedRepo.name}</h2>
            {selectedRepo.description && (
              <p className="text-gray-700 mt-1">{selectedRepo.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${selectedRepo.private ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {selectedRepo.private ? 'Private' : 'Public'}
              </span>
              {selectedRepo.language && (
                <span className={`px-2 py-1 text-xs rounded-full ${getLanguageClass(selectedRepo.language)}`}>
                  {selectedRepo.language}
                </span>
              )}
              <span className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {selectedRepo.stargazers_count}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <PullRequestsList repo={selectedRepo} accessToken={accessToken} />
          </div>
        </div>
      </div>
    );
  }

  // Default view - showing repositories
  return (
    <div className="bg-violet-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-violet-800 mb-6">Repositories ({repos.length})</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Filter repositories..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow p-3 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-3 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="updated">Recently Updated</option>
            <option value="name">Name</option>
            <option value="stars">Stars</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRepos.map(repo => (
            <div key={repo.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                <div className="flex items-center mb-3">
                  {/* User avatar */}
                  <img 
                    src={repo.owner?.avatar_url || "/api/placeholder/40/40"} 
                    alt="Owner avatar" 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <h3 className="font-bold text-violet-800">{repo.owner?.login || "User"}</h3>
                    <p className="text-sm text-violet-600">{repo.name}</p>
                  </div>
                </div>
                
                {/* Visibility badge */}
                <div className="flex items-center mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${repo.private ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {repo.private ? 'Private' : 'Public'}
                  </span>
                </div>
                
                {/* Description */}
                {repo.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                
                {/* Repository dates */}
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Created:</span> {formatDate(repo.created_at)}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Last updated:</span> {formatDate(repo.updated_at)}
                  </p>
                </div>
                
                {/* Stats and View repo button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-violet-600 hover:bg-violet-700 text-white text-sm py-1 px-3 rounded transition-colors"
                    >
                      View Repo
                    </a>
                    <button 
                      onClick={() => handleViewPullRequests(repo)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded transition-colors"
                    >
                      Pull Requests
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {repo.watchers_count}
                    </span>
                  </div>
                </div>
                
                {/* Language badge and issues count */}
                <div className="flex items-center justify-between mt-3">
                  {repo.language ? (
                    <span className={`px-2 py-1 text-xs rounded-full ${getLanguageClass(repo.language)}`}>
                      {repo.language}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No language detected</span>
                  )}
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {repo.open_issues_count || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedRepos.length === 0 && (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">No repositories found matching your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RepoList;