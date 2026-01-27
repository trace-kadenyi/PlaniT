import React from "react";
import {
  ShieldCheck,
  Users,
  Calendar,
  Eye,
  CheckCircle,
  Lock,
  AlertTriangle,
} from "lucide-react";

import { ROLES } from "../../globalHooks/userPermissions";
import {
  getRoleLabels,
  ROLE_PERMISSION_TEXTS,
} from "../../globalHooks/usePermissionHelpers";

export default function RoleSystem() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent dark:via-[#F59E0B]/30"></div>
        <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Role-Based Access Control
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent dark:via-[#F59E0B]/30"></div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl p-6 border border-[#F3EDE9] dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#9B2C62] dark:text-[#D97706]" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                System Rules
              </h3>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 text-[#F59E0B] flex-shrink-0" />
                <div>
                  <span className="font-medium">No self-modification:</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Users cannot change their own role or delete their own
                    account
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Lock className="w-5 h-5 mr-3 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                <div>
                  <span className="font-medium">Hierarchy protection:</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Admins cannot modify Super Admins, Planners cannot modify
                    other users
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Users className="w-5 h-5 mr-3 mt-0.5 text-[#F59E0B] flex-shrink-0" />
                <div>
                  <span className="font-medium">Self-edits allowed:</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Everyone can edit their own basic profile information
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Role Cards */}
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              role: ROLES.SUPER_ADMIN,
              bgColor: "bg-pink-900",
              icon: <ShieldCheck className="w-5 h-5" />,
              permissions: ROLE_PERMISSION_TEXTS[ROLES.SUPER_ADMIN],
            },
            {
              role: ROLES.ADMIN,
              bgColor: "bg-[#F59E0B]",
              icon: <Users className="w-5 h-5" />,
              permissions: ROLE_PERMISSION_TEXTS[ROLES.ADMIN],
            },
            {
              role: ROLES.PLANNER,
              bgColor: "bg-[#D97706]",
              icon: <Calendar className="w-5 h-5" />,
              permissions: ROLE_PERMISSION_TEXTS[ROLES.PLANNER],
            },
            {
              role: ROLES.VIEWER,
              bgColor: "bg-gray-800",
              icon: <Eye className="w-5 h-5" />,
              permissions: ROLE_PERMISSION_TEXTS[ROLES.VIEWER],
            },
          ].map((roleData, index) => (
            <div
              key={index}
              className={`${roleData.bgColor} rounded-xl p-5 text-white transform hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {roleData.icon}
                  <h3 className="text-lg font-bold">
                    {getRoleLabels()[roleData.role]}
                  </h3>
                </div>
              </div>

              <ul className="space-y-2">
                {roleData.permissions.map((perm, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 opacity-80" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
