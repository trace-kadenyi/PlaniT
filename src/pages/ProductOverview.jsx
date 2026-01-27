import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Calendar,
  CreditCard,
  History,
  KanbanSquare,
  Zap,
  Eye,
  CheckCircle,
  BarChart,
  Lock,
  Key,
  AlertTriangle,
  FolderKanban,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ROLES } from "../globalHooks/userPermissions";
import {
  getRoleLabels,
  ROLE_PERMISSION_TEXTS,
} from "../globalHooks/usePermissionHelpers";
import { productFeatures } from "../data/productData";

const ProductOverview = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated;

  const [activeFeature, setActiveFeature] = useState("dashboard");

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-10 pb-15">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#9B2C62]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="relative mb-12 pt-8">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#9B2C62] dark:text-[#D97706] mb-4">
              Event Management Platform
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A sophisticated role-based system for planning, tracking, and
              managing events with enterprise-grade security and complete audit
              trails.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-[#9B2C62] to-[#7B1E5A] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Generate Demo Credentials
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Watch Video Tour
              </button>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
            <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Key Features
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl p-6 shadow-sm border border-[#F3EDE9] dark:border-gray-700/50 hover:shadow-md transition-all duration-300 cursor-pointer ${
                  activeFeature === feature.id
                    ? "ring-2 ring-[#9B2C62] dark:ring-[#D97706]"
                    : ""
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-1">
                  {feature.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-500 dark:text-gray-400"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Role System */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
            <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Role-Based Access Control
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
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
                        Admins cannot modify Super Admins, Planners cannot
                        modify other users
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

        {/* Audit & Security */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
            <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Audit & Security System
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 dark:from-gray-900 dark:to-black rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">
                Live Audit Log Example
              </h3>
              <div className="space-y-3">
                {[
                  {
                    action: "Expense Approved",
                    user: "John Doe",
                    role: "Admin",
                    time: "2 hours ago",
                    color: "bg-green-600",
                  },
                  {
                    action: "Password Reset",
                    user: "Jane Smith",
                    role: "Admin",
                    time: "5 hours ago",
                    color: "bg-blue-600",
                  },
                  {
                    action: "Role Updated",
                    user: "Super Admin",
                    role: "System",
                    time: "Yesterday",
                    color: "bg-purple-600",
                  },
                  {
                    action: "Expense Deleted",
                    user: "Super Admin",
                    role: "System",
                    time: "2 days ago",
                    color: "bg-red-600",
                  },
                ].map((log, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{log.action}</p>
                        <p className="text-sm text-gray-400">
                          {log.user} • {log.role} • {log.time}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 ${log.color} text-white text-xs font-medium rounded-full`}
                      >
                        LOGGED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kanban Dashboards */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
            <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
              Visual Dashboards
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
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
                monitoring, and role-based controls for complete planning
                oversight.
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
                    Drag-and-drop task movement between columns (To Do, In
                    Progress, In Review, Completed)
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

        {/* Image/Video Placeholders */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
                Events Manager Interface
              </h3>
              <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700/50 h-64 flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  [Events Dashboard Screenshot/Video]
                  <br />
                  <span className="text-sm">
                    Monthly event organization with detailed cards
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24]" />
                User Management Interface
              </h3>
              <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700/50 h-64 flex items-center justify-center">
                <p className="text-gray-400 text-center">
                  [User Management Screenshot/Video]
                  <br />
                  <span className="text-sm">
                    Role assignment and permission management
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-12">
          <div className="bg-gradient-to-br from-[#FFF8F2] to-white/60 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 border border-[#F3EDE9] dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mb-4">
              Ready to Explore the System?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the complete event management platform with demo
              credentials. No email required, no commitment – just full access
              to test all features.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-8 py-3 bg-gradient-to-r from-[#9B2C62] to-[#7B1E5A] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Generate Demo Credentials
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                View Feature Walkthrough
              </button>
            </div>
          </div>
        </section>

        {/* <section className="text-center py-12">
          <div className="bg-gradient-to-br from-[#FFF8F2] to-white/60 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 border border-[#F3EDE9] dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mb-4">
              {isLoggedIn
                ? "Ready to Dive In?"
                : "Ready to Explore the System?"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {isLoggedIn
                ? "You're already logged in! Start by creating your first event or explore the dashboards."
                : "Experience the complete event management platform with demo credentials. No email required, no commitment – just full access to test all features."}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/events/new")}
                    className="px-8 py-3 bg-gradient-to-r from-[#9B2C62] to-[#7B1E5A] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Create Your First Event
                  </button>
                  <button
                    onClick={() => navigate("/events")}
                    className="px-8 py-3 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    <BarChart className="w-5 h-5 mr-2" />
                    Explore Dashboards
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-3 bg-gradient-to-r from-[#9B2C62] to-[#7B1E5A] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Demo Credentials
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    <BarChart className="w-5 h-5 mr-2" />
                    Already Have Access? Login
                  </button>
                </>
              )}
            </div>
          </div>
        </section> */}
      </div>
    </main>
  );
};

export default ProductOverview;
