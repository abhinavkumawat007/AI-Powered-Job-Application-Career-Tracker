import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
} from "lucide-react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-20">

        <div className="w-full max-w-md">

          {/* Logo */}
          <Link
            to="/"
            className="mb-10 flex items-center justify-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              ✦
            </div>

            <span className="text-xl font-semibold">
              CareerAI
            </span>
          </Link>


          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl sm:p-10">

            {/* Header */}
            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles size={20} />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Continue your career journey with AI.
              </p>

            </div>


            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/30 focus:bg-white/[0.07]"
                />
              </div>


              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm text-zinc-400">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-zinc-500 transition hover:text-white"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/30 focus:bg-white/[0.07]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </form>


            {/* Register */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-white hover:underline"
              >
                Create one
              </Link>
            </p>

          </div>


          <p className="mt-6 text-center text-xs text-zinc-700">
            By continuing, you agree to CareerAI's Terms and Privacy Policy.
          </p>

        </div>

      </div>

    </main>
  );
}

export default Login;






