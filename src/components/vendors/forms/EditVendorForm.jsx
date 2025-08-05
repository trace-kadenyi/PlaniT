import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateVendor,
  resetVendorStatuses,
  fetchVendorById,
} from "../../../redux/vendorsSlice";
import { toastWithProgress } from "../../../globalHooks/useToastWithProgress";
import VendorFormFields from "./VendorFormFields";
import { GenLoadingState } from "../../shared/LoadingStates";

export default function EditVendorForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    vendorDetails: { data: vendor, status, error },
    updateStatus,
    updateError,
  } = useSelector((state) => state.vendors);

  const [formData, setFormData] = useState({
    name: "",
    services: "",
    contact: {
      email: "",
      phone: "",
      website: "",
    },
    address: "",
    notes: "",
    isArchived: false,
  });

  // fetch vendor
  useEffect(() => {
    dispatch(fetchVendorById(id));
  }, [dispatch, id]);

  // form data
  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        services: vendor.services || "",
        contact: {
          email: vendor.contact?.email || "",
          phone: vendor.contact?.phone || "",
          website: vendor.contact?.website || "",
        },
        address: vendor.address || "",
        notes: vendor.notes || "",
        isArchived: vendor.isArchived || false,
      });
    }
  }, [vendor]);

  // reset vendor statuses
  useEffect(() => {
    return () => {
      dispatch(resetVendorStatuses());
    };
  }, [dispatch]);

  //
  if (status === "loading")
    return <GenLoadingState message="Loading vendor details..." />;

  if (!vendor) {
    return (
      <div className="p-6 text-center text-gray-600">
        {error || "Vendor not found"}
      </div>
    );
  }

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateVendor({ id, updatedData: formData })).unwrap();
      toastWithProgress("Vendor updated successfully");
      navigate(`/vendors/${id}`);
    } catch (err) {
      toastWithProgress("Failed to update vendor");
    }
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#F7F7FA] p-8 rounded-xl shadow border-t-4 border-[#9B2C62]">
        <h1 className="text-2xl font-bold mb-6 text-[#9B2C62]">Edit Vendor</h1>
        <VendorFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          formStatus={updateStatus}
          formError={updateError}
          onCancel={() => navigate(`/vendors/${id}`)}
        />
      </div>
    </main>
  );
}
