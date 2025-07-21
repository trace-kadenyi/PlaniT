import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import {
  fetchEventById,
  updateEvent,
  clearEventStatuses,
  resetUpdateState,
} from "../../../../redux/eventsSlice";
import { toastWithProgress } from "../../utils/toastWithProgress";
import EventFormFields from "./EventFormFields";
import { formatForDateTimeLocal } from "../../utils/dateHelpers";

export default function EditEventForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent, updateStatus, updateError } = useSelector(
    (state) => state.events
  );

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
  // fetch event
  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(clearEventStatuses());
  }, [dispatch, id]);

  // populate form
  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        date: formatForDateTimeLocal(selectedEvent.date),
      });
    }
  }, [selectedEvent]);

  // handle input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

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
    try {
      const dataToSend = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
      };

      dispatch(updateEvent({ eventId: id, updatedEvent: dataToSend })).then(
        (res) => {
          if (res.meta.requestStatus === "fulfilled") {
            toastWithProgress("Event updated successfully");
            navigate(`/events/${id}`);
          }
        }
      );
    } catch (err) {
      toastWithProgress("Failed to update event");
      console.error("Update error:", err);
    }
  };
  // reset update state
  useEffect(() => {
    return () => {
      dispatch(resetUpdateState());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      dispatch(resetUpdateState()); // 🎯 Reset after successful submission
    }
  }, [updateStatus, dispatch]);

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
          mode="edit"
        />
      </div>
    </main>
  );
}
