import React from "react";

import UserList from "./UserList";
import { Plus } from "lucide-react";
import { AddNewMembersBtn } from "../../buttons/UserButtons";

const AdminView = ({
  users,
  currentUser,
  onAddUser,
  onRoleChange,
  onRemoveUser,
  orgName,
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-12 text-start sm:mt-2">
            {orgName} Team Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-lg">
            Manage your organization members and their permissions
          </p>
        </div>
        <AddNewMembersBtn onAddUser={onAddUser} />
      </div>

      <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg border border-gray-100  dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-r dark:border-gray-900/10 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
        <h3 className="text-sm font-semibold mb-1 dark:text-gray-300">
          Team Management Guide
        </h3>
        <p className="text-sm dark:text-gray-400">
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
