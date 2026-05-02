import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
// import { CartContext } from "./context/CartContext";
import { Button } from "./components/ui/button";
import { useSelector } from "react-redux";
import { useAuth } from "./context/AuthContext";
import { ModeToggle } from "./components/mode-toggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function App() {
  // const { cart } = useContext(CartContext);
  const cart = useSelector((state) => state.cart.cartItems);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
            My Store
          </h1>
          <nav className="hidden md:flex items-center gap-4">
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
                <span className="text-sm hidden lg:block">
                  Hi, {user.username}
                </span>

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

          {/* Mobile Right Side */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative">
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-sm">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
                <span className="text-sm max-w-[80px] truncate">Hi, {user.username}</span>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            )}

            {/* Hamburger */}
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Products</Button>
            </Link>

            {user ? (
              <>
                <span className="text-sm">Hi, {user.username}</span>

                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Profile
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            )}

            <ModeToggle />
          </div>
        )}
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
