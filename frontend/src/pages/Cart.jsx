import React, { useContext } from "react";
// import { CartContext } from "../context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItemCard from "@/components/CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";

function Cart() {
  // const { cart, removeFromCart, decreaseQuantity, increaseQuantity } = useContext(CartContext);
  const cart = useSelector((state) => state.cart.cartItems);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-19">
      <h2 className="text-3xl font-bold mb-8">Cart</h2>
      {cart.length === 0 && (
        <p className="text-muted-foreground">No items in cart</p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* ///////////////////// */}
        <div className="md:col-span-2 space-y-6">
          {cart.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

        {/* //////////////// */}
        {cart.length > 0 && (
          <Card className="h-fit">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold">Order Summary</h3>

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Cart;
