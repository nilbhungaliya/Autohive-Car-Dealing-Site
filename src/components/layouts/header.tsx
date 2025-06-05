import { navLinks } from "@/config/constants";
import { HeaderClient } from "./header-client";

export const PublicHeader = () => {
    // Create a static routes object without functions for client component
    const staticRoutes = {
        home: "/",
        favourites: "/favourites",
        inventory: "/inventory",
        signIn: "/auth/sign-in",
        admin: {
            dashboard: "/admin/dashboard",
        }
    };

    return (
        <HeaderClient 
            navLinks={navLinks}
            routes={staticRoutes}
        />
    );
};
