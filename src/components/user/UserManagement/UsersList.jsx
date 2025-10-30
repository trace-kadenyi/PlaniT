const UsersList = () => {
  return (
    <div className="divide-y divide-gray-200">
      {users.map((user, index) => (
        <div
          key={index}
          className="px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#9B2C62] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {user.firstName} {user.lastName}
                {user._id === currentUser?._id && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
                {user.role === "owner" && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Owner
                  </span>
                )}
              </h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* role management */}
            <div>
              {ownerOrAdmin ? (
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  disabled={
                    user._id === currentUser?._id ||
                    (user.role === "owner" && currentUser?.role !== "owner")
                  }
                  className="min-w-[120px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-[#9B2C62] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm hover:border-gray-400"
                >
                  <option value="viewer">Viewer</option>
                  <option value="planner">Planner</option>
                  <option value="admin">Admin</option>
                  {currentUser?.role === "owner" && (
                    <option value="owner">Owner</option>
                  )}
                </select>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800 border border-gray-200">
                  {user.role}
                </span>
              )}
            </div>

            {/* remove user - restricted to admin and/or owner */}
          
              <button
                onClick={() => handleRemoveUser(user._id)}
                disabled={
                  user._id === currentUser?._id || user.role === "owner"
                }
                className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                title={
                  user.role === "owner"
                    ? "Cannot remove organization owner"
                    : user._id === currentUser?._id
                    ? "Cannot remove yourself"
                    : "Remove user"
                }
              >
                Delete
              </button>
        
          </div>
        </div>
      ))}
    </div>
  );
};
