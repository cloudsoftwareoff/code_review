import React from 'react'

const PRList = ({ prs, repo, onSelect, selectedPR }) => {
  return (
    <div className="pr-list">
      <h2>Pull Requests - {repo?.name}</h2>
      {prs.length === 0 ? (
        <p>No open pull requests found</p>
      ) : (
        <ul>
          {prs.map(pr => (
            <li 
              key={pr.id}
              className={`pr-item ${selectedPR?.id === pr.id ? 'selected' : ''}`}
              onClick={() => onSelect(pr)}
            >
              <h3>{pr.title}</h3>
              <p>#{pr.number} by {pr.user.login}</p>
              <small>Last updated: {new Date(pr.updated_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PRList