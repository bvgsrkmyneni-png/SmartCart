import { useState } from "react";
import ProductList from "../components/ProductList";
import BackgroundJobMonitor from "../components/BackgroundJobMonitor";
import { addProduct } from "../api/productApi";

function AdminDashboard() {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [rating, setRating] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        try {
            await addProduct({
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

            setMessage("Product inserted successfully");

            setProductName("");
            setCategory("");
            setDescription("");
            setPrice("");
            setStock("");
            setImageUrl("");
            setRating("");
        } catch {
            setMessage("Product insertion failed");
        }
    };

    return (
        <div className="admin-dashboard">

            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div>
                    <p className="dashboard-label">ADMIN PANEL</p>
                    <h1>Product Management</h1>
                    <p className="dashboard-subtitle">
                        Add and manage products in your store.
                    </p>
                </div>

                <div className="admin-badge">
                    Admin
                </div>
            </div>

            {/* Add Product Section */}
            <div className="admin-section modern-form-card">

                <div className="section-heading">
                    <div>
                        <h2>Add New Product</h2>
                        <p>
                            Enter the product information below.
                        </p>
                    </div>
                </div>

                <form
                    className="product-form modern-product-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Wireless Headphones"
                            value={productName}
                            onChange={(event) =>
                                setProductName(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            placeholder="e.g. Electronics"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter product description..."
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="2999"
                            value={price}
                            onChange={(event) =>
                                setPrice(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="25"
                            value={stock}
                            onChange={(event) =>
                                setStock(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/product.jpg"
                            value={imageUrl}
                            onChange={(event) =>
                                setImageUrl(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Rating</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="4.5"
                            value={rating}
                            onChange={(event) =>
                                setRating(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-submit-area">
                        <button
                            className="insert-product-btn"
                            type="submit"
                        >
                            + Add Product
                        </button>
                    </div>
                </form>

                {message && (
                    <div
                        className={
                            message.includes("successfully")
                                ? "form-message success-message"
                                : "form-message error-message"
                        }
                    >
                        {message}
                    </div>
                )}
            </div>

            {/* Background Job Monitor */}
            <div className="admin-section">
                <BackgroundJobMonitor />
            </div>

            {/* Products */}
            <div className="products-management-section">
                <div className="products-section-title">
                    <div>
                        <h2>Products</h2>
                        <p>
                            View, update and delete your store products.
                        </p>
                    </div>
                </div>

                <ProductList isAdmin={true} />
            </div>
        </div>
    );
}

export default AdminDashboard;