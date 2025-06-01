"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SearchInput } from "../shared/search-input";

const AdminSearchContent = () => {
	const pathname = usePathname();
	return (
		<SearchInput
			placeholder={`Search ${pathname.split("/")[2]}...`}
			className="w-full focus-visible:ring-0 placeholder:text-muted text-muted appearance-none bg-primary-800 border border-primary-800 pl-8"
		/>
	);
};

export const AdminSearch = () => {
	return (
		<Suspense fallback={
			<div className="w-full h-10 bg-primary-800 border border-primary-800 rounded-md animate-pulse" />
		}>
			<AdminSearchContent />
		</Suspense>
	);
};