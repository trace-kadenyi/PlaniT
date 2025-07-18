import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchEventById,
  updateEvent,
  clearEventStatuses,
} from "../../../redux/eventsSlice";

export default function EditEventForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent, updateStatus, updateError } = useSelector(
    (state) => state.events
  );

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

  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(clearEventStatuses());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        date: selectedEvent.date?.slice(0, 16), // format for input type="datetime-local"
      });
    }
  }, [selectedEvent]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEvent({ eventId: id, updatedEvent: formData })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate(`/events/${id}`);
        }
      }
    );
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-[#F8F8F8] p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-[#9B2C62]">Edit Event</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <fieldset className="border rounded-lg p-4">
            <legend className="text-sm font-semibold text-[#9B2C62]">
              Location
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="location.venue"
                placeholder="Venue"
                value={formData.location?.venue || ""}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                name="location.address"
                placeholder="Address"
                value={formData.location?.address || ""}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                name="location.city"
                placeholder="City"
                value={formData.location?.city || ""}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                name="location.country"
                placeholder="Country"
                value={formData.location?.country || ""}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg"
              />
            </div>
          </fieldset>

          {updateStatus === "failed" && (
            <p className="text-red-500">Error: {updateError}</p>
          )}

          <button
            type="submit"
            className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-semibold px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
