import { useEffect, useState } from "react";
import axios from "axios";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react";

const API_URL = "http://localhost:5001/api/applications";

function AICareer() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);

    const handleAskAI = async () => {
        if (!question.trim() || aiLoading) return;

        const currentQuestion = question.trim();

        const userMessage = {
            role: "user",
            content: currentQuestion,
        };

        setMessages((prev) => [...prev, userMessage]);
        setQuestion("");
        setAiLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5001/api/ai/career",
                {
                    question: currentQuestion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const aiMessage = {
                role: "assistant",
                content: response.data.answer,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI request failed:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't process your request right now.",
                },
            ]);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
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

        fetchApplications();
    }, []);

    const totalApplications = applications.length;

    const interviews = applications.filter(
        (application) =>
            application.status?.toLowerCase() === "interview"
    ).length;

    const offers = applications.filter(
        (application) =>
            application.status?.toLowerCase() === "offer"
    ).length;

    const rejected = applications.filter(
        (application) =>
            application.status?.toLowerCase() === "rejected"
    ).length;

    const interviewRate =
        totalApplications > 0
            ? Math.round((interviews / totalApplications) * 100)
            : 0;

    const offerRate =
        totalApplications > 0
            ? Math.round((offers / totalApplications) * 100)
            : 0;

    const mostAppliedRole = getMostAppliedRole(applications);

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="border-b border-white/10 px-6 py-6 lg:px-10">
                <div className="mx-auto max-w-[1500px]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                            <Sparkles size={19} />
                        </div>

                        <div>
                            <p className="text-xs text-zinc-600">
                                Career intelligence
                            </p>

                            <h1 className="text-xl font-semibold">
                                AI Career
                            </h1>
                        </div>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                        Understand your job search performance and discover
                        where you can improve.
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Applications"
                        value={loading ? "..." : totalApplications}
                        description="Total applications"
                        icon={BriefcaseBusiness}
                    />

                    <StatCard
                        title="Interviews"
                        value={loading ? "..." : interviews}
                        description={`${interviewRate}% interview rate`}
                        icon={CalendarDays}
                    />

                    <StatCard
                        title="Offers"
                        value={loading ? "..." : offers}
                        description={`${offerRate}% offer rate`}
                        icon={Target}
                    />

                    <StatCard
                        title="Rejected"
                        value={loading ? "..." : rejected}
                        description="Applications rejected"
                        icon={TrendingUp}
                    />

                </section>

                {/* Insights */}
                <section className="mt-6 grid gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                                <Target size={17} />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Job Search Insights
                                </h2>

                                <p className="text-xs text-zinc-600">
                                    Based on your application history
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">

                            <Insight
                                label="Most applied role"
                                value={mostAppliedRole || "Not enough data"}
                            />

                            <Insight
                                label="Interview rate"
                                value={`${interviewRate}%`}
                            />

                            <Insight
                                label="Offer rate"
                                value={`${offerRate}%`}
                            />

                            <Insight
                                label="Total applications"
                                value={totalApplications}
                            />

                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                                <Sparkles size={17} />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    AI Recommendations
                                </h2>

                                <p className="text-xs text-zinc-600">
                                    Suggestions based on your activity
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">

                            {getRecommendations({
                                totalApplications,
                                interviews,
                                offers,
                            }).map((recommendation, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                                >
                                    <div className="flex gap-3">

                                        <div className="mt-0.5 text-zinc-500">
                                            <ArrowUpRight size={17} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {recommendation.title}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                {recommendation.text}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </section>

                {/* AI Career Assistant */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                            <Sparkles size={18} />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                AI Career Assistant
                            </h2>

                            <p className="mt-1 text-xs text-zinc-600">
                                Get personalized advice based on your job search.
                            </p>
                        </div>

                    </div>

                    {/* Chat */}
                    <div className="min-h-[320px] p-6">

                        <div className="max-w-2xl space-y-4">

                            {/* AI message */}
                            {messages.length === 0 && (
                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black">
                                        <Sparkles size={15} />
                                    </div>

                                    <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3">

                                        <p className="text-sm leading-6 text-zinc-300">
                                            Hi! I'm your AI Career Assistant. Ask me
                                            anything about your job search.
                                        </p>

                                    </div>

                                </div>
                            )}

                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >

                                    {message.role === "assistant" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black">
                                            <Sparkles size={15} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-xl rounded-2xl px-4 py-3 ${message.role === "user"
                                            ? "rounded-tr-sm bg-white text-black"
                                            : "rounded-tl-sm border border-white/10 bg-white/[0.04] text-zinc-300"
                                            }`}
                                    >
                                        <p className="text-sm leading-6">
                                            {message.content}
                                        </p>
                                    </div>

                                </div>
                            ))}

                            {aiLoading && (
                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black">
                                        <Sparkles size={15} />
                                    </div>

                                    <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3">

                                        <p className="text-sm text-zinc-600">
                                            Thinking...
                                        </p>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Input */}
                    <div className="border-t border-white/10 p-4">

                        <div className="flex gap-3">

                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAskAI();
                                    }
                                }}
                                placeholder="Ask about your job search..."
                                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
                            />

                            <button
                                onClick={handleAskAI}
                                disabled={aiLoading || !question.trim()}
                                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {aiLoading ? "Thinking..." : "Ask AI"}
                            </button>

                        </div>

                    </div>

                </section>

            </main>
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                <Icon size={19} className="text-zinc-300" />
            </div>

            <p className="mt-5 text-sm text-zinc-500">
                {title}
            </p>

            <p className="mt-1 text-2xl font-semibold">
                {value}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
                {description}
            </p>

        </div>
    );
}

function Insight({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">

            <span className="text-sm text-zinc-500">
                {label}
            </span>

            <span className="text-sm font-medium">
                {value}
            </span>

        </div>
    );
}

function getMostAppliedRole(applications) {
    if (!applications.length) return null;

    const counts = {};

    applications.forEach((application) => {
        const role = application.role?.trim();

        if (role) {
            counts[role] = (counts[role] || 0) + 1;
        }
    });

    return Object.entries(counts).sort(
        (a, b) => b[1] - a[1]
    )[0]?.[0];
}

function getRecommendations({
    totalApplications,
    interviews,
    offers,
}) {
    const recommendations = [];

    if (totalApplications === 0) {
        recommendations.push({
            title: "Start tracking your applications",
            text: "Add your first job application so the system can analyze your job search.",
        });
    }

    if (totalApplications > 0 && interviews === 0) {
        recommendations.push({
            title: "Improve your application strategy",
            text: "You haven't reached the interview stage yet. Review your resume and tailor it to each job description.",
        });
    }

    if (totalApplications >= 5 && interviews > 0) {
        recommendations.push({
            title: "Prepare for interviews",
            text: "You're reaching the interview stage. Focus on technical and behavioral interview preparation.",
        });
    }

    if (interviews > 0 && offers === 0) {
        recommendations.push({
            title: "Focus on interview conversion",
            text: "You are getting interviews but no offers yet. Practice explaining projects, problem solving, and behavioral questions.",
        });
    }

    if (offers > 0) {
        recommendations.push({
            title: "Keep your momentum",
            text: "You've received an offer. Continue tracking your applications and comparing opportunities.",
        });
    }

    return recommendations.slice(0, 3);
}

export default AICareer;