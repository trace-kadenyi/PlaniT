import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createClient } from "../../../redux/clientsSlice";
import { toastWithProgress } from "../../../globalHooks/useToastWithProgress";
import ClientFormFields from "./ClientFormFields";

export default function CreateClientForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    name: "",
    contact: {
      email: "",
      phone: "",
    },
    preferences: "",
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
      await dispatch(createClient(formData)).unwrap();
      toastWithProgress("Client created successfully");
      navigate("/clients"); // Or wherever your client list is
    } catch (err) {
      toastWithProgress("Failed to create client");
    }
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#F7F7FA] p-8 rounded-xl shadow border-t-4 border-[#9B2C62]">
        <h1 className="text-2xl font-bold mb-6 text-[#9B2C62]">
          Create New Client
        </h1>
        <ClientFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          formStatus={status}
          formError={error}
          onCancel={() => navigate("/clients")}
        />
      </div>
    </main>
  );
}
