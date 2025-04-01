import { env } from "@/env";
import { routes } from "./routes";

export const imageSources = {
  classifiedPlaceholder:"https://autohive-motors.imgix.net/uploads/AdobeStock_855683950.jpeg"
};

export const CLASSIFIEDS_PER_PAGE = 3;

export const navLinks = [
	{ id: 1, href: routes.home, label: "Home" },
	{ id: 2, href: routes.inventory, label: "Inventory" },
];