import { useLocation, useNavigate } from 'react-router-dom';
import CodeReview from './CodeReview';

function CodeReviewScreen({ session }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { commits, files, diffs, aiReviews, pr } = location.state || {};

  return (
    <div className="bg-violet-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm py-1 px-3 rounded transition-colors mr-4"
          >
            Back to Repositories
          </button>
          <h1 className="text-3xl font-bold text-violet-800">
            Code Review for PR #{pr?.number} - {pr?.title}
          </h1>
        </div>
        <CodeReview
          review={aiReviews}
          loading={false}
          commits={commits || []}
          files={files || []}
          diffs={diffs || {}}
        />
      </div>
    </div>
  );
}

export default CodeReviewScreen;