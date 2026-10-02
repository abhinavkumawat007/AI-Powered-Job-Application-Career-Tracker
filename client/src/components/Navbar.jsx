import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            ✦
          </div>

          <span className="text-lg font-semibold tracking-tight">
            CareerAI
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How it works
          </a>

          <a
            href="#about"
            className="transition hover:text-white"
          >
            About
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Get Started

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;