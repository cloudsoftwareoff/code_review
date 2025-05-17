import React from 'react'

const PRList = ({ prs, repo, onSelect, selectedPR, loading }) => {
  return (
    <div className="panel pr-panel">
      <div className="panel-header">
        <h2>Pull Requests {repo?.name && `- ${repo.name}`}</h2>
      </div>
      <div className="panel-content">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading pull requests...</p>
          </div>
        ) : !repo ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p>Select a repository to view pull requests</p>
          </div>
        ) : prs.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
              <circle cx="18" cy="18" r="3"></circle>
              <circle cx="6" cy="6" r="3"></circle>
              <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
              <line x1="6" y1="9" x2="6" y2="21"></line>
            </svg>
            <p>No open pull requests found</p>
          </div>
        ) : (
          <ul className="list pr-list">
            {prs.map(pr => (
              <li 
                key={pr.id}
                className={`list-item ${selectedPR?.id === pr.id ? 'selected' : ''}`}
                onClick={() => onSelect(pr)}
              >
                <div className="item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                    <line x1="6" y1="9" x2="6" y2="21"></line>
                  </svg>
                </div>
                <div className="item-content">
                  <h3 className="item-title">{pr.title}</h3>
                  <p className="item-subtitle">
                    #{pr.number} opened by <span className="user-name">{pr.user.login}</span>
                  </p>
                  <div className="item-meta">
                    <span className="date">
                      Updated {new Date(pr.updated_at).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PRList