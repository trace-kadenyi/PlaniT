import { Loader2 } from "lucide-react";

// event loading state
export function EventLoadingState() {
  return (
    <main className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-10 h-10 border-4 border-[#9B2C62]/30 border-t-[#9B2C62] dark:border-[#F59E0B]/30 dark:border-t-[#F59E0B] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading event details...</p>
      </div>
    </main>
  );
}

// tasks loading state
export function TasksLoadingState() {
  return (
    <div className="flex justify-center py-8 dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <div className="w-8 h-8 border-2 border-[#9B2C62]/30 border-t-[#9B2C62] rounded-full animate-spin"></div>
    </div>
  );
}

// Loading page
export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#9B2C62] py-2 px-3 rounded-2xl bg-[#FDF2F8] dark:bg-gray-900 dark:text-white border border-[#FAD1E8] shadow-sm w-fit animate-fadeIn">
      <Loader2 className="animate-spin h-4 w-4 opacity-80" />
      <span className="flex items-center gap-1">
        {message}
        <span className="animate-pulse text-[#F59E0B] dark:text-white text-base leading-none">
          •
        </span>
      </span>
    </div>
  );
}

// general loading state
export function GenLoadingState({ message }) {
  return (
    <main className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-10 h-10 border-4 border-[#9B2C62]/30 border-t-[#9B2C62] dark:border-[#F59E0B]/30 dark:border-t-[#F59E0B] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </main>
  );
}

// Load vendor status
export const VendorStatsLoading = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 mb-6">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <div
        key={i}
        className="bg-[#F7F7FA] p-3 rounded-lg text-center dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 animate-pulse h-22"
      ></div>
    ))}
  </div>
);

// load expense audit logs
export const AuditLogsLoading = () => {
  return (
    <div className="flex justify-center items-center py-8 min-h-[250px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B2C62] dark:border-[#F59E0B] "></div>
    </div>
  );
};
