import { Sparkles } from "lucide-react";

function ComingSoon({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
          <Sparkles size={24} />
        </div>

        <h1 className="mt-6 text-2xl font-semibold">
          {title}
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}

export default ComingSoon;