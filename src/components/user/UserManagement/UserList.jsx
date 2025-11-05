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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto  dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-r dark:border-gray-900/10 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
      <div className="px-6 py-4 border-b border-gray-200  dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Team Members ({users.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200  dark:divide-gray-800">
        {users
          .filter((user) => user && user._id)
          .sort((a, b) => {
            if (a._id === currentUser?._id) return -1;
            if (b._id === currentUser?._id) return 1;
            return 0;
          })
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
    <div className="px-6 py-4 flex flex-col gap-3 sm:items-center justify-between sm:flex-row">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#9B2C62] rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-300">
            {user.firstName} {user.lastName}
            {user._id === currentUser?._id && (
              <span className="ml-2 text-xs bg-[#F59E0B] text-white px-2 py-1 rounded-full">
                You
              </span>
            )}
          </h3>
          <p className="text-gray-600 dark:text-gray-400/80 text-sm">
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-10 flex-wrap sm:flex-nowrap gap-2 sm:ml-0">
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
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900 dark:border-gray-800  dark:text-gray-300">
    {user.role === "super_admin" ? "Super Admin" : user.role}
  </span>
);

const RoleSelector = ({ user, currentUser, onRoleChange }) => (
  <select
    value={user.role}
    onChange={(e) => onRoleChange(user._id, e.target.value)}
    className="min-w-[120px] border border-[#9B2C62]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-[#9B2C62] transition-all duration-200 bg-white shadow-sm hover:border-[#9B2C62]/40 text-gray-700 dark:bg-black dark:border-gray-900 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] dark:text-gray-300"
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
        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 text-xs font-semibold dark:border-red-400 dark:hover:border-red-500 dark:hover-text-red-700"
        title={getTooltipText()}
      >
        Remove
      </button>
    );
  }

  return (
    <button
      disabled
      className="text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 cursor-not-allowed text-xs font-medium dark:bg-gray-700 dark:text-gray-300 dark:border-transparent"
      title={getTooltipText()}
    >
      {getButtonText()}
    </button>
  );
};

export default UserList;
