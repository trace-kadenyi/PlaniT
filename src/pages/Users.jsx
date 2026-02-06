import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchUsers,
  updateUserRole,
  deleteUser,
  addUser,
  reactivateUser,
} from "../redux/usersSlice";
import { fetchOrganizationDetails } from "../redux/organizationSlice";

import UserList from "../components/user/UserManagement/UserList";
import AddUserForm from "../components/user/forms/AddUserForm";
import { AddNewMembersBtn } from "../components/buttons/UserButtons";
import { createUserDeactivateHandler } from "../globalHandlers/createUserDeactivateHandler";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { GenErrorState } from "../components/shared/ErrorStates";
import { GenLoadingState } from "../components/shared/LoadingStates";
import { useToastLock } from "../globalUtils/useToastLock";
import { createUserReactivateHandler } from "../globalHandlers/createUserReactivateHandler";
import UserDeactivateConfirmationToast from "../globalUtils/userDeactivateConfirmationToast";
import UserReactivateConfirmationToast from "../globalUtils/userReactivateConfirmationToast";

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
  const [statusFilter, setStatusFilter] = useState("all");
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

  // Filter users based on status
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    if (statusFilter === "all") return users;
    if (statusFilter === "active")
      return users.filter((user) => !user.isDeactivated);
    if (statusFilter === "inactive")
      return users.filter((user) => user.isDeactivated);
    return users;
  }, [users, statusFilter]);

  // Calculate counts
  const activeCount = useMemo(
    () => users?.filter((user) => !user.isDeactivated).length || 0,
    [users],
  );
  const inactiveCount = useMemo(
    () => users?.filter((user) => user.isDeactivated).length || 0,
    [users],
  );

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
      toastWithProgress("User role updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  // handle deactivate user
  const handleRemoveUser = (userId) => {
    return createUserDeactivateHandler(
      dispatch,
      userId,
      navigate,
      deleteUser,
      toast,
      toastWithProgress,
      UserDeactivateConfirmationToast,
      toastLock,
    )();
  };

  // handle reactivate user
  const handleReactivateUser = (userId) => {
    return createUserReactivateHandler(
      dispatch,
      userId,
      navigate,
      reactivateUser,
      toast,
      toastWithProgress,
      UserReactivateConfirmationToast,
      toastLock,
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
              <>
                {/* Status Filter */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filter by status:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setStatusFilter("all")}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          statusFilter === "all"
                            ? "bg-[#9B2C62] dark:bg-[#D97706] text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span>All Users</span>
                        <span
                          className={`px-1.5 py-0.5 text-xs rounded-full ${
                            statusFilter === "all"
                              ? "bg-white/20"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {users.length}
                        </span>
                      </button>
                      <button
                        onClick={() => setStatusFilter("active")}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          statusFilter === "active"
                            ? "bg-[#9B2C62] dark:bg-[#D97706] text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Active</span>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 text-xs rounded-full ${
                            statusFilter === "active"
                              ? "bg-white/20"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {activeCount}
                        </span>
                      </button>
                      <button
                        onClick={() => setStatusFilter("inactive")}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          statusFilter === "inactive"
                            ? "bg-[#9B2C62] dark:bg-[#D97706] text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span>Inactive</span>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 text-xs rounded-full ${
                            statusFilter === "inactive"
                              ? "bg-white/20"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {inactiveCount}
                        </span>
                      </button>
                    </div>

                    {/* Reset filter button (shown when filter is active) */}
                    {statusFilter !== "all" && (
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="text-sm text-[#9B2C62] dark:text-[#D97706] hover:underline ml-2"
                      >
                        Reset filter
                      </button>
                    )}
                  </div>
                </div>

                {/* User List with filtered users */}
                {filteredUsers.length > 0 ? (
                  <UserList
                    users={filteredUsers}
                    editable={true}
                    onRoleChange={handleRoleChange}
                    onRemoveUser={handleRemoveUser}
                    onReactivateUser={handleReactivateUser}
                  />
                ) : (
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
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
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                      No {statusFilter === "active" ? "active" : "inactive"}{" "}
                      users found
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 mb-4">
                      {statusFilter === "active"
                        ? "All users are currently inactive or deactivated"
                        : "All users are currently active"}
                    </p>
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="inline-flex items-center px-4 py-2 bg-[#9B2C62] dark:bg-[#D97706] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      View all users
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
