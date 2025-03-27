"use client";
import { routes } from "@/config/routes";
import {
  ClassifiedWithImages,
  favourites,
  MultiStepForEnum,
} from "@/config/types";
import {
  Classified,
  Colour,
  FuelType,
  OdoUnit,
  Transmission,
  type Prisma,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { HtmlParser } from "../shared/html-parser";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";
import { Button } from "../ui/button";
import { FavouriteButton } from "./favourite-button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface ClassifiedCardProps {
  classified: ClassifiedWithImages;
  favourites: number[];
}

function formatNumber(num: number | null, options?: Intl.NumberFormatOptions) {
  if (!num) return "0";
  return new Intl.NumberFormat("en-GB", options).format(num);
}

function formatOdometerUnit(unit: OdoUnit) {
  return unit === OdoUnit.MILES ? "mi" : "km";
}

function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Auto" : "Manual";
}

function formatFuelType(fuel: FuelType) {
  switch (fuel) {
    case FuelType.DIESEL:
      return "Diesel";
    case FuelType.ELECTRIC:
      return "Electric";
    case FuelType.HYBRID:
      return "Hybrid";
    case FuelType.PETROL:
      return "Petrol";
    default:
      return "Unknown";
  }
}

function formatColour(colour: Colour) {
  switch (colour) {
    case Colour.BLACK:
      return "Black";
    case Colour.BLUE:
      return "Blue";
    case Colour.BROWN:
      return "Brown";
    case Colour.GOLD:
      return "Gold";
    case Colour.GREEN:
      return "Green";
    case Colour.GREY:
      return "Grey";
    case Colour.ORANGE:
      return "Orange";
    case Colour.PINK:
      return "Pink";
    case Colour.PURPLE:
      return "Purple";
    case Colour.RED:
      return "Red";
    case Colour.SILVER:
      return "Silver";
    case Colour.WHITE:
      return "White";
    case Colour.YELLOW:
      return "Yellow";
    default:
      return "Unknown";
  }
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
          className="bg-white relative rounded-md shadow-md overflow-hidden flex flex-col"
        >
          <div className="aspect-3/2 relative">
            <Link href={routes.singleClassified(classified.slug)}>
              <Image
                placeholder="blur"
                blurDataURL={classified.images[0].blurhash}
                src={classified.images[0].src}
                alt={classified.images[0].alt}
                className="object-cover"
                fill={true}
                quality={25}
              />
            </Link>
            <FavouriteButton isFavourite={isFavourite} setIsFavourite={setIsFavourite} id={classified.id}/>
            <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bolt px-2 py-1 rounded">
              <p className="text-xs lg:text-base xl:text-lg font-semibold">
                {classified.price}
              </p>
            </div>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <Link
              href={routes.singleClassified(classified.slug)}
              className="text-black text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
            >
              {classified.title}
            </Link>
            {classified?.description && (
              <div className="text-xs md:text-sm xl:text-base text-gray-500 line-clamp-2">
                <HtmlParser html={classified.description} />
                &nbsp;{" "}
                {/* Used for equal spacing across each card in the grid */}
              </div>
            )}

            <ul className="xl:grid-cols-2 xl:grid-rows-2 xl:pb-2 md:text-xs text-gray-600 grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-2 lg:grid-rows-4 items-center justify-between w-full gap-1">
              {getKeyClassifiedInfo(classified)
                .filter((v) => v.value)
                .map(({ id, icon, value }) => (
                  <li
                    key={id}
                    className="text-xs self-baseline flex  items-center gap-x-1.5"
                  >
                    {icon}
                    {value}
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex flex-col lg:flex-col space-y-2 lg:space-y-2 lg:gap-x-2 w-full ">
            <Button
              className="flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base text-black"
              asChild
              variant="outline"
              size="sm"
            >
              <Link
                href={routes.reserve(classified.slug, MultiStepForEnum.WELCOME)}
              >
                Reserve
              </Link>
            </Button>

            <Button
              className="flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
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
