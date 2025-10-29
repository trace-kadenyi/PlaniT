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

     

      
    </div>
  );
};

export default UserManagement;