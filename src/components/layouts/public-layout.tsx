"use client"

import type { PropsWithChildren } from "react";
import { PublicHeader } from "./header";
import { PublicFooter } from "./footer";
import { motion } from "framer-motion";

export const PublicLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="relative min-h-screen">
            <PublicHeader />
            <motion.main 
                className="relative z-10 mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>
            <PublicFooter />
        </div>
    )
}
