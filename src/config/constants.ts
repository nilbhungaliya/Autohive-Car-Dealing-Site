import { env } from "@/env";
import { routes } from "./routes";

export const imageSources = {
  classifiedPlaceholder:"https://autohive-motors.imgix.net/uploads/AdobeStock_855683950.jpeg",
  carLineup:"https://autohive-motors.imgix.net/uploads/AdobeStock_197763326.jpeg",
  featureSection:"https://autohive-motors.imgix.net/uploads/AdobeStock_549957876.jpeg"
};

export const CLASSIFIEDS_PER_PAGE = 3;

export const navLinks = [
	{ id: 1, href: routes.home, label: "Home" },
	{ id: 2, href: routes.inventory, label: "Inventory" },
];

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;