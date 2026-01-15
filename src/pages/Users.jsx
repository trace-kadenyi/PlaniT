import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchUsers,
  updateUserRole,
  deleteUser,
  addUser,
} from "../redux/usersSlice";
import { fetchOrganizationDetails } from "../redux/organizationSlice";

import UserList from "../components/user/UserManagement/UserList";
import AddUserForm from "../components/user/forms/AddUserForm";
import { AddNewMembersBtn } from "../components/buttons/UserButtons";
import toast from "react-hot-toast";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { createUserDeleteHandler } from "../globalHandlers/createUserDeleteHandler";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { GenErrorState } from "../components/shared/ErrorStates";
import { GenLoadingState } from "../components/shared/LoadingStates";
import { useToastLock } from "../globalUtils/useToastLock";

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastLock = useToastLock();

  const {
    items: users,
    status,
    error,
    addStatus,
  } = useSelector((state) => state.users);
  const { organization } = useSelector((state) => state.organization);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "viewer",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrganizationDetails());
  }, [dispatch]);

  // Handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      setShowAddForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "viewer",
        password: "",
      });
      toastWithProgress("User added successfully");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  // handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      dispatch(fetchUsers());
      toastWithProgress("User role updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  // handle remove user
  const handleRemoveUser = (userId) => {
    return createUserDeleteHandler(
      dispatch,
      userId,
      navigate,
      deleteUser,
      toast,
      toastWithProgress,
      DeleteConfirmationToast,
      toastLock
    )();
  };

  // loading state
  if (status === "loading")
    return <GenLoadingState message="Loading team members..." />;

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
      {/* add user form */}
      <AddUserForm
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        handleAddUser={handleAddUser}
        formData={formData}
        setFormData={setFormData}
        addUserStatus={addStatus}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-12 sm:text-center lg:text-start sm:mt-2">
              {organization?.name} Team Directory
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your organization's team members and permissions
            </p>
          </div>
          <AddNewMembersBtn onAddUser={() => setShowAddForm(true)} />
        </div>

        {/* Error State */}
        {status === "failed" && (
          <GenErrorState
            error={error}
            message="We ran into an issue accessing your team members. Please try again later..."
          />
        )}

        {/* Users List */}
        {status === "succeeded" && (
          <>
            {users.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] text-center dark:bg-gray-800/80 dark:border-gray-700">
                <div className="mx-auto max-w-md flex flex-col items-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-[#9B2C62] dark:text-[#D97706]">
                    No team members yet
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    Add your first team member to get started
                  </p>
                  <div className="mt-6">
                    <AddNewMembersBtn onAddUser={() => setShowAddForm(true)} />
                  </div>
                </div>
              </div>
            ) : (
              <UserList
                users={users}
                editable={true}
                onRoleChange={handleRoleChange}
                onRemoveUser={handleRemoveUser}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
