// event loading state
export const EventLoadingState = () => (
  <main className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-2">
      <div className="w-10 h-10 border-4 border-[#F59E0B]/30 border-t-[#F59E0B] rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">Loading event details...</p>
    </div>
  </main>
);

// tasks loading state
export const TasksLoadingState = () => (
  <div className="flex justify-center py-8">
    <div className="w-8 h-8 border-2 border-[#9B2C62]/30 border-t-[#9B2C62] rounded-full animate-spin"></div>
  </div>
);
