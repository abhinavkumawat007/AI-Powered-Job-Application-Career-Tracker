import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">
      
      <div className="flex items-start justify-between">
        
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Icon size={19} className="text-zinc-300" />
        </div>

        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <ArrowUpRight size={13} />
            {trend}
          </div>
        )}

      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {description}
      </p>

    </div>
  );
}

export default StatCard;