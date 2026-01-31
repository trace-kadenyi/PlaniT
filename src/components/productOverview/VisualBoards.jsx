import React from "react";
import {
  KanbanSquare,
  CheckCircle,
  FolderKanban,
  Calendar,
  CheckSquare,
} from "lucide-react";

import eventsBoard from "../../assets/eventsboard.png";
import tasksBoard from "../../assets/tasksboard.png";

export default function VisualBoards() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent dark:via-[#F59E0B]/30"></div>
        <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Visual Dashboards
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent dark:via-[#F59E0B]/30"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <FolderKanban className="w-6 h-6 text-[#9B2C62] dark:text-[#D97706]" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Events Dashboard
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive event management with financial tracking, status
            monitoring, and role-based controls for complete planning oversight.
          </p>
          <div className="bg-gradient-to-br from-[#9B2C62]/5 to-[#7B1E5A]/5 dark:from-[#9B2C62]/10 dark:to-[#7B1E5A]/20 rounded-xl p-4 border border-[#9B2C62]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#9B2C62] dark:text-[#D97706]">
                Key Features:
              </span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Drag-and-drop events between columns (Planning, In Progress,
                Completed, Cancelled)
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Budget tracking with spent and remaining amount details
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Role-based event management and permissions
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                Detailed event cards
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <KanbanSquare className="w-6 h-6 text-[#D97706] dark:text-[#F59E0B]" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Tasks Dashboard
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all tasks through an interactive Kanban board. View task
            details, track progress, and update status with drag-and-drop
            functionality.
          </p>
          <div className="bg-gradient-to-br from-[#F59E0B]/5 to-[#F97316]/5 dark:from-[#F59E0B]/10 dark:to-[#F97316]/10 rounded-xl p-4 border border-[#F59E0B]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#D97706] dark:text-[#F59E0B]">
                Key Features:
              </span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0" />
                Drag-and-drop task movement between columns (To Do, In Progress,
                In Review, Completed)
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0" />
                Real-time status updates with role-based permissions
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0" />
                Detailed task cards with assignments and deadlines
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0" />
                Visual progress tracking with color-coded statuses
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// visuals
export function InterfaceVisuals() {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
            Events Manager Interface
          </h3>
          <div
            className="bg-gradient-to-br from-white/80 to-white/60 
                         dark:from-gray-800/80 dark:to-gray-900/80
                         rounded-xl p-2 border border-[#F3EDE9] dark:border-gray-700/50
                        flex items-center justify-center"
          >
            <img
              src={eventsBoard}
              alt="expense audit log image"
              className="rounded-lg max-h-[420px] w-full object-contain"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24]" />
            Tasks Manager Interface
          </h3>
          <div
            className="bg-gradient-to-br from-white/80 to-white/60 
                         dark:from-gray-800/80 dark:to-gray-900/80
                         rounded-xl p-2 border border-[#F3EDE9] dark:border-gray-700/50
                        flex items-center justify-center"
          >
            <img
              src={tasksBoard}
              alt="expense audit log image"
              className="rounded-lg max-h-[420px] w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
