import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Lock,
} from "lucide-react";
import axios from "axios";

function Settings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    headline: "",
    location: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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

        const user = response.data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          headline:
            user.profile?.headline || "",
          location:
            user.profile?.location || "",
          skills:
            user.profile?.skills?.join(", ") ||
            "",
          github:
            user.profile?.github || "",
          linkedin:
            user.profile?.linkedin || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5001/api/auth/profile",
        {
          name: form.name,
          headline: form.headline,
          location: form.location,
          skills: form.skills,
          github: form.github,
          linkedin: form.linkedin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setMessage("");
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5001/api/auth/change-password",
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Password changed successfully."
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <SettingsIcon size={18} />
          </div>

          <div>
            <p className="text-xs text-zinc-600">
              Account
            </p>

            <h1 className="text-2xl font-semibold">
              Settings
            </h1>
          </div>
        </div>

        {/* Messages */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        {/* Profile */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">
            Profile Information
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Update your professional information.
          </p>

          <form
            onSubmit={handleSaveProfile}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Email
                </label>

                <input
                  value={form.email}
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Professional Headline
              </label>

              <input
                name="headline"
                value={form.headline}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Jaipur, India"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Skills
                </label>

                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-white/30"
                />

                <p className="mt-1 text-xs text-zinc-600">
                  Separate skills with commas.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">
                  GitHub
                </label>

                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  LinkedIn
                </label>

                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Password */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
              <Lock size={17} />
            </div>

            <div>
              <h2 className="font-semibold">
                Change Password
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Update your account password.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="text-sm font-medium">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  passwordForm.currentPassword
                }
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordForm.newPassword
                }
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              <Lock size={16} />

              {changingPassword
                ? "Updating..."
                : "Change Password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Settings;