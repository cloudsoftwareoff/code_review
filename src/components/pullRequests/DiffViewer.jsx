import { parseDiff } from '../../utils/pull-requests/parseDiff';

function DiffViewer({ diff }) {
  const { left, right, headers } = parseDiff(diff);

  const getLineTypeIcon = (type) => {
    switch (type) {
      case 'added':
        return <span className="text-green-400 font-bold dark:text-green-400">+</span>;
      case 'removed':
        return <span className="text-red-400 font-bold dark:text-red-400">-</span>;
      default:
        return <span className="text-gray-500 dark:text-gray-500"> </span>;
    }
  };

  const renderLine = (line, index, side) => {
    const isHeader = headers.includes(line.content);
    
    return (
      <div
        key={`${side}-${index}`}
        className={`group flex text-sm font-mono transition-colors duration-150 hover:bg-opacity-75 ${
          line.type === 'added'
            ? 'bg-green-900 hover:bg-green-800 dark:bg-green-900 dark:hover:bg-green-800'
            : line.type === 'removed'
            ? 'bg-red-900 hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800'
            : line.type === 'unchanged'
            ? 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
            : 'bg-gray-700 dark:bg-gray-700'
        }`}
      >
        {/* Line type indicator */}
        <div className="w-6 flex items-center justify-center py-1 bg-gray-700 border-r border-gray-600 dark:bg-gray-700 dark:border-gray-600">
          {getLineTypeIcon(line.type)}
        </div>
        
        {/* Line number */}
        <div className="w-12 bg-gray-700 text-gray-400 text-right pr-2 py-1 border-r border-gray-600 select-none dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
          <span className="text-xs">
            {line.lineNum || ''}
          </span>
        </div>
        
        {/* Code content */}
        <div className="flex-1 py-1 px-3 overflow-x-auto">
          <pre className="whitespace-pre-wrap break-words">
            <code
              className={`${
                line.content && !isHeader
                  ? 'language-javascript'
                  : ''
              } ${
                isHeader 
                  ? 'text-blue-400 font-semibold dark:text-blue-400' 
                  : line.type === 'added'
                  ? 'text-green-300 dark:text-green-300'
                  : line.type === 'removed'
                  ? 'text-red-300 dark:text-red-300'
                  : 'text-gray-300 dark:text-gray-300'
              }`}
            >
              {line.content || '\u00A0'}
            </code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-lg font-semibold text-gray-100 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Changes
        </h5>
        <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-900 rounded-sm border border-green-700 dark:bg-green-900 dark:border-green-700"></div>
            <span>Added</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-900 rounded-sm border border-red-700 dark:bg-red-900 dark:border-red-700"></div>
            <span>Removed</span>
          </div>
        </div>
      </div>

      {/* Diff container */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="bg-gray-700 border-b border-gray-600 px-4 py-2 dark:bg-gray-700 dark:border-gray-600">
          <div className="flex">
            <div className="w-1/2 text-sm font-medium text-gray-300 flex items-center gap-2 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Original
            </div>
            <div className="w-1/2 text-sm font-medium text-gray-300 flex items-center gap-2 pl-4 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Modified
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <div className="flex min-h-0">
            {/* Left side (original) */}
            <div className="w-1/2 border-r border-gray-600 dark:border-gray-600">
              {left.map((line, index) => renderLine(line, index, 'left'))}
            </div>
            
            {/* Right side (modified) */}
            <div className="w-1/2">
              {right.map((line, index) => renderLine(line, index, 'right'))}
            </div>
          </div>
        </div>

        {/* Footer with stats */}
        <div className="bg-gray-700 border-t border-gray-600 px-4 py-2 dark:bg-gray-700 dark:border-gray-600">
          <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-400">
            <span>{Math.max(left.length, right.length)} lines</span>
            <div className="flex gap-4">
              <span className="text-green-400 dark:text-green-400">
                +{right.filter(line => line.type === 'added').length}
              </span>
              <span className="text-red-400 dark:text-red-400">
                -{left.filter(line => line.type === 'removed').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffViewer;