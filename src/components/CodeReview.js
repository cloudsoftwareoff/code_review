import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { auth, db } from '../lib/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

const CodeReview = ({ review, loading, commits, files, diffs }) => {
  const [feedback, setFeedback] = useState({});

  const handleFeedback = async (file, suggestion, action) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const feedbackId = `${user.uid}_${file}_${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const feedbackData = {
        id: feedbackId,
        user_uid: user.uid,
        file,
        suggestion,
        action,
        created_at: new Date().toISOString(),
      };

      const feedbackRef = doc(db, 'review_feedback', feedbackId);
      await setDoc(feedbackRef, feedbackData, { merge: true });

      setFeedback(prev => ({ ...prev, [file]: action }));
    } catch (error) {
      console.error('Error storing feedback:', error);
      alert(`Failed to store feedback: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="panel review-panel">
        <div className="panel-header">
          <h2>Code Review</h2>
        </div>
        <div className="panel-content">
          <div className="loading-container">
            <div className="loader"></div>
            <p>Analyzing code and generating review...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!review && !commits.length && !files.length) {
    return (
      <div className="panel review-panel">
        <div className="panel-header">
          <h2>Code Review</h2>
        </div>
        <div className="panel-content">
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="empty-icon"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>No review data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel review-panel">
      <div className="panel-header">
        <h2>Code Review Results</h2>
      </div>
      <div className="panel-content">
        <div className="review-summary">
          <div className="summary-item">
            <span className="summary-label">Commits:</span>
            <span className="summary-value">{commits.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Files Modified:</span>
            <span className="summary-value">{files.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">PR Health:</span>
            <span className={`summary-value health-${review?.overall_health || 'neutral'}`}>
              {review?.overall_health || 'Neutral'}
            </span>
          </div>
        </div>

        {commits.length > 0 && (
          <div className="commit-section mb-6">
            <h3 className="text-lg font-semibold mb-2">Commits</h3>
            <ul className="list-disc pl-5">
              {commits.map((commit, index) => (
                <li key={index} className="mb-2">
                  <p className="font-medium">{commit.commit.message}</p>
                  <p className="text-sm text-gray-600">SHA: {commit.sha.substring(0, 7)}</p>
                  <p className="text-sm text-gray-600">
                    By {commit.commit.author.name} on{' '}
                    {new Date(commit.commit.author.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {files.length > 0 && (
          <div className="file-section mb-6">
            <h3 className="text-lg font-semibold mb-2">Modified Files</h3>
            {files.map((file, index) => (
              <div key={index} className="file-review mb-4">
                <div className="file-header flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <h3 className="ml-2">{file.filename}</h3>
                </div>
                <div className="file-diff mt-2">
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {diffs[file.filename] ? (
                      diffs[file.filename].split('\n').map((line, i) => (
                        <div
                          key={i}
                          className={
                            line.startsWith('+')
                              ? 'text-green-600'
                              : line.startsWith('-')
                              ? 'text-red-600'
                              : ''
                          }
                        >
                          {line}
                        </div>
                      ))
                    ) : (
                      'No diff available'
                    )}
                  </pre>
                </div>
                {review?.reviews?.find(r => r.file === file.filename) && (
                  <div className="review-markdown mt-2">
                    <ReactMarkdown>
                      {review.reviews.find(r => r.file === file.filename).review}
                    </ReactMarkdown>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleFeedback(
                            file.filename,
                            review.reviews.find(r => r.file === file.filename).review,
                            'accept'
                          )
                        }
                        className={`bg-green-600 text-white py-1 px-3 rounded ${
                          feedback[file.filename] === 'accept' ? 'opacity-50' : ''
                        }`}
                        disabled={feedback[file.filename] === 'accept'}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleFeedback(
                            file.filename,
                            review.reviews.find(r => r.file === file.filename).review,
                            'reject'
                          )
                        }
                        className={`bg-red-600 text-white py-1 px-3 rounded ${
                          feedback[file.filename] === 'reject' ? 'opacity-50' : ''
                        }`}
                        disabled={feedback[file.filename] === 'reject'}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeReview;