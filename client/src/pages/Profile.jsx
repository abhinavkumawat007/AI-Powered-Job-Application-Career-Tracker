import { useEffect, useState } from "react";
import {
    UserRound,
    MapPin,
    BriefcaseBusiness,
    Settings,
    Mail,
    Code2,
    ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5001/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(response.data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
            } catch (error) {
                console.error(
                    "Failed to load profile:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-sm text-zinc-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-sm text-red-400">
                    {error}
                </p>
            </div>
        );
    }

    const skills =
        user?.profile?.skills || [];

    const firstName =
        user?.name?.charAt(0)?.toUpperCase() ||
        "U";

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <main className="mx-auto max-w-4xl px-6 py-10">
                {/* Header */}

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-zinc-600">
                            Career workspace
                        </p>

                        <h1 className="mt-1 text-3xl font-semibold">
                            Profile
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Your professional profile information.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/settings")
                        }
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
                    >
                        <Settings size={16} />
                        Edit Profile
                    </button>
                </div>

                {/* Profile Card */}

                <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-semibold text-black">
                            {firstName}
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold">
                            {user?.name}
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            {user?.profile?.headline ||
                                "Career Explorer"}
                        </p>
                    </div>

                    {/* Information */}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                            <div className="flex items-center gap-3">
                                <Mail
                                    size={17}
                                    className="text-zinc-500"
                                />

                                <div>
                                    <p className="text-xs text-zinc-600">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm text-zinc-300">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                            <div className="flex items-center gap-3">
                                <MapPin
                                    size={17}
                                    className="text-zinc-500"
                                />

                                <div>
                                    <p className="text-xs text-zinc-600">
                                        Location
                                    </p>

                                    <p className="mt-1 text-sm text-zinc-300">
                                        {user?.profile?.location ||
                                            "Not added"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}

                    <div className="mt-6">
                        <div className="flex items-center gap-2">
                            <BriefcaseBusiness
                                size={17}
                                className="text-zinc-500"
                            />

                            <h3 className="text-sm font-medium">
                                Skills
                            </h3>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-600">
                                    No skills added yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Links */}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <a
                            href={
                                user?.profile?.github || "#"
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.05]"
                        >
                            <Code2
                                size={18}
                                className="text-zinc-500"
                            />

                            <div>
                                <p className="text-xs text-zinc-600">
                                    GitHub
                                </p>

                                <p className="mt-1 text-sm text-zinc-300">
                                    {user?.profile?.github ||
                                        "Not added"}
                                </p>
                            </div>
                        </a>

                        <a
                            href={
                                user?.profile?.linkedin || "#"
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.05]"
                        >
                            <ExternalLink
  size={18}
  className="text-zinc-500"
/>

                            <div>
                                <p className="text-xs text-zinc-600">
                                    LinkedIn
                                </p>

                                <p className="mt-1 text-sm text-zinc-300">
                                    {user?.profile?.linkedin ||
                                        "Not added"}
                                </p>
                            </div>
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Profile;