import { env } from "@/env";
import { routes } from "./routes";
import { ClassifiedStatus, CustomerStatus } from "@prisma/client";
import type { BadgeProps } from "@/components/ui/badge";

export const imageSources = {
  classifiedPlaceholder:"https://autohive-motors.imgix.net/uploads/AdobeStock_855683950.jpeg",
  carLineup:"https://autohive-motors.imgix.net/uploads/AdobeStock_197763326.jpeg",
  featureSection:"https://autohive-motors.imgix.net/uploads/AdobeStock_549957876.jpeg"
};

export const CLASSIFIEDS_PER_PAGE = 7;

export const navLinks = [
	{ id: 1, href: routes.home, label: "Home" },
	{ id: 2, href: routes.inventory, label: "Inventory" },
];

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const MAX_IMAGE_SIZE = 20 * 1000 * 1000; // 2mb
export const MAX_IMAGES = 20;

export const sortOrder = ["asc", "desc"] as const;

export const ClassifiedBadgeMap: Record<
	ClassifiedStatus,
	BadgeProps["variant"]
> = {
	[ClassifiedStatus.DRAFT]: "secondary",
	[ClassifiedStatus.LIVE]: "default",
	[ClassifiedStatus.SOLD]: "destructive",
};

export const CustomerBadgeMap: Record<CustomerStatus, BadgeProps["variant"]> = {
	[CustomerStatus.COLD]: "secondary",
	[CustomerStatus.CONTACTED]: "default",
	[CustomerStatus.INTERESTED]: "destructive",
	[CustomerStatus.PURCHASED]: "warning",
	[CustomerStatus.SUBSCRIBER]: "info",
};
