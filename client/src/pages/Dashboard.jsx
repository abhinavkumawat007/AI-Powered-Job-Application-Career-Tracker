import ApplicationModal from "../components/dashboard/ApplicationModal";

import { useEffect, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Menu,
  Target,
} from "lucide-react";
import axios from "axios";

import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import ApplicationChart from "../components/dashboard/ApplicationChart";
import AIInsights from "../components/dashboard/AIInsights";
import RecentApplications from "../components/dashboard/RecentApplications";

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : {
      name: "there",
    };

  const firstName = user.name?.split(" ")[0] || "there";

  // --------------------------------
  // Fetch applications
  // --------------------------------

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5001/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard applications:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // --------------------------------
  // Calculate statistics
  // --------------------------------

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "interview"
  ).length;

  const offers = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "offer"
  ).length;

  const resumeScore = 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main */}

      <main
        className={`min-h-screen transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"
          }`}
      >

        {/* Top bar */}

        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-zinc-950/80 px-6 backdrop-blur-xl lg:px-8">

          <div className="flex items-center gap-4">

            <button className="text-zinc-500 lg:hidden">
              <Menu size={21} />
            </button>

            <div>
              <p className="text-xs text-zinc-600">
                Workspace
              </p>

              <p className="text-sm font-medium">
                Overview
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition hover:bg-white/5 hover:text-white">
              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-white" />
            </button>

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-xs font-medium">
                  {user.name || "User"}
                </p>

                <p className="text-[10px] text-zinc-600">
                  Career Explorer
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                {firstName.charAt(0).toUpperCase()}
              </div>

            </div>

          </div>

        </header>

        {/* Content */}

        <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

          {/* Greeting */}

          <section className="mb-8">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>

                <p className="text-sm text-zinc-600">
                  Thursday, September 24, 2026
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Good evening, {firstName}{" "}
                  <span className="text-zinc-500">
                    👋
                  </span>
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                  Here's an overview of your job search and
                  what you can improve next.
                </p>

              </div>

              <button
                onClick={() => setShowApplicationModal(true)}
                className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                <BriefcaseBusiness size={16} />
                Add application
              </button>

            </div>

          </section>

          {/* Stats */}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Career Score"
              value="—"
              description="Career Score"
              trend={null}
              icon={Target}
            />

            <StatCard
              title="Applications"
              value={loading ? "..." : totalApplications}
              description="Total applications"
              trend={null}
              icon={BriefcaseBusiness}
            />

            <StatCard
              title="Interviews"
              value={loading ? "..." : interviews}
              description="Interview stage"
              trend={null}
              icon={CalendarDays}
            />

            <StatCard
              title="Resume Score"
              value={resumeScore ? `${resumeScore}%` : "—"}
              description="ATS compatibility"
              trend={null}
              icon={FileText}
            />

          </section>

          {/* Main grid */}

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            <ApplicationChart
              applications={applications}
            />

            <AIInsights
              applications={applications}
              resumeScore={resumeScore}
            />

          </section>

          {/* Applications */}

          <section className="mt-6">

            <RecentApplications
              applications={applications}
            />

          </section>

        </div>

      </main>

      {showApplicationModal && (
        <ApplicationModal
          onClose={() => setShowApplicationModal(false)}
          onApplicationAdded={(newApplication) => {
            setApplications((prev) => [newApplication, ...prev]);
          }}
        />
      )}

    </div>
  );
}

export default Dashboard;