import { getUIColors, getFileTypeInfo} from '../../utils/repoUtils';
const FileList = ({ repoContents, onNavigate }) => {
  const colors = getUIColors();
  
  return (
    <div className={`${colors.background.card} rounded-lg shadow-lg overflow-hidden border ${colors.border.primary}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-violet-600 dark:text-violet-400 flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Repository Contents
        </h3>
        <p className={`${colors.text.secondary} text-sm mt-1`}>
          {repoContents.length} {repoContents.length === 1 ? 'item' : 'items'}
        </p>
      </div>
      
      <div className="p-6">
        {repoContents.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className={`${colors.text.secondary} text-lg font-medium mb-2`}>
              Directory is empty
            </p>
            <p className={`${colors.text.tertiary} text-sm`}>
              No files or folders found in this location.
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {repoContents.map(item => {
              const fileInfo = getFileTypeInfo(item.name);
              
              return (
                <li
                  key={item.sha}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                  onClick={() => onNavigate(item)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    {item.type === 'dir' ? (
                      <div className="flex-shrink-0 w-5 h-5 mr-3 text-blue-500 dark:text-blue-400">
                        <svg 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          className="w-full h-full"
                        >
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                      </div>
                    ) : (
                      <div className={`flex-shrink-0 w-5 h-5 mr-3 ${fileInfo.color}`}>
                        <span className="text-sm">{fileInfo.icon}</span>
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <span className={`${colors.text.primary} font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block`}>
                        {item.name}
                      </span>
                      {item.type === 'file' && item.size && (
                        <span className={`${colors.text.tertiary} text-xs block mt-0.5`}>
                          {formatFileSize(item.size)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4 flex-shrink-0">
                    <span className={`${colors.text.secondary} text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600`}>
                      {item.type === 'dir' ? 'Folder' : 'File'}
                    </span>
                    
                    <svg 
                      className={`w-4 h-4 ml-2 ${colors.text.tertiary} group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Loading state placeholder */}
      {repoContents.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs">
            <span className={colors.text.tertiary}>
              Last updated: {new Date().toLocaleDateString()}
            </span>
            <button 
              className={`${colors.interactive.ghost} px-2 py-1 rounded text-xs font-medium transition-colors`}
              onClick={(e) => {
                e.stopPropagation();
                window.location.reload();
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format file sizes
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default FileList;