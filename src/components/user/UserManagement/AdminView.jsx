import React from "react";

import UserList from "./UserList";

const AdminView = ({
  users,
  currentUser,
  onAddUser,
  onRoleChange,
  onRemoveUser,
}) => (
  <div className="max-w-7xl mx-auto">
    <div className="mb-8">
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-12 text-start sm:mt-2">
            Team Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-lg">
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

      <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-sm font-semibold mb-1">Team Management Guide</h3>
        <p className="text-sm">
          As {currentUser.role === "super_admin" ? "Super Admin" : "Admin"}, you
          can add or remove members and adjust roles to manage team permissions.
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
