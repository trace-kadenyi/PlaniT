import { Loader2 } from "lucide-react";

// event loading state
export function EventLoadingState() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-10 h-10 border-4 border-[#F59E0B]/30 border-t-[#F59E0B] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading event details...</p>
      </div>
    </main>
  );
}

// tasks loading state
export function TasksLoadingState() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-2 border-[#9B2C62]/30 border-t-[#9B2C62] rounded-full animate-spin"></div>
    </div>
  );
}

// Loading page
export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#9B2C62] py-2 px-3 rounded-2xl bg-[#FDF2F8] border border-[#FAD1E8] shadow-sm w-fit animate-fadeIn">
      <Loader2 className="animate-spin h-4 w-4 opacity-80" />
      <span className="flex items-center gap-1">
        {message}
        <span className="animate-pulse text-[#F59E0B] text-base leading-none">
          •
        </span>
      </span>
    </div>
  );
}

// general loading state
export function GenLoadingState({ message }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-10 h-10 border-4 border-[#F59E0B]/30 border-t-[#F59E0B] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </main>
  );
}
