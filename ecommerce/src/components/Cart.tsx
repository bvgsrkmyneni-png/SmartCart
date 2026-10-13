import { useCartStore } from "../store/cartStore";

function Cart() {

    const cartItems = useCartStore(
        (state) => state.cartItems
    );

    const increaseQuantity = useCartStore(
        (state) => state.increaseQuantity
    );

    const decreaseQuantity = useCartStore(
        (state) => state.decreaseQuantity
    );

    const clearCart = useCartStore(
        (state) => state.clearCart
    );

    const total = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    const goToCheckout = () => {
        window.history.pushState({}, "", "/checkout");

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    return (
        <div className="cart">

            <h2>🛒 Shopping Cart</h2>

            {cartItems.length === 0 ? (

                <div className="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to continue shopping.</p>
                </div>

            ) : (

                <>

                    {cartItems.map((item) => (

                        <div
                            className="cart-item"
                            key={item.product.productId}
                        >

                            <img
                                src={item.product.imageUrl}
                                alt={item.product.productName}
                            />

                            <div className="cart-item-details">

                                <h3>
                                    {item.product.productName}
                                </h3>

                                <p>
                                    Price: ₹
                                    {Number(
                                        item.product.price
                                    ).toLocaleString("en-IN")}
                                </p>

                                <div className="quantity-controls">

                                    <button
                                        onClick={() =>
                                            decreaseQuantity(
                                                item.product.productId
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(
                                                item.product.productId
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <p className="cart-subtotal">
                                    Subtotal: ₹
                                    {(
                                        item.product.price *
                                        item.quantity
                                    ).toLocaleString("en-IN")}
                                </p>

                            </div>

                        </div>

                    ))}


                    <div className="cart-summary">

                        <div>
                            <span>Total Amount</span>

                            <h2>
                                ₹{total.toLocaleString("en-IN")}
                            </h2>
                        </div>

                        <div className="cart-actions">

                            <button
                                className="clear-cart-btn"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>

                            <button
                                className="place-order-btn"
                                onClick={goToCheckout}
                            >
                                Place Order →
                            </button>

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}

export default Cart;