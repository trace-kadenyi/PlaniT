import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createVendor } from "../../../redux/vendorsSlice";

import { toastWithProgress } from "../../../globalHooks/useToastWithProgress";
import VendorFormFields from "./VendorFormFields";

export default function CreateVendorForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.vendors);

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
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createVendor(formData)).unwrap();
      toastWithProgress("Vendor created successfully");
      navigate("/vendors");
    } catch (err) {
      toastWithProgress("Failed to create vendor");
    }
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#F7F7FA] p-8 rounded-xl shadow border-t-4 border-[#9B2C62]">
        <h1 className="text-2xl font-bold mb-6 text-[#9B2C62]">
          Create New Vendor
        </h1>
        <VendorFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          formStatus={status}
          formError={error}
          onCancel={() => navigate("/vendors")}
        />
      </div>
    </main>
  );
}
