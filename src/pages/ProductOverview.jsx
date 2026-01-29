import React from "react";
import { useSelector } from "react-redux";
import { Zap } from "lucide-react";

import ProductFeatures from "../components/productOverview/ProductFeatures";
import RoleSystem from "../components/productOverview/RoleSystem";
import AuditSystem from "../components/productOverview/AuditSystem";
import VisualBoards, {
  InterfaceVisuals,
} from "../components/productOverview/VisualBoards";

const ProductOverview = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

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
            </div>
          </div>
        </div>

        {/* Key Features */}
        <ProductFeatures />

        {/* Role System */}
        <RoleSystem />

        {/* Audit & Security */}
        <AuditSystem />

        {/* Kanban Dashboards */}
        <VisualBoards />

        {/* Image/Video */}
        <InterfaceVisuals />

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
