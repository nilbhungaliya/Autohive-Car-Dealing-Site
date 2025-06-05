"use client"

import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { HeartIcon, MenuIcon, User } from "lucide-react";
import { SignOutForm } from "../auth/sign-out";
import { ModernLogo } from "../ui/modern-logo";
import { ThemeToggle } from "../ui/theme-toggle";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Favourites } from "@/config/types";

interface HeaderClientProps {
    navLinks: Array<{ id: number; label: string; href: string }>;
    routes: any;
}

export const HeaderClient = ({ navLinks, routes }: HeaderClientProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [favourites, setFavourites] = useState<Favourites | null>(null);
    const [favouriteCount, setFavouriteCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // For now, we'll use mock data or localStorage for favourites
    useEffect(() => {
        // Check localStorage for favourites count
        const storedFavourites = localStorage.getItem('favourites');
        if (storedFavourites) {
            try {
                const parsed = JSON.parse(storedFavourites);
                setFavouriteCount(parsed.length || 0);
            } catch (error) {
                setFavouriteCount(0);
            }
        }
    }, []);

    return (
        <motion.header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? "glass border-b border-white/20 backdrop-blur-md" 
                    : "bg-transparent"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.div 
                        className="flex items-center flex-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Link href="/">
                            <ModernLogo size="md" />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <Link
                                    href={link.href}
                                    className="relative group font-heading font-semibold text-foreground hover:text-primary transition-colors duration-300"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 ml-5">
                        <ThemeToggle />
                        
                        {session ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={routes.admin.dashboard} className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </Button>
                                <SignOutForm />
                            </div>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="relative group"
                                >
                                    <Link href={routes.favourites}>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 group-hover:from-pink-600 group-hover:to-rose-600 transition-all duration-300 shadow-lg group-hover:shadow-pink-500/25">
                                            <HeartIcon className="w-5 h-5 text-white" />
                                        </div>
                                        {favouriteCount > 0 && (
                                            <motion.div 
                                                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                {favouriteCount}
                                            </motion.div>
                                        )}
                                    </Link>
                                </Button>
                            </motion.div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <MenuIcon className="h-6 w-6" />
                                    <SheetTitle className="sr-only">Toggle navigation menu</SheetTitle>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full max-w-sm glass border-white/20">
                                <div className="flex flex-col space-y-6 mt-8">
                                    <ModernLogo size="sm" />
                                    <nav className="flex flex-col space-y-4">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.id}
                                                href={link.href}
                                                className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                                            >
                                                <span className="font-medium">{link.label}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                    {session && (
                                        <div className="pt-4 border-t border-white/20">
                                            <Link
                                                href={routes.admin.dashboard}
                                                className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                                            >
                                                <User className="h-5 w-5" />
                                                <span className="font-medium">Dashboard</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};