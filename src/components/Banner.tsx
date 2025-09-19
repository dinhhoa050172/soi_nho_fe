"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import asset_Image from "@/asset/index";

export function Banner() {
  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const banners = [
    asset_Image.banner_1,
    asset_Image.banner_2,
    asset_Image.banner_3,
    asset_Image.banner_4,
    asset_Image.banner_5,
    asset_Image.huongdanbaoquan,
  ];

  return (
    <Carousel plugins={[plugin.current]} className="w-full">
      <CarouselContent>
        {banners.map((src, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] relative">
              <Image
                src={src}
                alt={`banner-${index}`}
                fill
                className="object-cover"
                priority
                quality={60}
                sizes="100vw"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
