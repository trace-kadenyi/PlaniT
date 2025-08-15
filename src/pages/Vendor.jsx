import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  fetchVendorById,
  toggleArchiveVendor,
  clearVendorDetails,
} from "../redux/vendorsSlice";
import { LoadingPage } from "../components/shared/LoadingStates";
import VendorCard from "../components/vendors/VendorCard";

export default function Vendor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    vendorDetails: { data: vendor, status, error },
    archiveStatus,
  } = useSelector((state) => state.vendors);

  // fetch vendor by id
  useEffect(() => {
    dispatch(fetchVendorById(id));

    // clear vendor details
    return () => {
      dispatch(clearVendorDetails());
    };
  }, [dispatch, id]);

  return (
    <main className="min-h-screen bg-white px-8 py-15">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-4">
          <Link
            to="/vendors"
            className="inline-flex items-center text-[#9B2C62] hover:text-[#7B1D52] font-medium transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Vendors
          </Link>
        </div>

        {/* loading */}
        {status === "loading" && (
          <LoadingPage message="Loading vendor details..." />
        )}

        {/* failed */}
        {status === "failed" && (
          <div className="mb-6">
            <ErrorState
              message={error || "Failed to load vendor details."}
              action={
                <button
                  onClick={() => dispatch(fetchVendorById(id))}
                  className="text-sm text-red-600 hover:underline font-medium"
                >
                  Retry
                </button>
              }
            />
          </div>
        )}

        {/* Vendor details */}
        {status === "succeeded" && vendor && (
          <VendorCard
            dispatch={dispatch}
            vendor={vendor}
            toggleArchiveVendor={toggleArchiveVendor}
            archiveStatus={archiveStatus}
            navigate={navigate}
          />
        )}
      </div>
    </main>
  );
}
