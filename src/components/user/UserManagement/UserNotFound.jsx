export default function UserNotFound({
  Shield,
  fetchDetailsError,
  ArrowLeft,
  Link,
}) {
  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-10 pb-15">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-10 mb-2 sm:my-2">
              User Not Found
            </h1>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-sm p-8 text-center dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            User Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {fetchDetailsError ||
              "The user you're looking for doesn't exist or you don't have access."}
          </p>
          <Link
            to="/users"
            className="inline-flex items-center gap-2 bg-[#9B2C62] hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Team Members
          </Link>
        </div>
      </div>
    </main>
  );
}

export function NoUserDetails({ AlertCircle, Link, ArrowLeft }) {
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
