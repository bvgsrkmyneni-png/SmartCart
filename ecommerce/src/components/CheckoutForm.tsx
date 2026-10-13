import { useState } from "react";

import {
    useForm
} from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    checkoutSchema,
    type CheckoutFormData
} from "../schemas/checkoutSchema";

import {
    useCartStore
} from "../store/cartStore";

import {
    createOrder,
    createPayment,
    verifyPayment
} from "../api/paymentApi";


declare global {
    interface Window {
        Razorpay: any;
    }
}


function CheckoutForm() {

    const [orderSuccess, setOrderSuccess] =
        useState(false);

    const [isProcessing, setIsProcessing] =
        useState(false);


    const cartItems = useCartStore(
        (state) => state.cartItems
    );

    const getTotal = useCartStore(
        (state) => state.getTotal
    );

    const clearCart = useCartStore(
        (state) => state.clearCart
    );


    const total = getTotal();


    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(
            checkoutSchema
        )
    });


    const onSubmit = async (
        data: CheckoutFormData
    ) => {

        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        try {

            setIsProcessing(true);


            // 1. Create order in Spring Boot
            const order = await createOrder(

                cartItems.map((item) => ({
                    productId:
                        item.product.productId,

                    quantity:
                        item.quantity
                }))

            );


            // 2. Create Razorpay order
            const payment =
                await createPayment(
                    order.orderId
                );


            // 3. Razorpay Checkout options
            const options = {

                key: payment.keyId,

                amount: payment.amount,

                currency:
                    payment.currency,

                name: "SmartCart",

                description:
                    "SmartCart Order Payment",

                order_id:
                    payment.razorpayOrderId,


                // Customer details
                prefill: {

                    name:
                        data.name,

                    contact:
                        data.phone
                },


                // Extra order information
                notes: {

                    address:
                        data.address
                },


                // 4. Runs after successful payment
                handler: async (
                    response: any
                ) => {

                    try {

                        await verifyPayment({

                            orderId:
                                order.orderId,

                            razorpayOrderId:
                                response.razorpay_order_id,

                            razorpayPaymentId:
                                response.razorpay_payment_id,

                            razorpaySignature:
                                response.razorpay_signature

                        });


                        // Clear cart only after
                        // payment verification
                        clearCart();

                        setOrderSuccess(true);

                    } catch (error) {

                        console.error(
                            "Payment verification failed:",
                            error
                        );

                        alert(
                            "Payment verification failed."
                        );

                    } finally {

                        setIsProcessing(false);
                    }
                },


                theme: {
                    color: "#3399cc"
                }
            };


            // 5. Open Razorpay popup
            const razorpay =
                new window.Razorpay(
                    options
                );


            razorpay.on(
                "payment.failed",
                (response: any) => {

                    console.error(
                        "Payment failed:",
                        response.error
                    );

                    alert(
                        "Payment failed. Please try again."
                    );

                    setIsProcessing(false);
                }
            );


            razorpay.open();


        } catch (error) {

            console.error(
                "Unable to start payment:",
                error
            );

            alert(
                "Unable to start payment. Please try again."
            );

            setIsProcessing(false);
        }
    };


    const continueShopping = () => {

        window.history.pushState(
            {},
            "",
            "/"
        );

        window.dispatchEvent(
            new PopStateEvent(
                "popstate"
            )
        );
    };


    if (orderSuccess) {

        return (

            <div className="order-success">

                <div className="success-icon">
                    ✓
                </div>

                <h1>
                    Payment Successful!
                </h1>

                <p>
                    Thank you for shopping with SmartCart.
                </p>

                <p>
                    Your order has been confirmed.
                </p>

                <button
                    className="continue-shopping-btn"
                    onClick={
                        continueShopping
                    }
                >
                    Continue Shopping
                </button>

            </div>
        );
    }


    return (

        <div className="checkout">

            <h2>
                Checkout
            </h2>

            <form
                onSubmit={
                    handleSubmit(
                        onSubmit
                    )
                }
            >

                {/* Name */}
                <div>

                    <label>
                        Name
                    </label>

                    <input
                        type="text"
                        {...register("name")}
                    />

                    {errors.name && (

                        <p className="error-message">
                            {errors.name.message}
                        </p>

                    )}

                </div>


                {/* Phone */}
                <div>

                    <label>
                        Phone
                    </label>

                    <input
                        type="tel"
                        {...register("phone")}
                    />

                    {errors.phone && (

                        <p className="error-message">
                            {errors.phone.message}
                        </p>

                    )}

                </div>


                {/* Address */}
                <div>

                    <label>
                        Address
                    </label>

                    <textarea
                        {...register(
                            "address"
                        )}
                    />

                    {errors.address && (

                        <p className="error-message">
                            {errors.address.message}
                        </p>

                    )}

                </div>


                {/* Order Total */}
                <div className="checkout-total">

                    <span>
                        Order Total
                    </span>

                    <h3>
                        ₹{total.toLocaleString(
                            "en-IN"
                        )}
                    </h3>

                </div>


                {/* Payment Button */}
                <button
                    type="submit"
                    className="checkout-place-order-btn"
                    disabled={isProcessing}
                >

                    {isProcessing
                        ? "Processing..."
                        : "Pay Order"}

                </button>

            </form>

        </div>
    );
}


export default CheckoutForm;