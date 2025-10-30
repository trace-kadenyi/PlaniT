import React from "react";

const UserList = ({
  users,
  currentUser,
  editable = false,
  onRoleChange,
  onRemoveUser,
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No team members yet
        </h3>
        <p className="text-gray-500 mb-4">
          {editable
            ? "Add your first team member to get started"
            : "No team members found"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Team Members ({users.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            currentUser={currentUser}
            editable={editable}
            onRoleChange={onRoleChange}
            onRemoveUser={onRemoveUser}
          />
        ))}
      </div>
    </div>
  );
};

const UserListItem = ({
  user,
  currentUser,
  editable,
  onRoleChange,
  onRemoveUser,
}) => (
  <div className="px-6 py-4 flex items-center justify-between">
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
      <RoleSelector
        user={user}
        currentUser={currentUser}
        editable={editable}
        onRoleChange={onRoleChange}
      />

      {editable && (
        <RemoveUserButton
          user={user}
          currentUser={currentUser}
          onRemoveUser={onRemoveUser}
        />
      )}
    </div>
  </div>
);

const RoleSelector = ({ user, currentUser, editable, onRoleChange }) => {
  if (!editable) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800 border border-gray-200">
        {user.role}
      </span>
    );
  }

  return (
    <select
      value={user.role}
      onChange={(e) => onRoleChange(user._id, e.target.value)}
      disabled={
        user._id === currentUser?._id ||
        (user.role === "owner" && currentUser?.role !== "owner")
      }
      className="min-w-[120px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-[#9B2C62] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm hover:border-gray-400"
    >
      <option value="viewer">Viewer</option>
      <option value="planner">Planner</option>
      <option value="admin">Admin</option>
      {currentUser?.role === "owner" && <option value="owner">Owner</option>}
    </select>
  );
};

const RemoveUserButton = ({ user, currentUser, onRemoveUser }) => (
  <button
    onClick={() => onRemoveUser(user._id)}
    disabled={user._id === currentUser?._id || user.role === "owner"}
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
);

export default UserList;
