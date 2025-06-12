import { useState } from 'react';
import { useCodeReviewContext } from '../../App';
import RepoCard from './RepoCard';
import RepoFilesView from './RepoFilesView';
import PullRequestsView from './PullRequestsView';
import { filterRepos, sortRepos, fetchRepoContents, fetchFileContent } from '../../utils/repoUtils';

function RepoList({ repos, accessToken }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('updated');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [viewMode, setViewMode] = useState('repos');
  const [repoContents, setRepoContents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const { setContext } = useCodeReviewContext();

  const filteredRepos = filterRepos(repos, filter);
  const sortedRepos = sortRepos(filteredRepos, sort);

  const handleViewContents = (repo) => {
    setSelectedRepo(repo);
    setViewMode('files');
    setCurrentPath('');
    fetchRepoContents(repo, '', accessToken, setRepoContents);
    setContext(prev => ({ ...prev, repo, file: null }));
  };

  const handleViewPullRequests = (repo) => {
    setSelectedRepo(repo);
    setViewMode('pullRequests');
    setContext(prev => ({ ...prev, repo, file: null }));
  };

  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setSelectedFile(null);
    setViewMode('repos');
    setRepoContents([]);
    setCurrentPath('');
    setContext(prev => ({ ...prev, repo: null, file: null }));
  };

  const handleNavigateDirectory = async (item) => {
    if (item && item.type === 'dir') {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setCurrentPath(newPath);
      fetchRepoContents(selectedRepo, newPath, accessToken, setRepoContents);
      setSelectedFile(null);
      setContext(prev => ({ ...prev, file: null }));
    } else if (item && item.type === 'file') {
      setSelectedFile(item);
      const content = await fetchFileContent(item, accessToken);
      setContext(prev => ({
        ...prev,
        repo: selectedRepo,
        file: {
          name: item.name,
          path: item.path,
          url: item.download_url,
          content,
        },
      }));
    } else {
      setSelectedFile(null);
      setContext(prev => ({ ...prev, file: null }));
    }
  };

  const handleBackToParent = () => {
    const pathParts = currentPath.split('/');
    const newPath = pathParts.slice(0, -1).join('/');
    setCurrentPath(newPath);
    fetchRepoContents(selectedRepo, newPath, accessToken, setRepoContents);
    setSelectedFile(null);
    setContext(prev => ({ ...prev, file: null }));
  };

  if (viewMode === 'files' && selectedRepo) {
    return (
      <RepoFilesView
        selectedRepo={selectedRepo}
        repoContents={repoContents}
        selectedFile={selectedFile}
        currentPath={currentPath}
        onBackToRepos={handleBackToRepos}
        onBackToParent={handleBackToParent}
        onNavigate={handleNavigateDirectory}
        accessToken={accessToken}
      />
    );
  }

  if (viewMode === 'pullRequests' && selectedRepo) {
    return (
      <PullRequestsView
        selectedRepo={selectedRepo}
        onBackToRepos={handleBackToRepos}
        accessToken={accessToken}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Your Repositories
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-900/50 text-violet-200 border border-violet-800/50">
                  {repos.length} total repositories
                </span>
                {filteredRepos.length !== repos.length && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-200 border border-blue-800/50">
                    {filteredRepos.length} filtered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search repositories by name or description..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors bg-gray-700/50 focus:bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors font-medium min-w-[180px] text-white"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="stars">Most Stars</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repository Grid */}
        {sortedRepos.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedRepos.map(repo => (
              <RepoCard
                key={repo.id}
                repo={repo}
                onViewPullRequests={handleViewPullRequests}
                onViewContents={handleViewContents}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No repositories found</h3>
              <p className="text-gray-400 mb-4">
                {filter ? 
                  `No repositories match your search "${filter}"` : 
                  "You don't have any repositories yet"
                }
              </p>
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RepoList;