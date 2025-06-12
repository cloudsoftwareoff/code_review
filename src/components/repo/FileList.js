const FileList = ({ repoContents, onNavigate }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-violet-400 mb-4 dark:text-violet-400">Repository Contents</h3>
      <ul className="space-y-2">
        {repoContents.map(item => (
          <li
            key={item.sha}
            className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer dark:hover:bg-gray-700"
            onClick={() => onNavigate(item)}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {item.type === 'dir' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                )}
              </svg>
              <span className="text-gray-300 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="text-sm text-gray-400 dark:text-gray-400">{item.type === 'dir' ? 'Directory' : 'File'}</span>
          </li>
        ))}
      </ul>
      {repoContents.length === 0 && (
        <p className="text-gray-400 text-center dark:text-gray-400">No contents found in this directory.</p>
      )}
    </div>
  );
};

export default FileList;