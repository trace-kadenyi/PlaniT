import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  createEvent,
  resetCreateState,
  fetchEvents,
} from "../../../../redux/eventsSlice";
import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import EventFormFields from "./EventFormFields";
import { formatForDateTimeLocal } from "../../utils/dateHelpers";

export default function CreateEventForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createStatus, createError } = useSelector((state) => state.events);

  // form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    type: "",
    status: "Planning",
    location: {
      venue: "",
      address: "",
      city: "",
      country: "",
    },
  });

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
    try {
      const dataToSend = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
      };

      const res = await dispatch(createEvent(dataToSend)).unwrap();

      toastWithProgress("Event successfully created");

      const newEventId = res?.event?._id || res?._id;

      if (newEventId) {
        navigate(`/events/${newEventId}`);
      }
    } catch (err) {
      toastWithProgress(`Error: ${err.message || "Failed to create event"}`);
    }
  };

  useEffect(() => {
    // 🧹 Clean up when component unmounts
    return () => {
      dispatch(resetCreateState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (createStatus === "succeeded") {
      dispatch(resetCreateState()); // 🎯 Reset after successful submission
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

        <EventFormFields
          formData={formData}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/events`)}
          formStatus={createStatus}
          formError={createError}
          mode="create"
        />
      </div>
    </main>
  );
}
