"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/tc-calculator";

interface CompanyChartsProps {
  levelDistribution: { level: string; count: number; avgTc: number }[];
  tcByYoe: { yearsOfExp: number; avgTc: number }[];
  cityDistribution: { city: string; count: number }[];
  currency: string;
}

export default function CompanyCharts({
  levelDistribution,
  tcByYoe,
  cityDistribution,
  currency,
}: CompanyChartsProps) {
  // Tooltip Formatter
  const formatTooltip = (value: any) => [
    formatCurrency(Number(value) || 0, currency),
    "Total Comp",
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Chart 1: TC by Level */}
      <div className="rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">
          Average Total Compensation by Level
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={levelDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
              <XAxis
                dataKey="level"
                stroke="#9999AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9999AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCurrency(val, currency)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111118",
                  borderColor: "#2A2A35",
                  borderRadius: "8px",
                }}
                labelClassName="text-text-primary font-bold text-sm"
                itemStyle={{ color: "#00D97E", fontFamily: "monospace" }}
                formatter={formatTooltip}
              />
              <Bar dataKey="avgTc" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {levelDistribution.map((entry, index) => {
                  let color = "#3B82F6"; // default blue
                  const lvl = entry.level.toLowerCase();
                  if (lvl.includes("l5") || lvl.includes("senior")) color = "#F59E0B"; // gold
                  if (lvl.includes("l6") || lvl.includes("staff") || lvl.includes("principal")) color = "#00D97E"; // green
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: TC by YoE */}
      <div className="rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary mb-4">
          Average Total Compensation by Experience
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tcByYoe} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
              <XAxis
                dataKey="yearsOfExp"
                stroke="#9999AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val} yrs`}
              />
              <YAxis
                stroke="#9999AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCurrency(val, currency)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111118",
                  borderColor: "#2A2A35",
                  borderRadius: "8px",
                }}
                labelClassName="text-text-primary font-bold text-sm"
                itemStyle={{ color: "#3B82F6", fontFamily: "monospace" }}
                formatter={formatTooltip}
              />
              <Line
                type="monotone"
                dataKey="avgTc"
                stroke="#00D97E"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 4, stroke: "#111118", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: City Distribution */}
      <div className="rounded-xl border border-bg-border bg-bg-card p-6 shadow-sm lg:col-span-2">
        <h3 className="text-base font-bold text-text-primary mb-4">Submissions by City</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={cityDistribution}
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" horizontal={false} />
              <XAxis
                type="number"
                stroke="#9999AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="city"
                stroke="#9999AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111118",
                  borderColor: "#2A2A35",
                  borderRadius: "8px",
                }}
                labelClassName="text-text-primary font-bold text-sm"
                itemStyle={{ color: "#3B82F6" }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
