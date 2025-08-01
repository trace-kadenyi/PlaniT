import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import {
  fetchEventById,
  updateEvent,
  updateBudget,
  resetUpdateState,
  resetBudgetUpdateState,
  clearEventStatuses,
} from "../../../../redux/eventsSlice";
import { fetchClients } from "../../../../redux/clientsSlice";
import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import EventFormFields from "./EventFormFields";
import { formatForDateTimeLocal } from "../../utils/dateHelpers";

export default function EditEventForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [budgetError, setBudgetError] = useState(null);

  const {
    selectedEvent,
    updateStatus,
    updateError,
    updateBudgetStatus,
    updateBudgetError,
  } = useSelector((state) => state.events);
  const { items: clients, status: clientsStatus } = useSelector(
    (state) => state.clients
  );

  // form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    type: "",
    status: "Planning",
    client: "",
    initialBudget: "",
    budgetNotes: "",
    location: {
      venue: "",
      address: "",
      city: "",
      country: "",
    },
  });
  // fetch event
  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(fetchClients());
    dispatch(clearEventStatuses());
  }, [dispatch, id]);

  // populate form
  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        client: selectedEvent.client?._id || selectedEvent.client || "",
        initialBudget: selectedEvent.budget?.totalBudget || "",
        budgetNotes: selectedEvent.budget?.notes || "",
        date: formatForDateTimeLocal(selectedEvent.date),
      });
    }
  }, [selectedEvent]);

  // handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (e.target.name === "initialBudget" && budgetError) {
      setBudgetError(null);
    }

    if (name === "date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Store local format temporarily
      }));
    } else if (name.startsWith("location.")) {
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
    setBudgetError(null); // Reset previous errors

    try {
      const dataToSend = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        client: formData.client,
      };

      const { initialBudget, budgetNotes, ...eventData } = dataToSend;

      const [eventResult, budgetResult] = await Promise.all([
        dispatch(
          updateEvent({
            eventId: id,
            updatedEvent: eventData,
          })
        ),
        dispatch(
          updateBudget({
            eventId: id,
            updatedBudget: {
              totalBudget: Number(initialBudget),
              notes: budgetNotes,
            },
          })
        ),
      ]);

      if (budgetResult?.error) {
        // Extract the backend message or use a default
        const errorMessage =
          budgetResult.payload?.message ||
          budgetResult.error?.message ||
          "Budget cannot be less than current expenses";
        setBudgetError(errorMessage);
        return;
      }

      if (eventResult.error) {
        throw new Error(eventResult.error.message);
      }

      toastWithProgress("Event updated successfully");
      navigate(`/events/${id}`);
    } catch (err) {
      toastWithProgress("Failed to update event details");
      console.error("Update error:", err);
    }
  };
  // Update the cleanup effect
  useEffect(() => {
    return () => {
      dispatch(resetUpdateState());
      dispatch(resetBudgetUpdateState());
    };
  }, [dispatch, id]);

  // Update the success effect
  useEffect(() => {
    if (updateStatus === "succeeded" && updateBudgetStatus === "succeeded") {
      dispatch(resetUpdateState());
      dispatch(resetBudgetUpdateState());
    }
  }, [updateStatus, updateBudgetStatus, dispatch]);

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#FFF8F2] p-8 rounded-xl shadow border-t-4 border-[#F59E0B]">
        <h1 className="sm:flex items-center gap-2 text-2xl sm:text-3xl font-bold mb-6 text-[#9B2C62]">
          <span className="hidden sm:block">
            <Pencil />
          </span>
          Edit Event
        </h1>

        <EventFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/events/${id}`)}
          formStatus={updateStatus}
          formError={updateError}
          budgetError={budgetError}
          clients={clients}
          clientsLoading={clientsStatus === "loading"}
          preSelectedClientId={formData.client}
          mode="edit"
        />
      </div>
    </main>
  );
}
