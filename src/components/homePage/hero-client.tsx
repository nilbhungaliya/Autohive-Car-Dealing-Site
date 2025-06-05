"use client"

import { motion } from "framer-motion";
import { HomepageTaxonomyFilter } from "./homePage-filter";
import { SearchButton } from "./search-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface HeroClientProps {
  searchParams: any;
  totalFiltersApplied: number;
  isFilterApplied: boolean;
  classifiedsCount: number;
  minMaxResult: any;
  routes: {
    home: string;
    inventory: string;
  };
  backgroundImageUrl: string;
}

export const HeroClient = ({
  searchParams,
  totalFiltersApplied,
  isFilterApplied,
  classifiedsCount,
  minMaxResult,
  routes,
  backgroundImageUrl,
}: HeroClientProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center min-h-screen overflow-hidden bg-transparent"
    >
      {/* Animated Modern Gradient Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 animate-gradient-move"
        style={{
          background: "linear-gradient(120deg, #6366f1 0%, #a21caf 50%, #06b6d4 100%)",
          backgroundSize: "200% 200%",
          opacity: 0.7,
        }}
      /> */}

      {/* Animated Background Overlay */}
      {/* <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      /> */}

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div 
            className="text-center lg:text-left space-y-8"
            variants={itemVariants}
          >
            <motion.div
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
                variants={itemVariants}
              >
                <span className="block gradient-text">Unbeatable</span>
                <span className="block">Deals on</span>
                <span className="block">Premium Cars</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl"
                variants={itemVariants}
              >
                Discover your dream car with our AI-powered search and premium collection
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Button 
                size="lg" 
                className="btn-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-primary-foreground border-0 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Explore Inventory
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass border-border text-foreground hover:bg-muted/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8"
              variants={itemVariants}
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary-foreground">500+</div>
                <div className="text-muted-foreground">Premium Cars</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary-foreground">50+</div>
                <div className="text-muted-foreground">Brands</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary-foreground">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Search Card */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={cardVariants}
          >
            <div className="w-full max-w-md">
              <motion.div 
                className="glass border border-white/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Find Your Car</h3>
                    <p className="text-muted-foreground">Search through our premium collection</p>
                  </div>
                  
                  <div className="space-y-4">
                    <HomepageTaxonomyFilter
                      minMaxValues={minMaxResult}
                      searchParams={searchParams}
                    />
                  </div>
                  
                  <SearchButton count={classifiedsCount} />
                  
                  {isFilterApplied && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="w-full glass border-border text-foreground hover:bg-muted/10"
                      >
                        <Link href={routes.home}>
                          Clear Filters ({totalFiltersApplied})
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-border rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};