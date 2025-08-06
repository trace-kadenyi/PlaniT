import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

import { createEvent, resetCreateState } from "../../../../redux/eventsSlice";
import {
  fetchClients,
  fetchClientWithEvents,
} from "../../../../redux/clientsSlice";
import { fetchVendors } from "../../../../redux/vendorsSlice";

import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import EventFormFields from "./EventFormFields";

export default function CreateEventForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedClientId = queryParams.get("client");

  const { createStatus, createError } = useSelector((state) => state.events);
  // clients
  const {
    items: clients,
    status: clientsStatus,
    clientDetails,
  } = useSelector((state) => state.clients);

  // vendors
  const { items: vendors, status: vendorsStatus } = useSelector(
    (state) => state.vendors
  );

  // form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    type: "",
    status: "Planning",
    client: preSelectedClientId || "",
    vendors: [],
    initialBudget: "",
    budgetNotes: "",
    location: {
      venue: "",
      address: "",
      city: "",
      country: "",
    },
  });

  // Fetch clients
  useEffect(() => {
    if (preSelectedClientId) {
      dispatch(fetchClientWithEvents(preSelectedClientId));
    } else if (clientsStatus === "idle") {
      dispatch(fetchClients());
    }
  }, [dispatch, clientsStatus, preSelectedClientId]);

  // fetch vendors
  useEffect(() => {
    if (vendorsStatus === "idle") {
      dispatch(fetchVendors());
    }
  }, [dispatch, vendorsStatus]);

  // Get the specific client when coming from client page
  const getPreSelectedClient = () => {
    if (preSelectedClientId) {
      if (clientDetails.data?._id === preSelectedClientId) {
        return clientDetails.data;
      }
      // Then check if it's in the general clients list
      return clients.find((client) => client._id === preSelectedClientId);
    }
    return null;
  };

  const preSelectedClient = getPreSelectedClient();

  // handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate client is selected when not coming from client page
    // if (!preSelectedClientId && !formData.client) {
    //   toastWithProgress("Please select a client");
    //   return;
    // }

    try {
      const dataToSend = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        initialBudget: Number(formData.initialBudget) || 0,
        client: formData.client || null,
        vendors: Array.isArray(formData.vendors) ? formData.vendors : [],
      };
      const res = await dispatch(createEvent(dataToSend)).unwrap();

      toastWithProgress("Event successfully created");

      // Redirect to the new event
      const newEventId = res.event?._id || res._id;
      if (newEventId) {
        navigate(`/events/${newEventId}`);
      }
    } catch (err) {
      toastWithProgress(`Error: ${err.message || "Failed to create event"}`);
    }
  };

  // reset create state
  useEffect(() => {
    return () => {
      dispatch(resetCreateState());
    };
  }, [dispatch]);

  // 
  useEffect(() => {
    if (createStatus === "succeeded") {
      dispatch(resetCreateState());
    }
  }, [createStatus, dispatch]);

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#F7F7FA] p-8 rounded-xl shadow border-t-4 border-[#BE3455]">
        <h1 className="sm:flex items-center gap-2 text-2xl sm:text-3xl font-bold mb-6 text-[#9B2C62]">
          <span className="hidden sm:block">
            <Plus className="w-7 h-7" />
          </span>
          Create Event
        </h1>

        {/* event form fields */}
        <EventFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(
              preSelectedClientId
                ? `/clients/${preSelectedClientId}`
                : "/events"
            )
          }
          formStatus={createStatus}
          formError={createError}
          clients={
            preSelectedClient ? [preSelectedClient, ...clients] : clients
          }
          clientsLoading={
            preSelectedClientId
              ? clientDetails.status === "loading"
              : clientsStatus === "loading"
          }
          preSelectedClientId={preSelectedClientId}
          vendors={vendors}
          vendorsLoading={vendorsStatus === "loading"}
          mode="create"
        />
      </div>
    </main>
  );
}
