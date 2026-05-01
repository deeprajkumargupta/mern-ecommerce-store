import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Oops! Page not found</h2>

      <p className="mt-2 text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-6 flex gap-4">
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
        <Link to="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
