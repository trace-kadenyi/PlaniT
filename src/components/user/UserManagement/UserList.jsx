import React from "react";

const UserList = ({
  users,
  currentUser,
  editable = false,
  onRoleChange,
  onRemoveUser,
}) => {
  const superAdminOrAdmin =
    currentUser?.role === "admin" || currentUser?.role === "super_admin";

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
        {users
          .filter((user) => user && user._id)
          .map((user) => (
            <UserListItem
              key={user._id.toString()}
              user={user}
              currentUser={currentUser}
              editable={editable}
              superAdminOrAdmin={superAdminOrAdmin}
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
  superAdminOrAdmin,
  onRoleChange,
  onRemoveUser,
}) => {
  const canEditRole = () => {
    if (user._id === currentUser?._id) return false;
    if (currentUser?.role === "super_admin") return true;
    if (currentUser?.role === "admin") {
      return user.role === "viewer" || user.role === "planner";
    }
    return false;
  };

  const canRemoveUser = () => {
    if (user._id === currentUser?._id) return false;
    if (currentUser?.role === "super_admin") return true;
    if (currentUser?.role === "admin") {
      return user.role === "viewer" || user.role === "planner";
    }
    return false;
  };

  const showRoleSelector = editable && canEditRole();
  const showDeleteButton = editable;

  return (
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
            {user.role === "super_admin" && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Super Admin
              </span>
            )}
            {user.role === "admin" && user._id !== currentUser?._id && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Admin
              </span>
            )}
          </h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Display/Selector */}
        {showRoleSelector ? (
          <RoleSelector
            user={user}
            currentUser={currentUser}
            onRoleChange={onRoleChange}
          />
        ) : (
          <RoleDisplay user={user} />
        )}

        {/* Delete Button */}
        {showDeleteButton && (
          <RemoveUserButton
            user={user}
            currentUser={currentUser}
            canRemove={canRemoveUser()}
            onRemoveUser={onRemoveUser}
          />
        )}
      </div>
    </div>
  );
};

const RoleDisplay = ({ user }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800 border border-gray-200">
    {user.role === "super_admin" ? "Super Admin" : user.role}
  </span>
);

const RoleSelector = ({ user, currentUser, onRoleChange }) => (
  <select
    value={user.role}
    onChange={(e) => onRoleChange(user._id, e.target.value)}
    className="min-w-[120px] border border-[#9B2C62]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-[#9B2C62] transition-all duration-200 bg-white shadow-sm hover:border-[#9B2C62]/40 text-gray-700"
  >
    <option value="viewer">Viewer</option>
    <option value="planner">Planner</option>
    <option value="admin">Admin</option>
    {currentUser?.role === "super_admin" && (
      <option value="super_admin">Super Admin</option>
    )}
  </select>
);

const RemoveUserButton = ({ user, currentUser, canRemove, onRemoveUser }) => {
  const getButtonText = () => {
    if (user._id === currentUser?._id) return "Your Account";
    if (user.role === "super_admin") return "Super Admin";
    if (user.role === "admin") return "Admin User";
    return "Remove";
  };

  const getTooltipText = () => {
    if (user._id === currentUser?._id) return "Cannot remove your own account";
    if (user.role === "super_admin") return "Super admins cannot be removed";
    if (user.role === "admin")
      return "Admin users cannot be removed by other admins";
    return "Remove this user from the organization";
  };

  if (canRemove) {
    return (
      <button
        onClick={() => onRemoveUser(user._id)}
        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 text-xs font-semibold"
        title={getTooltipText()}
      >
        Remove
      </button>
    );
  }

  return (
    <button
      disabled
      className="text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 cursor-not-allowed text-xs font-medium"
      title={getTooltipText()}
    >
      {getButtonText()}
    </button>
  );
};

export default UserList;
