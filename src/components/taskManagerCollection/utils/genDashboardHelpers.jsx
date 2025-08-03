// loading dashboard
export const LoadingDashboard = () => (
  <div className="flex space-x-4 animate-pulse justify-center">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-gray-100 rounded-lg p-4 w-80 h-64"></div>
    ))}
  </div>
);

// fetch dashboard error
export const FetchDashboardError = ({ message, fetchError }) => (
  <div className="p-3 bg-red-50 text-red-600 rounded mb-4">
    {message}: {fetchError}
  </div>
);

// update dashboard error
export const UpdateDashboardError = ({ updateError, dispatch, clearError }) => (
  <div className="p-3 bg-red-50 text-red-600 rounded mb-4 flex justify-between">
    <span>Update failed: {updateError}</span>
    <button
      onClick={() => dispatch(clearError())}
      className="text-[#9B2C62] font-medium"
    >
      Retry
    </button>
  </div>
);
