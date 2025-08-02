// loading dashboard
export const LoadingDashboard = () => (
  <div className="flex space-x-4 animate-pulse justify-center">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-gray-100 rounded-lg p-4 w-80 h-64"></div>
    ))}
  </div>
);