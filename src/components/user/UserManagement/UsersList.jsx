// components/UserManagement/UserList.jsx
import React from "react";

const UserList = ({ 
  users, 
  currentUser, 
  editable = false, 
  onRoleChange, 
  onRemoveUser 
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
          {editable ? "Add your first team member to get started" : "No team members found"}
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






export default UserList;