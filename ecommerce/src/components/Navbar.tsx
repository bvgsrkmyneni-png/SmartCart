import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

function Navbar() {
    const { user, logout } = useAuthStore();

    const cartItems = useCartStore(
        (state) => state.cartItems
    );

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const goTo = (path: string) => {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <nav className="navbar">

            <div
                className="navbar-brand"
                onClick={() => goTo("/")}
            >
                SmartCart
            </div>

            <div className="navbar-links">

                <button onClick={() => goTo("/")}>
                    Home
                </button>

                {/* CART */}
                <button
                    className="cart-nav-button"
                    onClick={() => goTo("/cart")}
                >
                    🛒 Cart

                    {cartCount > 0 && (
                        <span className="cart-count">
                            {cartCount}
                        </span>
                    )}
                </button>

                {!user && (
                    <>
                        <button onClick={() => goTo("/signin")}>
                            Sign In
                        </button>

                        <button onClick={() => goTo("/signup")}>
                            Sign Up
                        </button>
                    </>
                )}

                {user && user.role === "ADMIN" && (
                    <button onClick={() => goTo("/admin")}>
                        Admin Dashboard
                    </button>
                )}

                {user && (
                    <>
                        <span className="welcome-user">
                            Welcome, {user.name}
                        </span>

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>
                )}

                <button
                    className="theme-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>

            </div>

        </nav>
    );
}

export default Navbar;