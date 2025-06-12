
import PullRequestsList from '../pullRequests/PullRequestsList';
import { getLanguageClass } from '../../utils/repoUtils';

const PullRequestsView = ({ selectedRepo, onBackToRepos, accessToken }) => {
  return (
    <div className="bg-gray-900 min-h-screen p-6 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center">
          <button
            onClick={onBackToRepos}
            className="flex items-center text-violet-400 hover:text-violet-300 font-medium dark:text-violet-400 dark:hover:text-violet-300"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Repositories
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-violet-400 dark:text-violet-400">{selectedRepo.name}</h2>
          {selectedRepo.description && (
            <p className="text-gray-300 mt-1 dark:text-gray-300">{selectedRepo.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${selectedRepo.private ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'} dark:bg-${selectedRepo.private ? 'red-900' : 'green-900'} dark:text-${selectedRepo.private ? 'red-300' : 'green-300'}`}>
              {selectedRepo.private ? 'Private' : 'Public'}
            </span>
            {selectedRepo.language && (
              <span className={`px-2 py-1 text-xs rounded-full ${getLanguageClass(selectedRepo.language)}`}>
                {selectedRepo.language}
              </span>
            )}
            <span className="text-sm text-gray-400 flex items-center dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {selectedRepo.stargazers_count}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
          <PullRequestsList repo={selectedRepo} accessToken={accessToken} />
        </div>
      </div>
    </div>
  );
};

export default PullRequestsView;