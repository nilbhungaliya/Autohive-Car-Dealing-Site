"use client";
import { routes } from "@/config/routes";
import {
  ClassifiedWithImages,
  MultiStepFormEnum,
} from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { HtmlParser } from "../shared/html-parser";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";
import { Button } from "../ui/button";
import { FavouriteButton } from "./favourite-button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { formatColour, formatFuelType, formatNumber, formatOdometerUnit, formatTransmission } from "@/lib/utils";
import { ImgixImage } from "../ui/imgix-image";

interface ClassifiedCardProps {
  classified: ClassifiedWithImages;
  favourites: number[];
}

const getKeyClassifiedInfo = (classified: ClassifiedWithImages) => {
  return [
    {
      id: "odoReading",
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(
        classified.odoUnit
      )}`,
    },
    {
      id: "transmission",
      icon: <Cog className="w-4 h-4" />,
      value: classified?.transmission
        ? formatTransmission(classified.transmission)
        : null,
    },
    {
      id: "fuelType",
      icon: <Fuel className="w-4 h-4" />,
      value: classified?.fuelType ? formatFuelType(classified.fuelType) : null,
    },
    {
      id: "colour",
      icon: <Paintbrush2 className="w-4 h-4" />,
      value: classified?.colour ? formatColour(classified.colour) : null,
    },
  ];
};

export const ClassifiedCard = (props: ClassifiedCardProps) => {
  const { classified, favourites } = props;
  const pathname = usePathname();
  const [isFavourite, setIsFavourite] = useState(
    favourites.includes(classified.id)
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isFavourite && pathname === routes.favourites) setIsVisible(false);
  }, [isFavourite, pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-card text-card-foreground relative rounded-xl shadow-sm overflow-hidden flex flex-col border hover:shadow-md transition-all duration-200"
        >
          <div className="aspect-[4/3] relative bg-muted/30">
            <Link href={routes.singleClassified(classified.slug)} className="block w-full h-full">
              <ImgixImage
                placeholder="blur"
                blurDataURL={classified.images[0].blurhash}
                src={classified.images[0].src}
                alt={classified.images[0].alt}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                fill={true}
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            <FavouriteButton isFavourite={isFavourite} setIsFavourite={setIsFavourite} id={classified.id}/>
            <div className="absolute top-3 right-3 bg-primary/95 text-primary-foreground font-medium px-3 py-1.5 rounded-lg shadow-md">
              <p className="text-sm lg:text-base font-semibold">
              &#8377;{classified.price}
              </p>
            </div>
          </div>
          <div className="p-5 flex flex-col space-y-4">
            <Link
              href={routes.singleClassified(classified.slug)}
              className="text-foreground text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
            >
              {classified.title}
            </Link>
            {classified?.description && (
              <div className="text-sm text-muted-foreground/90 line-clamp-2">
                <HtmlParser html={classified.description} />
              </div>
            )}

            <ul className="grid grid-cols-2 gap-3 text-muted-foreground">
              {getKeyClassifiedInfo(classified)
                .filter((v) => v.value)
                .map(({ id, icon, value }) => (
                  <li
                    key={id}
                    className="text-sm flex items-center gap-x-2"
                  >
                    <span className="text-primary/80">{icon}</span>
                    <span className="truncate">{value}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="p-5 pt-0 flex flex-col lg:flex-row gap-3 justify-center">
            <Button
              className="flex-1 h-10 text-sm font-medium transition-colors hover:bg-primary hover:text-white"
              asChild
              variant="outline"
              size="sm"
            >
              <Link
                href={routes.reserve(classified.slug, MultiStepFormEnum.WELCOME)}
              >
                Reserve
              </Link>
            </Button>

            <Button
              className="flex-1 h-10 text-sm font-medium"
              asChild
              size="sm"
            >
              <Link href={routes.singleClassified(classified.slug)}>
                View Details
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
