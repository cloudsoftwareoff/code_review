import React from 'react'
import ReactMarkdown from 'react-markdown'

const CodeReview = ({ review }) => {
  if (!review) return null

  return (
    <div className="review-content">
      <h2>Code Review Results</h2>
      {review.review_data?.reviews?.length > 0 ? (
        review.review_data.reviews.map((fileReview, index) => (
          <div key={index} className="file-review">
            <h3>File: {fileReview.file}</h3>
            <div className="review-markdown">
              <ReactMarkdown>{fileReview.review}</ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <p>No review data available</p>
      )}
    </div>
  )
}

export default CodeReview