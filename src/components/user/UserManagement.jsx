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

  
 

  return (
    <div className="max-w-6xl mx-auto p-6">
     
    </div>
  );
};

export default UserManagement;