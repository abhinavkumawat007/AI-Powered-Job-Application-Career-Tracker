import { useState } from "react";
import { X, BriefcaseBusiness } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5001/api/applications";

function ApplicationModal({ onClose, onApplicationAdded }) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobUrl: "",
    location: "",
    salary: "",
    status: "Applied",
    appliedDate: "",
    deadline: "",
    notes: "",
    source: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_URL,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onApplicationAdded(response.data.application);
      onClose();
    } catch (error) {
      console.error("Failed to add application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              <BriefcaseBusiness size={18} />
            </div>

            <div>
              <h2 className="font-semibold">Add application</h2>
              <p className="text-xs text-zinc-600">
                Track a new job application
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company *"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Google"
              required
            />

            <Input
              label="Role *"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Software Engineer"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bangalore / Remote"
            />

            <Input
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="₹8 - 12 LPA"
            />
          </div>

          <Input
            label="Job URL"
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleChange}
            placeholder="https://..."
          />

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-400">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/20"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <Input
              label="Applied Date"
              name="appliedDate"
              type="date"
              value={formData.appliedDate}
              onChange={handleChange}
            />

          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
            />

            <Input
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="LinkedIn"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes about this application..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add application"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
      />
    </div>
  );
}

export default ApplicationModal;