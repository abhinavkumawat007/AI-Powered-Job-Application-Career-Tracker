import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

const statusStyles = {
  Interview: "bg-blue-500/10 text-blue-400",
  Applied: "bg-white/5 text-zinc-400",
  Screening: "bg-amber-500/10 text-amber-400",
  Rejected: "bg-red-500/10 text-red-400",
  Offer: "bg-emerald-500/10 text-emerald-400",
  Withdrawn: "bg-zinc-500/10 text-zinc-400",
};

function RecentApplications({ applications = [] }) {
  const navigate = useNavigate();

  // Show only the latest 5
  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appliedDate) -
        new Date(a.createdAt || a.appliedDate)
    )
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

        <div>

          <h3 className="font-semibold">
            Recent applications
          </h3>

          <p className="mt-1 text-xs text-zinc-600">
            Keep track of your latest applications
          </p>

        </div>

        <button
          onClick={() => navigate("/applications")}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          View all
        </button>

      </div>

      {/* Applications */}

      <div className="divide-y divide-white/5">

        {recentApplications.length === 0 ? (

          <div className="px-6 py-10 text-center">

            <p className="text-sm text-zinc-500">
              No applications yet.
            </p>

            <p className="mt-1 text-xs text-zinc-700">
              Add your first job application to see it here.
            </p>

          </div>

        ) : (

          recentApplications.map((application) => (

            <div
              key={application._id}
              className="flex items-center gap-4 px-6 py-4 transition hover:bg-white/[0.02]"
            >

              {/* Company */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold">
                {application.company?.charAt(0)?.toUpperCase()}
              </div>

              {/* Job */}

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-medium">
                  {application.company}
                </p>

                <p className="mt-1 truncate text-xs text-zinc-600">
                  {application.role}
                </p>

              </div>

              {/* Date */}

              <p className="hidden text-xs text-zinc-600 md:block">

                {application.appliedDate
                  ? new Date(
                    application.appliedDate
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "—"}

              </p>

              {/* Status */}

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[application.status] ||
                  "bg-white/5 text-zinc-400"
                  }`}
              >
                {application.status}
              </span>

              {/* Actions */}

              <button
                onClick={() => navigate("/applications")}
                className="text-zinc-600 transition hover:text-white"
              >
                <MoreHorizontal size={18} />
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default RecentApplications;