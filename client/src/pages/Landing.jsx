import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

      {/* Hero */}
      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-20">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
              <Sparkles size={15} />

              AI-powered career management
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your career,
              <span className="block bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Track your applications, analyze your resume, discover skill
              gaps, and prepare for interviews — all from one intelligent
              workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200">
                Start building your career

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur transition hover:bg-white/10">
                See how it works
              </button>

            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-zinc-500">

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Resume analysis
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Smart job matching
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Interview prep
              </div>

            </div>

          </div>


          {/* Right — AI dashboard preview */}
          <div className="relative">

            <div className="absolute -inset-10 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl">

              {/* Fake browser header */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">

                <div className="h-3 w-3 rounded-full bg-red-400/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <div className="h-3 w-3 rounded-full bg-green-400/70" />

                <div className="ml-3 h-6 flex-1 rounded-md bg-white/5" />

              </div>


              <div className="p-5">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">
                      Good morning
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Your Career Overview
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    ✦
                  </div>
                </div>


                {/* Score */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm text-zinc-500">
                        Career Score
                      </p>

                      <p className="mt-1 text-4xl font-semibold">
                        82
                        <span className="text-lg text-zinc-500">
                          /100
                        </span>
                      </p>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20">
                      <span className="text-sm font-medium">
                        82%
                      </span>
                    </div>

                  </div>

                </div>


                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">

                  <div className="rounded-xl bg-white/[0.04] p-4">
                    <p className="text-xs text-zinc-500">
                      Applications
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      32
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-4">
                    <p className="text-xs text-zinc-500">
                      Interviews
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      7
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-4">
                    <p className="text-xs text-zinc-500">
                      Offers
                    </p>

                    <p className="mt-2 text-xl font-semibold">
                      2
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section
        id="features"
        className="border-t border-white/10 px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-zinc-500">
              EVERYTHING IN ONE PLACE
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Your entire job search,
              <span className="text-zinc-500">
                {" "}organized.
              </span>
            </h2>

          </div>


          <div className="mt-12 grid gap-4 md:grid-cols-3">

            <FeatureCard
              title="AI Resume Analysis"
              description="Understand your resume, identify missing skills, and get actionable improvements."
            />

            <FeatureCard
              title="Smart Job Matching"
              description="Compare your skills against job requirements and understand exactly where you stand."
            />

            <FeatureCard
              title="Application Tracking"
              description="Keep every application, interview, note, and offer organized in one place."
            />

          </div>

        </div>

      </section>

    </main>
  );
}


function FeatureCard({ title, description }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">

      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
        ✦
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-zinc-500">
        {description}
      </p>

    </div>
  );
}

export default Landing;