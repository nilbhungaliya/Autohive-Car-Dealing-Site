"use client";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { SelectAdmin } from "@/components/ui/selectAdmin";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { AwaitedPageProps, FilterOptions } from "@/config/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect } from "react";

const itemsPerPageOptions: FilterOptions<string, string> = [
	{ label: "10", value: "10" },
	{ label: "25", value: "25" },
	{ label: "50", value: "50" },
	{ label: "100", value: "100" },
];

interface AdminTableFooterProps extends AwaitedPageProps {
    baseURL: string,
    disabled: boolean,
    totalPages: number,
    cols: number,
}

export const AdminTableFooter = (props: AdminTableFooterProps) => {
    const { disabled, totalPages, baseURL, cols, searchParams } = props;
    const itemsPerPage = searchParams?.itemsPerPage as "10" | "25" | "50" | "100" ?? 10;
    const router = useRouter();

    const handleItemsPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set(e.target.name, e.target.value);
        const url = new URL(window.location.href);
        url.search = currentUrlParams.toString();
        router.push(url.toString());
    }

    useEffect(() => {
		const currentUrlParams = new URLSearchParams(window.location.search);
		currentUrlParams.set("itemsPerPage", itemsPerPage as string);
		const url = new URL(window.location.href);
		url.search = currentUrlParams.toString();
		router.push(url.toString());
	}, [router, itemsPerPage]);

    return (
		<TableFooter className="border-primary-800 bg-primary-900">
			<TableRow className="bg-primary-900 hover:bg-transparent">
				<TableCell colSpan={cols}>
					<div className="flex items-center">
						<SelectAdmin
							name="itemsPerPage"
							value={searchParams?.itemsPerPage as string}
							onChange={handleItemsPerPage}
							options={itemsPerPageOptions}
							disabled={disabled}
							className="-mt-1"
							noDefault={false}
							selectClassName="bg-primary-800 text-muted-foreground border-primary-800"
						/>
						<CustomPagination
							totalPages={totalPages}
							baseURL={baseURL}
							styles={{
								paginationRoot: "justify-end text-muted-foreground",
								paginationPrevious:
									"border-none hover:bg-primary-800 text-muted-foreground",
								paginationNext: "hover:bg-primary-800 text-muted-foreground",
								paginationLink: "border-none hover:bg-primary-800 text-muted-foreground",
								paginationLinkActive: "bg-primary-800 !text-foreground",
							}}
						/>
					</div>
				</TableCell>
			</TableRow>
		</TableFooter>
	);
        
}
