import { useState } from "react";
import type { Product } from "../types/product";
import { useCartStore } from "../store/cartStore";
import { deleteProduct, updateProduct } from "../api/productApi";

interface ProductCardProps {
    product: Product;
    isAdmin?: boolean;
}

function ProductCard({ product, isAdmin = false }: ProductCardProps) {

    const addToCart = useCartStore((state) => state.addToCart);

    const [editing, setEditing] = useState(false);
    const [productName, setProductName] = useState(product.productName);
    const [category, setCategory] = useState(product.category);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock));
    const [imageUrl, setImageUrl] = useState(product.imageUrl);
    const [rating, setRating] = useState(String(product.rating));
    const [message, setMessage] = useState("");

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${product.productName}?`)) {
            return;
        }

        try {
            await deleteProduct(product.productId);
            window.location.reload();
        } catch {
            alert("Product deletion failed");
        }
    };

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await updateProduct(product.productId, {
                productName,
                category,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
                rating: Number(rating),
                status:
                    Number(stock) > 0
                        ? "AVAILABLE"
                        : "OUT_OF_STOCK",
            });

            setMessage("Product updated successfully");
            setEditing(false);
            window.location.reload();

        } catch {
            setMessage("Product update failed");
        }
    };

    return (
        <div className="product-card">

            {!editing ? (
                <>
                    {/* Product Image */}

                    <div className="product-image-container">

                        <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="product-image"
                        />

                        <span className="category-badge">
                            {product.category}
                        </span>

                        {product.stock > 0 ? (
                            <span className="stock-badge">
                                In Stock
                            </span>
                        ) : (
                            <span className="stock-badge out-stock-badge">
                                Out of Stock
                            </span>
                        )}

                    </div>


                    {/* Product Information */}

                    <div className="product-content">

                        <h3>{product.productName}</h3>

                        <p className="product-description">
                            {product.description}
                        </p>


                        {/* Rating */}

                        <div className="product-rating">

                            <span className="rating-star">
                                ★
                            </span>

                            <strong>
                                {product.rating}
                            </strong>

                            <span className="rating-max">
                                / 5
                            </span>

                        </div>


                        {/* Price */}

                        <div className="product-price-row">

                            <div>
                                <span className="price-label">
                                    Price
                                </span>

                                <div className="product-price">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </div>
                            </div>

                            <div className="stock-count">
                                {product.stock > 0
                                    ? `${product.stock} left`
                                    : "No stock"}
                            </div>

                        </div>


                        {/* Customer Button */}

                        {!isAdmin && (

                            <button
                                className="add-cart-btn"
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                            >
                                {product.stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"}
                            </button>

                        )}


                        {/* Admin Buttons */}

                        {isAdmin && (

                            <div className="admin-product-buttons">

                                <button
                                    className="update-btn"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Product
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        )}

                    </div>
                </>

            ) : (

                /* UPDATE FORM */

                <form
                    className="product-edit-form"
                    onSubmit={handleUpdate}
                >

                    <div className="edit-form-header">

                        <h3>Edit Product</h3>

                        <span>
                            #{product.productId}
                        </span>

                    </div>

                    <label>Product Name</label>

                    <input
                        value={productName}
                        onChange={(e) =>
                            setProductName(e.target.value)
                        }
                        placeholder="Product Name"
                        required
                    />


                    <label>Category</label>

                    <input
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        placeholder="Category"
                        required
                    />


                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Description"
                        required
                    />


                    <div className="edit-row">

                        <div>
                            <label>Price</label>

                            <input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <label>Stock</label>

                            <input
                                type="number"
                                value={stock}
                                onChange={(e) =>
                                    setStock(e.target.value)
                                }
                                required
                            />
                        </div>

                    </div>


                    <label>Image URL</label>

                    <input
                        value={imageUrl}
                        onChange={(e) =>
                            setImageUrl(e.target.value)
                        }
                        placeholder="Image URL"
                        required
                    />


                    <label>Rating</label>

                    <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={rating}
                        onChange={(e) =>
                            setRating(e.target.value)
                        }
                        required
                    />


                    <div className="edit-actions">

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>

                    </div>

                    {message && (
                        <p className="form-message">
                            {message}
                        </p>
                    )}

                </form>

            )}

        </div>
    );
}

export default ProductCard;