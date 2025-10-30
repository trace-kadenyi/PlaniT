import React from "react";

import UserList from "./UserList";

const MemberView = ({ users, currentUser }) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Directory</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            View your team members and their roles within the organization
          </p>
        </div>
      </div>
    </div>

    <UserList users={users} currentUser={currentUser} editable={false} />
  </div>
);

export default MemberView;
