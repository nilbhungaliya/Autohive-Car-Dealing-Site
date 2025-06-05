"use client";

import type { ChartDataType } from "@/app/admin/dashboard/page";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Suspense, use } from "react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	type TooltipProps,
	XAxis,
	YAxis,
} from "recharts";

interface SalesChartProps {
	data: ChartDataType;
}

const SalesChartContent = (props: SalesChartProps) => {
	const { data } = props;

	const chartData = use(data);

	return (
		<Card className="mb-6 bg-card border-border">
			<CardHeader>
				<CardTitle className="text-foreground">
					Monthly Sales {new Date().getFullYear() - 1}/
					{new Date().getFullYear()}
				</CardTitle>
				<CardDescription className="text-muted-foreground">
					Number of cars sold per month
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={500}>
					<BarChart data={chartData}>
						<XAxis
							dataKey="month"
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) =>
								formatPrice({ price: value, currency: "GBP" })
							}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{ fill: "transparent" }}
						/>
						<Bar
							dataKey="sales"
							fill="hsl(var(--primary))"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export const SalesChart = (props: SalesChartProps) => {
	return (
		<Suspense fallback={
			<Card className="mb-6 bg-card border-border animate-pulse">
				<CardHeader>
					<div className="h-6 w-48 bg-muted rounded" />
					<div className="h-4 w-64 bg-muted rounded mt-2" />
				</CardHeader>
				<CardContent>
					<div className="h-[500px] w-full bg-muted rounded" />
				</CardContent>
			</Card>
		}>
			<SalesChartContent {...props} />
		</Suspense>
	);
};

const CustomTooltip = ({
	active,
	payload,
	label,
}: TooltipProps<number, string>) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-card border border-border p-2 rounded">
				<p className="text-foreground">
					{`${label}: ${formatPrice({ price: payload[0].value as number, currency: "GBP" })}`}
				</p>
			</div>
		);
	}
};