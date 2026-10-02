import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ApplicationChart({ applications = [] }) {
  // --------------------------------
  // Create last 6 months
  // --------------------------------

  const now = new Date();

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      month: date.toLocaleString("en-US", {
        month: "short",
      }),
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
    });
  }

  // --------------------------------
  // Count applications for each month
  // --------------------------------

  const data = months.map((month) => {

    const count = applications.filter((application) => {

      const applicationDate = new Date(
        application.appliedDate || application.createdAt
      );

      return (
        applicationDate.getMonth() === month.monthIndex &&
        applicationDate.getFullYear() === month.year
      );

    }).length;

    return {
      month: month.month,
      applications: count,
    };
  });


  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <div className="mb-6">

        <h3 className="font-semibold">
          Application activity
        </h3>

        <p className="mt-1 text-xs text-zinc-600">
          Applications submitted over the last 6 months
        </p>

      </div>


      <div className="h-[280px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="applicationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#ffffff"
                  stopOpacity={0.18}
                />

                <stop
                  offset="100%"
                  stopColor="#ffffff"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>


            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#52525b",
                fontSize: 12,
              }}
            />


            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{
                fill: "#52525b",
                fontSize: 12,
              }}
            />


            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
                color: "#fff",
              }}
            />


            <Area
              type="monotone"
              dataKey="applications"
              stroke="#ffffff"
              strokeWidth={2}
              fill="url(#applicationGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ApplicationChart;