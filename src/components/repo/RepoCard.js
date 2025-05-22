import { formatDate, getLanguageClass } from '../../utils/repoUtils';

const RepoCard = ({ repo, onViewPullRequests, onViewContents }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={repo.owner?.avatar_url || "/api/placeholder/48/48"}
                alt="Owner avatar"
                className="w-12 h-12 rounded-full ring-2 ring-violet-100 group-hover:ring-violet-200 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                {repo.owner?.login || "User"}
              </h3>
              <p className="text-violet-600 font-medium truncate">{repo.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
              repo.private 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                repo.private ? 'bg-red-400' : 'bg-emerald-400'
              }`}></div>
              {repo.private ? 'Private' : 'Public'}
            </span>
          </div>
        </div>

        {/* Description */}
        {repo.description && (
          <div className="mb-5">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {repo.description}
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center space-x-6 mb-5 text-sm">
          <div className="flex items-center space-x-1 text-gray-500">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-gray-700">{repo.stargazers_count}</span>
          </div>

          <div className="flex items-center space-x-1 text-gray-500">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-700">{repo.watchers_count}</span>
          </div>

          <div className="flex items-center space-x-1 text-gray-500">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-700">{repo.open_issues_count || 0}</span>
          </div>

          {repo.language && (
            <div className="ml-auto">
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getLanguageClass(repo.language)}`}>
                <div className="w-2 h-2 rounded-full mr-1.5 bg-current opacity-60"></div>
                {repo.language}
              </span>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
            <p className="text-sm text-gray-700 font-medium">{formatDate(repo.created_at)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Updated</p>
            <p className="text-sm text-gray-700 font-medium">{formatDate(repo.updated_at)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            View Repo
          </a>
          
          <button
            onClick={() => onViewPullRequests(repo)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Pull Requests
          </button>
          
          <button
            onClick={() => onViewContents(repo)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            View Contents
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;