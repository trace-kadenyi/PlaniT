import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
import { createUserDeleteHandler } from "../globalHandlers/createUserDeleteHandler";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, status, error, addUserStatus } = useSelector(
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
  const handleRemoveUser = (userId) => {
    return createUserDeleteHandler(
      dispatch,
      userId, // Pass the userId here
      navigate,
      removeOrganizationUser,
      toast,
      toastWithProgress,
      DeleteConfirmationToast
    )();
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

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
      <AddUser
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        handleAddUser={handleAddUser}
        formData={formData}
        setFormData={setFormData}
        addUserStatus={addUserStatus}
      />

      {/* Status Messages */}
      {status === "loading" && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#F59E0B]"></div>
        </div>
      )}

      
      
      {status === "succeeded" && users.length > 0 && (
        <>
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
      )}
    </main>
  );
};

export default Users;
