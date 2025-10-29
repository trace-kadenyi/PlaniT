// components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrganizationUsers,
  addOrganizationUser,
  removeOrganizationUser,
  updateUserRole,
  resetOrganizationStatus,
} from "../../redux/organizationSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, status, addUserStatus, removeUserStatus, updateRoleStatus } = useSelector(
    (state) => state.organization
  );
  const currentUser = useSelector((state) => state.auth.user);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organizationRole: "planner",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchOrganizationUsers());
  }, [dispatch]);

  // Reset status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetOrganizationStatus());
    };
  }, [dispatch]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addOrganizationUser(formData)).unwrap();
      setShowAddForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        organizationRole: "planner",
        password: "",
      });
      // Refresh the user list
      dispatch(fetchOrganizationUsers());
    } catch (error) {
      // Error is handled by the slice
      console.error("Failed to add user:", error);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user from the organization?")) {
      try {
        await dispatch(removeOrganizationUser(userId)).unwrap();
        dispatch(fetchOrganizationUsers());
      } catch (error) {
        console.error("Failed to remove user:", error);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, organizationRole: newRole })).unwrap();
      dispatch(fetchOrganizationUsers());
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B2C62]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your organization members and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#9B2C62] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#7A2250] transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Add Team Member
        </button>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Team Member</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.organizationRole}
                  onChange={(e) => setFormData({ ...formData, organizationRole: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent"
                >
                  <option value="viewer">Viewer</option>
                  <option value="planner">Planner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-xs text-[#9B2C62] hover:text-[#7A2250] font-medium"
                  >
                    Generate Secure Password
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent font-mono text-sm"
                  placeholder="Enter a secure password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  User will need this password to login
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUserStatus === "loading"}
                  className="bg-[#9B2C62] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7A2250] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addUserStatus === "loading" ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Team Members ({users.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#9B2C62] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
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
                    {user.organizationRole === "owner" && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        Owner
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={user.organizationRole}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  disabled={
                    user._id === currentUser?._id || 
                    (user.organizationRole === "owner" && currentUser?.organizationRole !== "owner")
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B2C62] disabled:opacity-50"
                >
                  <option value="viewer">Viewer</option>
                  <option value="planner">Planner</option>
                  <option value="admin">Admin</option>
                  {currentUser?.organizationRole === "owner" && (
                    <option value="owner">Owner</option>
                  )}
                </select>

                <button
                  onClick={() => handleRemoveUser(user._id)}
                  disabled={
                    user._id === currentUser?._id ||
                    user.organizationRole === "owner"
                  }
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                  title={
                    user.organizationRole === "owner" 
                      ? "Cannot remove organization owner"
                      : user._id === currentUser?._id
                      ? "Cannot remove yourself"
                      : "Remove user"
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-4">Add your first team member to get started</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#9B2C62] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7A2250]"
            >
              Add Team Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;