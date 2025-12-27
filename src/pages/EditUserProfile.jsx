// pages/EditUserProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Shield,
  Mail,
  Phone,
  AlertCircle
} from "lucide-react";
import { usePermissions, PERMISSIONS, RESOURCES, ROLES } from "../globalHooks/userPermissions";
import PermissionButton from "../components/buttons/PermissionButton";
import { fetchUserDetails, updateUserRole } from "../redux/organizationSlice";
import toast from "react-hot-toast";

export default function EditUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { can, currentUser } = usePermissions();
  const { 
    userDetails, 
    userDetailsStatus,
    updateRoleStatus
  } = useSelector((state) => state.organization);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userDetails) {
      setValue("firstName", userDetails.firstName);
      setValue("lastName", userDetails.lastName);
      setValue("email", userDetails.email);
      setValue("phone", userDetails.contact?.phone || "");
      setValue("role", userDetails.role);
    }
  }, [userDetails, setValue]);

  const onSubmit = async (data) => {
    if (!can(PERMISSIONS.EDIT, RESOURCES.USER, userDetails)) {
      toast.error("You don't have permission to edit this user");
      return;
    }

    setIsSaving(true);
    try {
      // Update basic info
      if (data.role !== userDetails.role) {
        await dispatch(updateUserRole({ userId, role: data.role })).unwrap();
        toast.success("User role updated successfully");
      }

      // You'll need to add an endpoint for updating user details
      // const updateResponse = await dispatch(updateUserDetails({ userId, ...data })).unwrap();
      
      toast.success("User updated successfully");
      navigate(`/users/${userId}`);
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  if (userDetailsStatus === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#D97706]"></div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-[#E3CBC1] dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The user you're trying to edit doesn't exist.
            </p>
            <Link
              to="/users"
              className="inline-flex items-center gap-2 bg-[#9B2C62] hover:bg-[#801f4f] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSelf = userDetails._id === currentUser?._id;
  const canEditRole = can(PERMISSIONS.EDIT, RESOURCES.USER, userDetails);

  const availableRoles = [
    { value: ROLES.VIEWER, label: "Viewer" },
    { value: ROLES.PLANNER, label: "Planner" },
    { value: ROLES.ADMIN, label: "Admin" },
  ];

  if (currentUser?.role === ROLES.SUPER_ADMIN) {
    availableRoles.push({ value: ROLES.SUPER_ADMIN, label: "Super Admin" });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-6">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          to={`/users/${userId}`}
          className="inline-flex items-center gap-2 text-[#9B2C62] dark:text-[#D97706] hover:text-[#801f4f] dark:hover:text-[#F59E0B] font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userDetails.firstName[0]}{userDetails.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit {userDetails.firstName} {userDetails.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Update user details and permissions
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register("firstName", { 
                    required: "First name is required",
                    maxLength: {
                      value: 50,
                      message: "First name must be 50 characters or fewer"
                    }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register("lastName", { 
                    required: "Last name is required",
                    maxLength: {
                      value: 50,
                      message: "Last name must be 50 characters or fewer"
                    }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Please enter a valid email"
                    }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Role Section */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
              Role & Permissions
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Role
              </label>
              {isSelf ? (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="text-gray-600 dark:text-gray-400">
                    You cannot change your own role. Contact another administrator if you need to change your permissions.
                  </div>
                </div>
              ) : !canEditRole ? (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="text-gray-600 dark:text-gray-400">
                    You don't have permission to change this user's role.
                  </div>
                </div>
              ) : (
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
                  disabled={updateRoleStatus === "loading"}
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              )}
              
              <div className="mt-4 p-4 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50 border border-[#F59E0B]/20 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Role Permissions</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <strong>Super Admin:</strong> Full organization access including managing other super admins</li>
                  <li>• <strong>Admin:</strong> Can manage users, events, vendors, and all content</li>
                  <li>• <strong>Planner:</strong> Can create and edit events, vendors, and assigned tasks</li>
                  <li>• <strong>Viewer:</strong> Can view content but cannot create or edit anything</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              to={`/users/${userId}`}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors duration-200"
            >
              Cancel
            </Link>
            
            <PermissionButton
              permission={PERMISSIONS.EDIT}
              resource={RESOURCES.USER}
              target={userDetails}
              type="submit"
              loading={isSaving || updateRoleStatus === "loading"}
              disabled={isSaving || updateRoleStatus === "loading"}
              tooltipTitle="Save changes"
              fallbackTooltip="Cannot edit this user"
              className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              {isSaving || updateRoleStatus === "loading" ? "Saving..." : "Save Changes"}
            </PermissionButton>
          </div>
        </form>
      </div>
    </div>
  );
}