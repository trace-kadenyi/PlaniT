import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateClient,
  resetClientUpdateState,
} from "../../../redux/clientsSlice";
import { toastWithProgress } from "../../../globalHooks/useToastWithProgress";
import ClientFormFields from "./ClientFormFields";

export default function EditClientForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const client = useSelector((state) =>
    state.clients.items.find((c) => c._id === id)
  );

  const { updateStatus, updateError } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    name: "",
    contact: {
      email: "",
      phone: "",
    },
    preferences: "",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        contact: {
          email: client.contact?.email || "",
          phone: client.contact?.phone || "",
        },
        preferences: client.preferences || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

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
      await dispatch(
        updateClient({ clientId: id, updatedClient: formData })
      ).unwrap();
      toastWithProgress("Client updated successfully");
      navigate("/clients");
    } catch (err) {
      toastWithProgress("Failed to update client");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetClientUpdateState());
    };
  }, [dispatch]);

  if (!client) {
    return (
      <div className="p-6 text-center text-gray-600">Client not found.</div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#F7F7FA] p-8 rounded-xl shadow border-t-4 border-[#10B981]">
        <h1 className="text-2xl font-bold mb-6 text-[#065F46]">Edit Client</h1>
        <ClientFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          formStatus={updateStatus}
          formError={updateError}
          onCancel={() => navigate("/clients")}
        />
      </div>
    </main>
  );
}
