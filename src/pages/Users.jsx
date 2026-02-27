import { useState, useEffect, useRef } from "react";
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
import {
  fetchOrganizationDetails,
  updateOrganizationName,
} from "../redux/organizationSlice";

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
import { ROLES } from "../globalHooks/userPermissions";
import NoUsers from "../components/shared/NoUsers";
import UsersFilter from "../components/user/UserManagement/UsersFilter";
import { useUserFilters } from "../globalHooks/useUserMemoizedData";
import { createOrgNameUpdateHandler } from "../globalHandlers/createOrgNameUpdateHandler";
import {
  EditOrgNameBtn,
  SaveOrgNameBtn,
  CancelOrgNameBtn,
} from "../components/buttons/OrganizationButtons";
import OrgNameUpdateConfirmationToast from "../globalUtils/OrgNameUpdateConfirmationToast";

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastLock = useToastLock();
  const isAddFormOpen = useRef(false);

  const {
    items: users,
    status,
    error,
    addStatus,
  } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);

  const { organization, updateStatus } = useSelector(
    (state) => state.organization,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditingOrgName, setIsEditingOrgName] = useState(false);
  const [orgNameInput, setOrgNameInput] = useState("");

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
  const { filteredUsers, activeCount, inactiveCount } = useUserFilters(
    users,
    statusFilter,
    currentUser?.role,
  );

  // Handle add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      setShowAddForm(false);
      isAddFormOpen.current = false;
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

  // Custom function to handle showing the form
  const handleShowAddForm = () => {
    setShowAddForm(true);
    isAddFormOpen.current = true; // Set ref when form opens
  };

  // Custom function to handle hiding the form
  const handleHideAddForm = () => {
    setShowAddForm(false);
    isAddFormOpen.current = false; // Clear ref when form closes
  };

  // handle role change
  const handleRoleChange = async (userId, newRole) => {
    // CRITICAL: Don't allow role changes when add form is open
    if (isAddFormOpen.current) {
      return;
    }

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

  const handleEditOrgName = () => {
    setOrgNameInput(organization?.name || "");
    setIsEditingOrgName(true);
  };

  const handleCancelOrgName = () => {
    setIsEditingOrgName(false);
    setOrgNameInput("");
  };
  // handle org update
  const handleSaveOrgName = createOrgNameUpdateHandler(
    dispatch,
    orgNameInput.trim(),
    organization?.name,
    updateOrganizationName,
    toast,
    toastWithProgress,
    OrgNameUpdateConfirmationToast,
    toastLock,
  );

  // loading state
  if (status === "loading")
    return <GenLoadingState message="Loading team members..." />;

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
      {/* add user form */}
      <AddUserForm
        showAddForm={showAddForm}
        setShowAddForm={handleHideAddForm}
        handleAddUser={handleAddUser}
        formData={formData}
        setFormData={setFormData}
        addUserStatus={addStatus}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            {isEditingOrgName ? (
              <div className="flex items-center gap-2 mt-12 sm:mt-2">
                <input
                  type="text"
                  value={orgNameInput}
                  onChange={(e) => setOrgNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") handleCancelOrgName();
                  }}
                  autoFocus
                  className="text-2xl font-bold bg-transparent border-b-2 border-[#9B2C62] dark:border-[#D97706] text-[#9B2C62] dark:text-[#D97706] focus:outline-none"
                />
                <SaveOrgNameBtn
                  onSave={() => {
                    if (!orgNameInput.trim()) return;
                    if (orgNameInput.trim() === organization?.name) {
                      setIsEditingOrgName(false);
                      return;
                    }
                    handleSaveOrgName();
                    setIsEditingOrgName(false);
                  }}
                  updateStatus={updateStatus}
                />
                <CancelOrgNameBtn onCancel={handleCancelOrgName} />
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-12 sm:mt-2">
                <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] sm:text-center lg:text-start">
                  {organization?.name} Team Directory
                </h1>
                <EditOrgNameBtn onEdit={handleEditOrgName} />
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your organization's team members and permissions
            </p>
          </div>
          <AddNewMembersBtn onAddUser={handleShowAddForm} />
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
              <NoUsers
                message="No team members yet"
                submessage="Add your first team member to get started"
                cta={<AddNewMembersBtn onAddUser={handleShowAddForm} />}
              />
            ) : (
              <>
                {/* Status Filter - Only show for Admin and Super Admin */}
                {(currentUser?.role === ROLES.ADMIN ||
                  currentUser?.role === ROLES.SUPER_ADMIN) && (
                  <UsersFilter
                    setStatusFilter={setStatusFilter}
                    statusFilter={statusFilter}
                    users={users}
                    activeCount={activeCount}
                    inactiveCount={inactiveCount}
                  />
                )}

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
                  <NoUsers
                    message={`No ${statusFilter === "active" ? "active" : "inactive"} users found`}
                    submessage={
                      statusFilter === "active"
                        ? "All users are currently inactive or deactivated"
                        : "All users are currently active"
                    }
                    cta={
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="inline-flex items-center px-4 py-2 bg-[#9B2C62] dark:bg-[#D97706] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                      >
                        View all users
                      </button>
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
