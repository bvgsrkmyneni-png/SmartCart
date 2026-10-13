import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
    isAdmin?: boolean;
}

function ProductList({ isAdmin = false }: ProductListProps) {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() => setError("Unable to load products"))
            .finally(() => setLoading(false));
    }, []);

    const categories = [
        "All",
        ...new Set(
            products
                .map((product) => product.category)
                .filter(Boolean)
        )
    ];

    const filteredProducts = products.filter((product) =>
        product.productName
            .toLowerCase()
            .includes(search.toLowerCase()) &&
        (category === "All" || product.category === category)
    );

    if (loading) {
        return (
            <div className="product-status">
                <div className="loading-circle"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-error">
                {error}
            </div>
        );
    }

    return (
        <div className="product-list-container">

            {/* Search and Filter */}
            <div className="product-toolbar">

                <div className="search-box">
                    <span className="search-icon">⌕</span>

                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <div className="category-filter">
                    <span>Category</span>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Result Information */}
            <div className="product-results-info">

                <p>
                    Showing{" "}
                    <strong>{filteredProducts.length}</strong>{" "}
                    {filteredProducts.length === 1
                        ? "product"
                        : "products"}
                </p>

                {category !== "All" && (
                    <span className="active-category">
                        {category}
                    </span>
                )}

            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (

                <div className="product-grid">

                    {filteredProducts.map((product) => (

                        <ProductCard
                            key={product.productId}
                            product={product}
                            isAdmin={isAdmin}
                        />

                    ))}

                </div>

            ) : (

                <div className="no-products">

                    <div className="no-products-icon">
                        🔍
                    </div>

                    <h3>No products found</h3>

                    <p>
                        Try changing your search or category.
                    </p>

                </div>

            )}

        </div>
    );
}

export default ProductList;