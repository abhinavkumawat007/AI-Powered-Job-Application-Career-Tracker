import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  X,
  Loader2,
  Pencil,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";

const API_URL = "http://localhost:5001/api/applications";

const statuses = [
  "All",
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const statusStyles = {
  Applied: "bg-white/5 text-zinc-300 border-white/10",
  Screening: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Interview: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  Withdrawn: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

function Applications() {
  const [collapsed, setCollapsed] = useState(false);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editingApplication, setEditingApplication] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [menuOpen, setMenuOpen] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobUrl: "",
    location: "",
    salary: "",
    status: "Applied",
    appliedDate: "",
    interviewDate: "",
    deadline: "",
    notes: "",
    source: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");


  // --------------------------------
  // Fetch applications
  // --------------------------------

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchApplications();
  }, []);


  // --------------------------------
  // Form change
  // --------------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // --------------------------------
  // Add application
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
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

      setApplications((prev) => [
        response.data.application,
        ...prev,
      ]);

      setFormData({
        company: "",
        role: "",
        jobUrl: "",
        location: "",
        salary: "",
        status: "Applied",
        appliedDate: "",
        interviewDate: "",
        deadline: "",
        notes: "",
        source: "",
      });

      setShowModal(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create application."
      );
    } finally {
      setSubmitting(false);
    }
  };


  // --------------------------------
  // Delete application
  // --------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications((prev) =>
        prev.filter((application) => application._id !== id)
      );

      setMenuOpen(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  //---------------------------------
  //update application
  //---------------------------------
  const handleEdit = (application) => {
    setEditingApplication(application);
    setShowEditModal(true);
    setMenuOpen(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/${editingApplication._id}`,
        editingApplication,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === editingApplication._id
            ? response.data.application
            : application
        )
      );

      setShowEditModal(false);
      setEditingApplication(null);

    } catch (error) {
      console.error(
        "Failed to update application:",
        error
      );
    }
  };


  // --------------------------------
  // Filter applications
  // --------------------------------

  const filteredApplications = applications.filter(
    (application) => {
      const matchesSearch =
        application.company
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        application.role
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );


  // --------------------------------
  // Statistics
  // --------------------------------

  const total = applications.length;

  const applied = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const screening = applications.filter(
    (app) => app.status === "Screening"
  ).length;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status === "Offer"
  ).length;


  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />


      <main
        className={`min-h-screen transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"
          }`}
      >

        {/* Header */}

        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-zinc-950/80 px-6 backdrop-blur-xl lg:px-8">

          <div>
            <p className="text-xs text-zinc-600">
              Workspace
            </p>

            <p className="text-sm font-medium">
              Applications
            </p>
          </div>


          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            <Plus size={17} />
            Add application
          </button>

        </header>


        {/* Content */}

        <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

          {/* Page heading */}

          <div className="mb-8">

            <p className="text-sm text-zinc-600">
              Job search
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Applications
            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Track every opportunity, interview and offer
              from one place.
            </p>

          </div>


          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <Stat
              icon={BriefcaseBusiness}
              label="Total"
              value={total}
            />

            <Stat
              icon={Clock3}
              label="Applied"
              value={applied}
            />

            <Stat
              icon={Clock3}
              label="Screening"
              value={screening}
            />

            <Stat
              icon={CalendarDays}
              label="Interviews"
              value={interviews}
            />

            <Stat
              icon={CheckCircle2}
              label="Offers"
              value={offers}
            />

          </div>


          {/* Search / filters */}

          <div className="mt-8 flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search company or role..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/20"
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 outline-none"
            >

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status === "All"
                    ? "All statuses"
                    : status}
                </option>
              ))}

            </select>

          </div>


          {/* Applications list */}

          <div className="mt-6 overflow-visible rounded-2xl border border-white/10 bg-white/[0.02]">

            {loading ? (

              <div className="flex min-h-[300px] items-center justify-center">

                <Loader2
                  size={24}
                  className="animate-spin text-zinc-500"
                />

              </div>

            ) : filteredApplications.length === 0 ? (

              <EmptyState
                onAdd={() => setShowModal(true)}
              />

            ) : (

              <div className="divide-y divide-white/5">

                {filteredApplications.map(
                  (application) => (

                    <div
                      key={application._id}
                      className="group flex flex-col gap-4 p-5 transition hover:bg-white/[0.025] md:flex-row md:items-center"
                    >

                      {/* Company icon */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold">
                        {application.company
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>


                      {/* Company + role */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">

                          <h3 className="truncate text-sm font-medium">
                            {application.company}
                          </h3>

                          {application.jobUrl && (
                            <a
                              href={application.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-600 transition hover:text-white"
                            >
                              <BriefcaseBusiness
                                size={13}
                              />
                            </a>
                          )}

                        </div>

                        <p className="mt-1 truncate text-xs text-zinc-600">
                          {application.role}
                        </p>

                      </div>


                      {/* Location */}

                      <div className="hidden min-w-[130px] lg:block">

                        <p className="text-xs text-zinc-600">
                          Location
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          {application.location || "—"}
                        </p>

                      </div>


                      {/* Date */}

                      <div className="hidden min-w-[110px] lg:block">

                        <p className="text-xs text-zinc-600">
                          Applied
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          {application.appliedDate
                            ? new Date(
                              application.appliedDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                            : "—"}
                        </p>

                      </div>


                      {/* Status */}

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-[11px] font-medium ${statusStyles[
                          application.status
                        ] ||
                          statusStyles.Applied
                          }`}
                      >
                        {application.status}
                      </span>


                      {/* Menu */}

                      <div className="relative">

                        <button
                          onClick={() =>
                            setMenuOpen(
                              menuOpen ===
                                application._id
                                ? null
                                : application._id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={18} />
                        </button>


                        {menuOpen === application._id && (
                          <div className="absolute right-0 top-11 z-[100] w-44 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/40">

                            <button
                              onClick={() => handleEdit(application)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                            >
                              <Pencil size={14} />
                              Edit application
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(application._id)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                              Delete application
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </main>


      {/* Add Application Modal */}

      {showModal && (
        <ApplicationModal
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          onClose={() => {
            setShowModal(false);
            setError("");
          }}
        />
      )}
      {showEditModal && editingApplication && (
        <EditApplicationModal
          application={editingApplication}
          setApplication={setEditingApplication}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setEditingApplication(null);
          }}
        />
      )}

    </div>
  );
}


/* -------------------------------- */
/* Stat component */
/* -------------------------------- */

function Stat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
        <Icon size={17} className="text-zinc-400" />
      </div>

      <p className="mt-4 text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>

    </div>
  );
}


/* -------------------------------- */
/* Empty state */
/* -------------------------------- */

function EmptyState({ onAdd }) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <BriefcaseBusiness
          size={24}
          className="text-zinc-500"
        />
      </div>

      <h3 className="mt-5 text-sm font-medium">
        No applications found
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
        Start tracking your job search by adding your
        first application.
      </p>

      <button
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-medium text-black"
      >
        <Plus size={15} />
        Add application
      </button>

    </div>
  );
}


/* -------------------------------- */
/* Application modal */
/* -------------------------------- */

function ApplicationModal({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  error,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">

        {/* Modal header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950 px-6 py-5">

          <div>
            <h2 className="font-semibold">
              Add application
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Save a new opportunity to your tracker.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}


          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Company *"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              required
            />

            <Input
              label="Job title *"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              required
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
            />

            <Input
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 12-18 LPA"
            />

            <Input
              label="Job URL"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://..."
            />

            <Input
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="LinkedIn, Naukri, Referral..."
            />

            <div>
              <label className="mb-2 block text-xs text-zinc-500">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >

                {statuses
                  .filter(
                    (status) => status !== "All"
                  )
                  .map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-zinc-900"
                    >
                      {status}
                    </option>
                  ))}

              </select>
            </div>


            <Input
              label="Applied date"
              name="appliedDate"
              type="date"
              value={formData.appliedDate}
              onChange={handleChange}
            />

            <Input
              label="Interview date"
              name="interviewDate"
              type="datetime-local"
              value={formData.interviewDate}
              onChange={handleChange}
            />

            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
            />

          </div>


          {/* Notes */}

          <div>

            <label className="mb-2 block text-xs text-zinc-500">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add interview notes, recruiter details, preparation tasks..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/20"
            />

          </div>


          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >

              {submitting ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Add application
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}



/* -------------------------------- */
/* Edit Application Modal */
/* -------------------------------- */

function EditApplicationModal({
  application,
  setApplication,
  onSubmit,
  onClose,
}) {
  const handleChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950 px-6 py-5">

          <div>
            <h2 className="font-semibold">
              Edit application
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Update your application details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            <Input
              label="Company *"
              name="company"
              value={application.company || ""}
              onChange={handleChange}
              required
            />

            <Input
              label="Job title *"
              name="role"
              value={application.role || ""}
              onChange={handleChange}
              required
            />

            <Input
              label="Location"
              name="location"
              value={application.location || ""}
              onChange={handleChange}
            />

            <Input
              label="Salary"
              name="salary"
              value={application.salary || ""}
              onChange={handleChange}
            />

            <Input
              label="Job URL"
              name="jobUrl"
              value={application.jobUrl || ""}
              onChange={handleChange}
            />

            <Input
              label="Source"
              name="source"
              value={application.source || ""}
              onChange={handleChange}
            />

            {/* Status */}

            <div>

              <label className="mb-2 block text-xs text-zinc-500">
                Status
              </label>

              <select
                name="status"
                value={application.status || "Applied"}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="Applied">
                  Applied
                </option>

                <option value="Screening">
                  Screening
                </option>

                <option value="Interview">
                  Interview
                </option>

                <option value="Offer">
                  Offer
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Withdrawn">
                  Withdrawn
                </option>

              </select>

            </div>

            <Input
              label="Applied date"
              name="appliedDate"
              type="date"
              value={
                application.appliedDate
                  ? application.appliedDate.slice(0, 10)
                  : ""
              }
              onChange={handleChange}
            />

            <Input
              label="Interview date"
              name="interviewDate"
              type="datetime-local"
              value={
                application.interviewDate
                  ? application.interviewDate.slice(0, 16)
                  : ""
              }
              onChange={handleChange}
            />

            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={
                application.deadline
                  ? application.deadline.slice(0, 10)
                  : ""
              }
              onChange={handleChange}
            />

          </div>

          {/* Notes */}

          <div>

            <label className="mb-2 block text-xs text-zinc-500">
              Notes
            </label>

            <textarea
              name="notes"
              value={application.notes || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Add notes..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/20"
            />

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Save changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* -------------------------------- */
/* Input */
/* -------------------------------- */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs text-zinc-500">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/20"
      />

    </div>
  );
}

export default Applications;