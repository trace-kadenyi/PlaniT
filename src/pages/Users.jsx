import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchOrganizationUsers,
  addOrganizationUser,
  removeOrganizationUser,
  updateUserRole,
  resetOrganizationStatus,
} from "../redux/organizationSlice";

import AddUser from "../components/user/forms/AddUser";
import AdminView from "../components/user/UserManagement/AdminView";
import MemberView from "../components/user/UserManagement/MemberView";

const Users = () => {
  const dispatch = useDispatch();
  const { users, status, addUserStatus } = useSelector(
    (state) => state.organization
  );
  const currentUser = useSelector((state) => state.auth.user);
  const superAdminOrAdmin =
    currentUser.role === "admin" || currentUser.role === "super_admin";

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "planner",
    password: "",
  });

  // fetch org users
  useEffect(() => {
    dispatch(fetchOrganizationUsers());
  }, [dispatch]);

  // reset org status
  useEffect(() => {
    return () => {
      dispatch(resetOrganizationStatus());
    };
  }, [dispatch]);

  // handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addOrganizationUser(formData)).unwrap();
      setShowAddForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "planner",
        password: "",
      });
      dispatch(fetchOrganizationUsers());
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  // handle remove user
  const handleRemoveUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this user from the organization?"
      )
    ) {
      try {
        await dispatch(removeOrganizationUser(userId)).unwrap();
        dispatch(fetchOrganizationUsers());
      } catch (error) {
        console.error("Failed to remove user:", error);
      }
    }
  };

  // handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      dispatch(fetchOrganizationUsers());
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  // loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B2C62]"></div>
      </div>
    );
  }

  return (
    <>
      <AddUser
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        handleAddUser={handleAddUser}
        formData={formData}
        setFormData={setFormData}
        addUserStatus={addUserStatus}
      />

      {superAdminOrAdmin ? (
        <AdminView
          users={users}
          currentUser={currentUser}
          onAddUser={() => setShowAddForm(true)}
          onRoleChange={handleRoleChange}
          onRemoveUser={handleRemoveUser}
        />
      ) : (
        <MemberView users={users} currentUser={currentUser} />
      )}
    </>
  );
};

export default Users;
