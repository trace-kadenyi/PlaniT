import React from "react";

import UserList from "./UserList";

const MemberView = ({ users, currentUser, orgName }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-12 text-center sm:text-start sm:mt-2">
            {orgName} Team Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-center sm:text-start">
            View your team members and their roles within the organization
          </p>
        </div>
      </div>
    </div>

    <UserList users={users} currentUser={currentUser} editable={false} />
  </div>
);

export default MemberView;
