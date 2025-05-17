function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="user-avatar">
        <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
      </div>
      <div className="user-info">
        <h2>{user.name || user.login}</h2>
        <p className="username">@{user.login}</p>
        {user.bio && <p className="user-bio">{user.bio}</p>}
        <div className="user-stats">
          <div>
            <span className="stat-value">{user.public_repos}</span>
            <span className="stat-label">Repositories</span>
          </div>
          <div>
            <span className="stat-value">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div>
            <span className="stat-value">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;