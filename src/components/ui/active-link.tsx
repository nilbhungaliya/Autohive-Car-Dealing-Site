"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

interface ActiveLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

const ActiveLinkContent = (props: ActiveLinkProps) => {
	const { href, children, className } = props;
	const pathname = usePathname();
	const isActive = href === pathname;

	return (
		<Link
			href={href}
			className={cn(
				className,
				isActive
					? "bg-primary text-foreground hover:bg-primary"
					: "text-foreground hover:bg-muted-foreground",
			)}
		>
			{children}
		</Link>
	);
};

export const ActiveLink = (props: ActiveLinkProps) => {
	return (
		<Suspense fallback={
			<div className={cn(props.className, "animate-pulse bg-card rounded")}>
				{props.children}
			</div>
		}>
			<ActiveLinkContent {...props} />
		</Suspense>
	);
};