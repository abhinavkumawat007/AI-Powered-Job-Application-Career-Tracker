import {
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AIInsights({
  applications = [],
  resumeScore = 0,
}) {
  const navigate = useNavigate();

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "interview"
  ).length;

  const offers = applications.filter(
    (application) =>
      application.status?.toLowerCase() === "offer"
  ).length;

  const insights = [];

  // --------------------------------------------------
  // RESUME INSIGHT
  // --------------------------------------------------

  if (resumeScore > 0) {
    insights.push({
      icon: FileText,
      title: "Resume analyzed",
      text: `Your latest ATS resume score is ${resumeScore}/100. Review the Resume Analyzer for improvement suggestions.`,
      action: () => navigate("/resume"),
    });
  } else {
    insights.push({
      icon: FileText,
      title: "Analyze your resume",
      text: "Upload your resume to get an ATS score, detected skills, strengths, and improvement suggestions.",
      action: () => navigate("/resume"),
    });
  }

  // --------------------------------------------------
  // APPLICATION INSIGHT
  // --------------------------------------------------

  if (totalApplications > 0) {
    insights.push({
      icon: Target,
      title: "Application activity",
      text: `You are currently tracking ${totalApplications} application${
        totalApplications === 1 ? "" : "s"
      }. Keep your application statuses updated.`,
      action: () => navigate("/applications"),
    });
  } else {
    insights.push({
      icon: Target,
      title: "Start tracking applications",
      text: "Add your first application to start monitoring your job search activity.",
      action: () => navigate("/applications"),
    });
  }

  // --------------------------------------------------
  // INTERVIEW / OFFER INSIGHT
  // --------------------------------------------------

  if (interviews > 0) {
    insights.push({
      icon: MessageSquare,
      title: "Interview preparation",
      text: `You currently have ${interviews} interview${
        interviews === 1 ? "" : "s"
      } in your application pipeline. Use the AI Career section to prepare.`,
      action: () => navigate("/ai-career"),
    });
  } else if (offers > 0) {
    insights.push({
      icon: MessageSquare,
      title: "Offer progress",
      text: `You currently have ${offers} offer${
        offers === 1 ? "" : "s"
      } in your tracker. Keep your application records up to date.`,
      action: () => navigate("/applications"),
    });
  } else {
    insights.push({
      icon: MessageSquare,
      title: "Prepare for interviews",
      text: "Use the AI Career Assistant to practice interview questions and improve your preparation.",
      action: () => navigate("/ai-career"),
    });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            <Sparkles size={17} />
          </div>

          <div>
            <h3 className="font-semibold">
              AI Career Insights
            </h3>

            <p className="text-xs text-zinc-600">
              Based on your current activity
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/ai-career")}
          className="text-zinc-600 transition hover:text-white"
          aria-label="Open AI Career Assistant"
        >
          <ArrowRight size={17} />
        </button>
      </div>

      {/* INSIGHTS */}

      <div className="mt-6 space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;

          return (
            <button
              key={`${insight.title}-${index}`}
              onClick={insight.action}
              className="group w-full rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.05]"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 text-zinc-500">
                  <Icon size={17} />
                </div>

                <div>
                  <h4 className="text-sm font-medium">
                    {insight.title}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    {insight.text}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AIInsights;