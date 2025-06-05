"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const FormHeaderContent = () => {
	const params = useSearchParams();
	const steps = [
		{ id: "1", title: "Welcome" },
		{ id: "2", title: "Select Handover Date" },
		{ id: "3", title: "Submit Details" },
	];

	return (
		<div className="flex justify-between bg-primary p-4 shadow-lg">
			<div className="flex flex-col justify-between flex-1">
				<h1 className="text-3xl font-bold text-primary-foreground">
					{steps.find(({ id }) => params.get("step") === id)?.title}
				</h1>
			</div>
			<div className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground flex-1">
				{steps.map((step) => (
					<div
						className={cn(
							"w-8 h-8 rounded-full flex items-center justify-center border border-border",
							params.get("step") === step.id
								? "bg-background text-foreground"
								: "bg-primary text-primary-foreground"
						)}
						key={step.id}
					>
						{step.id}
					</div>
				))}
			</div>
		</div>
	);
};

export const FormHeader = () => {
	return (
		<Suspense fallback={<div className="h-16 bg-primary animate-pulse" />}>
			<FormHeaderContent />
		</Suspense>
	);
};