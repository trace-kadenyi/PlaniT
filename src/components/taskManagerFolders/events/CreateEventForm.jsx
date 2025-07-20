import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { createEvent, resetCreateState } from "../../../redux/eventsSlice";
import { toastWithProgress } from "../utils/toastWithProgress";

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
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(createEvent(formData)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toastWithProgress(`Event successfully created`);
          navigate(`/events/${res.payload._id}`);
        }
      });
    } catch (err) {
      toastWithProgress(`Error: ${err.message}`);
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={70} // 👈 set your desired max length here
              required
              className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
            />
            <p className="text-xs text-right text-gray-500 mt-1">
              {formData.name.length}/70 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={300}
              className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
            />
            <p className="text-xs text-right text-gray-500 mt-1">
              {formData.description.length}/300 characters
            </p>
          </div>
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
              Date
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
                Type
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
              />
            </div>

            {/* status */}
            <div>
              <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* location */}
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

          {/* Error Message */}
          {createStatus === "failed" && (
            <p className="text-sm text-red-600">Error: {createError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Add Event
          </button>
        </form>
      </div>
    </main>
  );
}
