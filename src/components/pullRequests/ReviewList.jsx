function ReviewList({ reviews }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getReviewStatusClass = (state) => {
    switch (state) {
      case 'APPROVED':
        return 'bg-green-900 text-green-300';
      case 'REQUEST_CHANGES':
        return 'bg-red-900 text-red-300';
      case 'COMMENTED':
      case 'COMMENT':
        return 'bg-blue-900 text-blue-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="mb-4">
      <h5 className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-2">Reviews:</h5>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-3 bg-gray-800 rounded border border-gray-700 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.user.avatar_url}
                  alt={`${review.user.login}'s avatar`}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm font-medium text-gray-300 dark:text-gray-300">
                  {review.user.login}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getReviewStatusClass(
                    review.state
                  )} dark:${getReviewStatusClass(review.state)}`}
                >
                  {review.state}
                </span>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-400">
                  {formatDate(review.submitted_at)}
                </span>
              </div>
              {review.body && (
                <p className="text-sm text-gray-400 whitespace-pre-line dark:text-gray-400">
                  {review.body}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-400">No reviews yet</p>
      )}
    </div>
  );
}
export default ReviewList;