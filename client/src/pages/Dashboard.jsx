import ApplicationModal from "../components/dashboard/ApplicationModal";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedNotificationKeys, setDismissedNotificationKeys] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "dismissedCareerNotifications"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });
  const storedUser = localStorage.getItem("user");
  const navigate = useNavigate();

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

  const resumeScoreKey = user.id
    ? `resumeScore_${user.id}`
    : "resumeScore";

  const resumeScore = Number(
    localStorage.getItem(resumeScoreKey) || 0
  );

  const notifications = [];

  const now = new Date();

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  applications.forEach((application) => {
    if (application.interviewDate) {
      const interviewDate = new Date(
        application.interviewDate
      );

      if (
        interviewDate >= now &&
        interviewDate <= addDays(now, 7)
      ) {
        notifications.push({
          type: "interview",
          title: "Upcoming interview",
          text: `${application.company} · ${application.role}`,
          date: interviewDate,
        });
      }
    }

    if (application.deadline) {
      const deadline = new Date(
        application.deadline
      );

      if (
        deadline >= now &&
        deadline <= addDays(now, 7)
      ) {
        notifications.push({
          type: "deadline",
          title: "Application deadline approaching",
          text: `${application.company} · ${application.role}`,
          date: deadline,
        });
      }
    }

    if (
      application.status?.toLowerCase() === "offer"
    ) {
      notifications.push({
        type: "offer",
        title: "Offer received",
        text: `${application.company} · ${application.role}`,
        date: new Date(
          application.updatedAt ||
          application.createdAt ||
          application.appliedDate
        ),
      });
    }
  });

  notifications.sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date)
  );

  const getNotificationKey = (notification) => {
    return [
      notification.type,
      notification.title,
      notification.text,
      new Date(notification.date).getTime(),
    ].join("|");
  };

  const activeNotifications = notifications.filter(
    (notification) =>
      !dismissedNotificationKeys.includes(
        getNotificationKey(notification)
      )
  );

  const handleNotificationToggle = () => {
    if (!showNotifications) {
      setShowNotifications(true);
      return;
    }

    const currentKeys = activeNotifications.map(
      getNotificationKey
    );

    const updatedKeys = [
      ...new Set([
        ...dismissedNotificationKeys,
        ...currentKeys,
      ]),
    ];

    setDismissedNotificationKeys(updatedKeys);

    localStorage.setItem(
      "dismissedCareerNotifications",
      JSON.stringify(updatedKeys)
    );

    setShowNotifications(false);
  };

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

            <div className="relative">
              <button
                onClick={handleNotificationToggle}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={17} />

                {activeNotifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-black">
                    {activeNotifications.length > 9
                      ? "9+"
                      : activeNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">

                  {/* Header */}
                  <div className="border-b border-white/10 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">
                          Notifications
                        </h3>

                        <p className="mt-1 text-xs text-zinc-600">
                          Important updates from your job search
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setShowNotifications(false)
                        }
                        className="text-xs text-zinc-600 transition hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {activeNotifications.length > 0 ? (
                      activeNotifications.map(
                        (notification, index) => (
                          <div
                            key={`${notification.title}-${index}`}
                            className="border-b border-white/5 px-4 py-4 last:border-b-0 hover:bg-white/[0.03]"
                          >
                            <div className="flex gap-3">
                              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />

                              <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-200">
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                  {notification.text}
                                </p>

                                <p className="mt-2 text-[10px] text-zinc-700">
                                  {new Date(
                                    notification.date
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="px-4 py-10 text-center">
                        <Bell
                          size={24}
                          className="mx-auto text-zinc-700"
                        />

                        <p className="mt-3 text-sm text-zinc-400">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-zinc-700">
                          You're all caught up.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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

              <button
                onClick={() => navigate("/profile")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                {firstName.charAt(0).toUpperCase()}
              </button>

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
  {new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })}
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
              title="Offers"
              value={loading ? "..." : offers}
              description="Offer stage"
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