import { Shield, Briefcase } from "lucide-react";

import { getRoleDescriptions } from "../../../globalHooks/usePermissionHelpers";

export function UserDetailsGrid({
  userData,
  userEvents,
  userTasks,
  isInactive,
}) {
  const roleDescriptions = getRoleDescriptions();

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 transition ${
        isInactive ? "opacity-60 pointer-events-none grayscale" : ""
      }`}
    >
      {/* Role & Permissions Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="bg-gradient-to-br from-[#F59E0B] to-[#FF9933] w-full h-full rounded-bl-full"></div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FF9933]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Role Details & Permissions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 border border-[#F3EDE9] dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Current Permissions
            </h3>
            <ul className="space-y-2 text-sm">
              {roleDescriptions[userData.role]?.map((permission, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      permission.isRestricted ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span
                    className={
                      permission.isRestricted
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-700 dark:text-gray-300"
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

      {/* Assigned Events Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="bg-gradient-to-br from-[#9B2C62] to-[#801f4f] w-full h-full rounded-bl-full"></div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#9B2C62] to-[#801f4f]">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Associated Events & Tasks
          </h2>
        </div>

        {userEvents.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Events
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white">
                {userEvents.length}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {userTasks.length}
                {userTasks.length > 1
                  ? " individual tasks"
                  : " individual task"}
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#9B2C62] to-[#F59E0B] dark:from-pink-900 dark:to-[#D97706]"
                    style={{
                      width: `${Math.min(userEvents.length * 20, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {userEvents.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg border border-[#F3EDE9] dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="font-medium text-gray-800 dark:text-white cursor-pointer"
                      >
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-[#D97706] dark:bg-[#9B2C62] text-white dark:text-white px-2 py-1 rounded">
                          {event.taskCount} task
                          {event.taskCount !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          •
                          {
                            event.tasks.filter((t) => t.status === "Completed")
                              .length
                          }{" "}
                          completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {userEvents.length > 5 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                  + {userEvents.length - 5} more events
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
            <div className="mx-auto max-w-sm flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                No events assigned
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                This user is not currently assigned to any tasks or events
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
