import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchVendorById,
  toggleArchiveVendor,
  clearVendorDetails,
} from "../../redux/vendorsSlice";
import { LoadingPage } from "../../components/shared/LoadingStates";
import { FiArrowLeft, FiArchive, FiEdit } from "react-icons/fi";
import { toastWithProgress } from "../../globalHooks/useToastWithProgress";

export default function Vendor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    vendorDetails: { data: vendor, status, error },
    archiveStatus,
  } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendorById(id));

    return () => {
      dispatch(clearVendorDetails());
    };
  }, [dispatch, id]);

  const handleArchiveToggle = async () => {
    try {
      await dispatch(toggleArchiveVendor(vendor._id)).unwrap();
      toastWithProgress(
        `Vendor ${vendor.isArchived ? "unarchived" : "archived"} successfully`
      );
    } catch (err) {
      toastWithProgress("Failed to update vendor status");
    }
  };

  if (status === "loading") {
    return <LoadingPage message="Loading vendor details..." />;
  }

  if (status === "failed" || !vendor) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto text-center text-[#9B2C62]">
          <p className="mb-4">{error || "Vendor not found"}</p>
          <Link
            to="/vendors"
            className="text-[#F59E0B] hover:text-[#D97706] font-medium"
          >
            Back to Vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/vendors")}
            className="flex items-center text-[#9B2C62] hover:text-[#801f4f]"
          >
            <FiArrowLeft className="mr-2" /> Back to Vendors
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleArchiveToggle}
              disabled={archiveStatus === "loading"}
              className={`flex items-center px-3 py-1 rounded-md ${
                vendor.isArchived
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
            >
              <FiArchive className="mr-1" />
              {archiveStatus === "loading"
                ? "Processing..."
                : vendor.isArchived
                ? "Unarchive"
                : "Archive"}
            </button>
            <button
              onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
              className="flex items-center bg-[#9B2C62] hover:bg-[#801f4f] text-white px-3 py-1 rounded-md"
            >
              <FiEdit className="mr-1" /> Edit
            </button>
          </div>
        </div>

        {/* Vendor Card */}
        <div className="bg-[#F7F7FA] rounded-xl shadow border-t-4 border-[#9B2C62] p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-[#9B2C62]">{vendor.name}</h2>
            <span className="inline-block bg-[#F59E0B] text-white text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
              {vendor.services}
            </span>
          </div>

          {vendor.isArchived && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiArchive className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This vendor is archived and won't appear in default listings.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-[#9B2C62] mb-3">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-[#6B3B0F]">
                    {vendor.contact?.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-[#6B3B0F]">
                    {vendor.contact?.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-[#6B3B0F]">
                    {vendor.contact?.website ? (
                      <a
                        href={vendor.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F59E0B] hover:underline"
                      >
                        {vendor.contact.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-[#9B2C62] mb-3">
                Address
              </h3>
              <p className="text-[#6B3B0F]">
                {vendor.address || "Not provided"}
              </p>
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#9B2C62] mb-2">Notes</h3>
              <div className="bg-white p-4 rounded-lg border border-[#E3CBC1]">
                <p className="text-[#6B3B0F] whitespace-pre-line">
                  {vendor.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}