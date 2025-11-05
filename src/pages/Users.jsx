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

      {/* Error Message */}
      {error && (
        <div className="error-message bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200 p-4 mb-6 rounded flex items-start">
          <div className="mr-3 mt-0.5 flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500 dark:text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p>{error}</p>
          </div>
        </div>
      )}
      {/* Empty State */}
      {status === "succeeded" && users.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-gray-900/30 p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            No team members yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {superAdminOrAdmin
              ? "Add your first team member to get started"
              : "No team members found"}
          </p>
          {superAdminOrAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#F59E0B] hover:bg-[#D97706] dark:bg-amber-600 dark:hover:bg-[#F59E0B] text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add Your First Team Member
            </button>
          )}
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
