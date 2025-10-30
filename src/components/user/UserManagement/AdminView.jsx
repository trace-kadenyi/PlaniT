import React from "react";

import UserList from "./UserList";

const AdminView = ({
  users,
  currentUser,
  onAddUser,
  onRoleChange,
  onRemoveUser,
}) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Manage your organization members and their permissions
          </p>
        </div>
        <button
          onClick={onAddUser}
          className="bg-[#9B2C62] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#7A2250] transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Add Team Member
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">
          Team Management Guide
        </h3>
        <p className="text-sm text-blue-700">
          As an {currentUser.role === "super_admin" ? "super_admin" : "admin"},
          you can add new members, adjust roles, and manage team permissions.
        </p>
      </div>
    </div>

    <UserList
      users={users}
      currentUser={currentUser}
      editable={true}
      onRoleChange={onRoleChange}
      onRemoveUser={onRemoveUser}
    />
  </div>
);

export default AdminView;
