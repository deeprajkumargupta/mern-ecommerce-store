import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Separator } from "@/components/ui/separator";

function ProductCard({product}) {
  return (
    <Card key={product.id} className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {product.images.length > 1 ? (
          <div className="relative">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img}
                      alt={product.title}
                      className=" rounded-md w-full h-48 object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0.1" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        ) : (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="rounded-md w-full h-48 object-cover"
          />
        )}
        <Separator/>
        <Link to={`/product/${product.id}`}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </Link>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
