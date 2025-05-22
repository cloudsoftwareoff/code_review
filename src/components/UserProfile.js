function UserProfile({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 h-24 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="flex items-start space-x-4 -mt-12">
          <div className="relative">
            <img 
              src={user.avatar_url} 
              alt={`${user.login}'s avatar`}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">{user.name || user.login}</h2>
            <p className="text-violet-600 font-medium">@{user.login}</p>
            {user.bio && (
              <p className="text-gray-600 mt-2 leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{user.public_repos}</div>
            <div className="text-sm text-gray-500 font-medium">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{user.followers}</div>
            <div className="text-sm text-gray-500 font-medium">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{user.following}</div>
            <div className="text-sm text-gray-500 font-medium">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default UserProfile;