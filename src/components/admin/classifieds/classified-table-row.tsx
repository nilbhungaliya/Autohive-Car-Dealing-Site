"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatClassifiedStatus, formatColour, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { ClassifiedWithImages } from "@/config/types";
import { Badge } from "@/components/ui/badge";
import { ActionButtons } from "./action-buttons";
import { ClassifiedBadgeMap } from "@/config/constants";

export const ClassifiedsTableRow = (classified: ClassifiedWithImages) => {
	return (
		<TableRow className="text-muted/75 border-white/5 hover:bg-primary-300">
			<TableCell className="font-medium">{classified.id}</TableCell>
			<TableCell className="p-0">
				<Image
					src={classified.images[0].src}
					alt={classified.images[0].alt}
					width={120}
					height={80}
					quality={1}
					className="aspect-3/2 object-cover rounded p-0.5"
				/>
			</TableCell>
			<TableCell className="hidden md:table-cell">{classified.title}</TableCell>
			<TableCell className="hidden md:table-cell">
				{formatPrice({
					price: classified.price,
					currency: classified.currency,
				})}
			</TableCell>
			<TableCell className="hidden md:table-cell">{classified.vrm}</TableCell>
			<TableCell className="hidden md:table-cell">
				{formatColour(classified.colour)}
			</TableCell>
			<TableCell className="hidden md:table-cell">
				<Badge variant={ClassifiedBadgeMap[classified.status]}>
					{formatClassifiedStatus(classified.status)}
				</Badge>
			</TableCell>
			<TableCell className="hidden md:table-cell">
				{format(classified.createdAt, "do MMM yyy HH:mm")}
			</TableCell>
			<TableCell>{classified.views}</TableCell>
			<TableCell className="flex gap-x-2">
				<ActionButtons classified={classified} />
			</TableCell>
		</TableRow>
	);
};