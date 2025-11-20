"use client"

import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CircleCheckIcon, CircleX, Loader2 } from "lucide-react";
import { signInAction } from "@/app/_actions/sign-in";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { ModernLogo } from "../ui/modern-logo";

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button
			disabled={pending}
			type="submit"
			className="w-full uppercase font-bold"
		>
			{pending && (
				<Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
			)}{" "}
			Sign In
		</Button>
	);
};

export const SignInForm = () => {
    const [state, formAction] = useActionState(signInAction, {
		success: false,
		message: "",
	});
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
		if (state.success && formRef.current) {
			router.refresh();
			if (state.redirectTo) {
				router.push(state.redirectTo);
			}
		}
	}, [state, router]);

    return (
		<div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-transparent text-foreground px-4 overflow-hidden">
			<div className="flex justify-center mb-8">
				<ModernLogo size="md" animated />
			</div>
			<div className="w-full max-w-md mx-auto">
				<form
					ref={formRef}
					action={formAction}
					className="border border-border shadow-lg p-10 rounded-xl bg-card"
				>
					<div className="flex items-center mb-6 justify-center">
						<h2 className="uppercase text-2xl font-bold tracking-tight">Admin Sign In</h2>
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								autoComplete="email"
								className="placeholder:text-muted-foreground"
								placeholder="Enter your administrator email address"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								name="password"
								autoComplete="password"
								className="placeholder:text-muted-foreground"
								placeholder="Enter your password"
								required
							/>
						</div>

						<div className="my-6">
							<p className="text-sm text-muted-foreground mb-2 text-center">
								<b>This is for admin only.</b>
							</p>
						</div>
						<div className="space-y-4">
							<SubmitButton />
							{state.success && (
								<div className="flex items-center gap-2 rounded-md text-green-600 dark:text-green-400 p-3 bg-green-100 dark:bg-green-900/20">
									<CircleCheckIcon className="h-5 w-5" />
									<span>Success! {state.message}</span>
								</div>
							)}
							{!state.success && state.message && (
								<div className="flex items-center gap-2 rounded-md text-destructive p-3 bg-destructive/10">
									<CircleX className="h-5 w-5" />
									<span>Error! {state.message}</span>
								</div>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	); 
}
