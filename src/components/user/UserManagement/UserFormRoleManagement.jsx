import { Shield } from "lucide-react";

export default function UserFormRoleManagement({
  isSelf,
  shouldDisableRole,
  register,
  updateRoleStatus,
  availableRoles,
  roleLabels,
  selectedRole,
  roleDescriptions,
}) {
  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
          Role & Permissions
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {isSelf ? "(You cannot change your own role)" : ""}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          User Role
        </label>

        {shouldDisableRole ? (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400">
              {isSelf
                ? "You cannot change your own role. Contact another administrator if you need to change your permissions."
                : "You don't have permission to change this user's role."}
            </div>
          </div>
        ) : (
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
            disabled={updateRoleStatus === "loading"}
          >
            <option value="">Select a role</option>
            {availableRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        )}

        {/* Role Permissions Preview */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 border border-[#F59E0B]/20 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {roleLabels[selectedRole]} Permissions
          </h3>
          <ul className="space-y-2">
            {roleDescriptions[selectedRole]?.map((permission, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    permission.isRestricted ? "bg-red-500" : "bg-[#F59E0B]"
                  } mt-1.5`}
                ></div>
                <span
                  className={
                    permission.isRestricted
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400"
                  }
                >
                  {permission.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
