import React from "react";
import {
  Users,
  CreditCard,
  History,
  CheckCircle,
  Lock,
  Key,
} from "lucide-react";

import auditLogDark from "../../assets/auditlogdark.png";

export default function AuditSystem() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent dark:via-[#F59E0B]/30"></div>
        <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Audit & Security System
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent dark:via-[#F59E0B]/30"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  items-center">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl p-6 border border-[#F3EDE9] dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-[#DC2626]" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Expense Audit Logs
              </h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                All expense operations (except creation) are logged
              </li>
              <li className="flex items-start">
                <Lock className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Paid expense deletion restricted to Super Admins
              </li>
              <li className="flex items-start">
                <History className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Complete audit trail with timestamps and user info
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl p-6 border border-[#F3EDE9] dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-[#059669]" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                User Update History
              </h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                All profile changes are tracked for transparency
              </li>
              <li className="flex items-start">
                <Key className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Password resets logged to prevent credential misuse
              </li>
              <li className="flex items-start">
                <Users className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Role changes recorded with admin attribution
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="bg-gradient-to-br from-white/80 to-white/60 
                dark:from-gray-800/80 dark:to-gray-900/80
                rounded-xl p-2 border border-[#F3EDE9] dark:border-gray-700/50
               flex items-center justify-center"
          >
            <img
              src={auditLogDark}
              alt="expense audit log image"
              className="rounded-lg max-h-[420px] w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
