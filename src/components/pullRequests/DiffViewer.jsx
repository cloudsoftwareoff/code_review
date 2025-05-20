import { parseDiff } from '../../utils/pull-requests/parseDiff';

function DiffViewer({ diff }) {
  const { left, right, headers } = parseDiff(diff);

  return (
    <div className="mb-4">
      <h5 className="text-sm font-semibold text-gray-700 mb-2">Changes:</h5>
      <div className="bg-white rounded border border-gray-200 overflow-auto max-h-96">
        <div className="flex">
          {/* Left side (original) */}
          <div className="w-1/2 border-r border-gray-200">
            {left.map((line, index) => (
              <div
                key={`left-${index}`}
                className={`flex text-sm font-mono ${
                  line.type === 'removed'
                    ? 'bg-red-100'
                    : line.type === 'unchanged'
                    ? 'bg-white'
                    : 'bg-gray-50'
                }`}
              >
                <div className="w-12 bg-gray-50 text-gray-500 text-right pr-2 py-1">
                  {line.lineNum || ''}
                </div>
                <pre className="flex-1 py-1 px-2">
                  <code
                    className={
                      line.content && !headers.includes(line.content)
                        ? 'language-javascript'
                        : ''
                    }
                  >
                    {line.content}
                  </code>
                </pre>
              </div>
            ))}
          </div>
          {/* Right side (modified) */}
          <div className="w-1/2">
            {right.map((line, index) => (
              <div
                key={`right-${index}`}
                className={`flex text-sm font-mono ${
                  line.type === 'added'
                    ? 'bg-green-100'
                    : line.type === 'unchanged'
                    ? 'bg-white'
                    : 'bg-gray-50'
                }`}
              >
                <div className="w-12 bg-gray-50 text-gray-500 text-right pr-2 py-1">
                  {line.lineNum || ''}
                </div>
                <pre className="flex-1 py-1 px-2">
                  <code
                    className={
                      line.content && !headers.includes(line.content)
                        ? 'language-javascript'
                        : ''
                    }
                  >
                    {line.content}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiffViewer;