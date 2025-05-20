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
        return 'bg-green-100 text-green-800';
      case 'REQUEST_CHANGES':
        return 'bg-red-100 text-red-800';
      case 'COMMENTED':
      case 'COMMENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-4">
      <h5 className="text-sm font-semibold text-gray-700 mb-2">Reviews:</h5>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-3 bg-white rounded border border-gray-200"
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.user.avatar_url}
                  alt={`${review.user.login}'s avatar`}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {review.user.login}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getReviewStatusClass(
                    review.state
                  )}`}
                >
                  {review.state}
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {formatDate(review.submitted_at)}
                </span>
              </div>
              {review.body && (
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {review.body}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No reviews yet</p>
      )}
    </div>
  );
}

export default ReviewList;