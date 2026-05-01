import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    src={img}
                    alt={product.title}
                    className="w-full h-100 object-contain rounded-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-muted-foreground mt-2">{product.description}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-2xl font-semibold">Price: ${product.price}</p>
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? "Available" : "Out of Stock"}
            </p>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              disabled={product.stock === 0}
              onClick={handleAdd}
              className="flex-1"
            >
              {added ? "Added!" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
