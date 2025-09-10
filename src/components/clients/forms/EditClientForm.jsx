import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateClient,
  resetClientUpdateState,
  fetchClientWithEvents,
} from "../../../redux/clientsSlice";
import { toastWithProgress } from "../../../globalHooks/useToastWithProgress";
import ClientFormFields from "./ClientFormFields";
import { GenLoadingState } from "../../shared/LoadingStates";

export default function EditClientForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    clientDetails: { data: client, status, error },
    updateStatus,
    updateError,
  } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    name: "",
    contact: {
      email: "",
      phone: "",
    },
    company: "",
    preferences: "",
    notes: "",
  });

  // FETCH CLIENT WHEN COMPONENT MOUNTS
  useEffect(() => {
    dispatch(fetchClientWithEvents(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        contact: {
          email: client.contact?.email || "",
          phone: client.contact?.phone || "",
        },
        company: client.company,
        preferences: client.preferences || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  // reset client update state
  useEffect(() => {
    return () => {
      dispatch(resetClientUpdateState());
    };
  }, [dispatch]);

  // loading
  if (status === "loading")
    return <GenLoadingState message="Loading client details..." />;

  //  if no client
  if (!client) {
    return (
      <div className="p-6 text-center text-gray-600">
        {error || "Client not found"}
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
      await dispatch(
        updateClient({ clientId: id, updatedClient: formData })
      ).unwrap();
      toastWithProgress("Client updated successfully");
      navigate(`/clients/${id}`);
    } catch (err) {
      toastWithProgress("Failed to update client");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-6 py-15">
      <div className="max-w-3xl mx-auto bg-[#F7F7FA] dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-[#D97706] dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] p-8 rounded-xl shadow border-t-4 border-[#9B2C62]">
        <h1 className="text-2xl font-bold mb-6 text-[#9B2C62] dark:text-[#F59E0B]">
          Edit Client
        </h1>
        <ClientFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          formStatus={updateStatus}
          formError={updateError}
          onCancel={() => navigate(`/clients/${id}`)}
        />
      </div>
    </main>
  );
}
