import React from "react";
// import { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";

function CartItemCard({ item }) {
  const dispatch = useDispatch();

  return (
    <Card key={item.id}>
      <CardContent className="p-6 flex flex-col sm:flex-row gap-6 sm:items-center">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-24 h-24 object-contain rounded-lg dark:bg-foreground"
        />
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold">{item.title}</h4>
          <p className="text-sm text-muted-foreground">${item.price}</p>

          <div className="flex items-center gap-3 mt-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                dispatch(decreaseQuantity(item.id));
              }}
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                dispatch(increaseQuantity(item.id));
              }}
            >
              +
            </Button>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => {
            dispatch(removeFromCart(item.id));
          }}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
}

export default CartItemCard;
