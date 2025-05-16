import React from 'react'

const RepoList = ({ repos, onSelect, selectedRepo }) => {
  return (
    <div className="repo-list">
      <h2>Repositories</h2>
      {repos.length === 0 ? (
        <p>No repositories found</p>
      ) : (
        <ul>
          {repos.map(repo => (
            <li 
              key={repo.id}
              className={`repo-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
              onClick={() => onSelect(repo)}
            >
              <h3>{repo.name}</h3>
              <p>{repo.full_name}</p>
              <small>{repo.private ? 'Private' : 'Public'}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RepoList