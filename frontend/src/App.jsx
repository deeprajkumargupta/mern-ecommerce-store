import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
// import { CartContext } from "./context/CartContext";
import { Button } from "./components/ui/button";
import { useSelector } from "react-redux";
import { useAuth } from "./context/AuthContext";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  // const { cart } = useContext(CartContext);
  const cart = useSelector((state) => state.cart.cartItems);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">My Store</h1>
          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition">
              <Button>Products</Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="relative">
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 text-xs bg-red-500 text-white rounded-sm px-2 py-0.5">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <>
                <span className="text-sm">Hi, {user.username}</span>

                <Link to="/profile">
                  <Button variant="secondary">Profile</Button>
                </Link>

                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
            
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 My Store</p>
      </footer>
    </div>
  );
}

export default App;
