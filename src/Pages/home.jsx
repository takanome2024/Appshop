import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db, Auth } from "../configs/firebase";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { CartContext } from "../components/cartContext";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [isLoggedin, setIsLoggedin] = useState(false);
    const { addCart } = useContext(CartContext);
    const [selectedQty, setSelectedQty] = useState({});
    const [filterCategory, setFilterCategory] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 2;
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            setIsLoggedin(!!user);
        });
        fetchProducts(true);
        return () => unsubscribe();
    }, [filterCategory, filterName, filterStatus]);

    const fetchProducts = async (reset = false) => {
        try {
            let q = collection(db, "products");
            const condition = [];

            if (filterCategory) {
                condition.push(where("categories", "==", filterCategory));
            }
            condition.push(orderBy("productName"));

            if (filterStatus === "ready") {
                condition.push(where("stocks", ">", 0));
            }
            if (filterStatus === "out") {
                condition.push(where("stocks", "==", 0));
            }

            if (!reset && lastDoc) {
                q = query(q, ...condition, limit(pageSize), startAfter(lastDoc));
            } else {
                q = query(q, ...condition, limit(pageSize));
            }

            const snapshot = await getDocs(q);
            let data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (filterName) {
                data = data.filter((p) =>
                    p.productName.toLowerCase().includes(filterName.toLowerCase())
                );
            }

            if (reset) {
                setProducts(data);
            } else {
                setProducts((prev) => [...prev, ...data]);
            }

            setHasMore(snapshot.docs.length >= pageSize);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (error) {
            console.error("Fetching products:", error);
        }
    };

    const handleBuyClick = (product) => {
        const currentQty = selectedQty[product.id] || 0;
        if (currentQty < product.stocks) {
            setSelectedQty((prev) => ({
                ...prev,
                [product.id]: currentQty + 1,
            }));
            addCart(product);
            toast.success("Cart Added Successfully");
        } else {
            toast.error("Stock limit reached!");
        }
    };

    const groupedProducts = products.reduce((groups, product) => {
        const category = product.categories || "Uncategorized";
        if (!groups[category]) groups[category] = [];
        groups[category].push(product);
        return groups;
    }, {});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const snapshot = await getDocs(collection(db, "products"));
                const categorySet = new Set();
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.categories) {
                        categorySet.add(data.categories);
                    }
                });
                setCategories([...categorySet]);
            } catch (error) {
                console.error("Fetching categories:", error);
            }
        }
    fetchCategories();
}, []);
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 capitalize mb-8">
                    Our Menus
                </h2>

                <div className="flex flex-wrap gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">All Status</option>
                        <option value="ready">Ready</option>
                        <option value="out">Out of stock</option>
                    </select>
                    <button
                        onClick={() => fetchProducts(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Apply Filters
                    </button>
                </div>

                {/* Grouped Products */}
                {Object.keys(groupedProducts).map((category) => (
                    <div key={category} className="mb-12">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">{category}</h3>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {groupedProducts[category].map((product) => {
                                const isOutOfStock = product.stocks === 0;
                                const count = selectedQty[product.id] || 0;
                                return (
                                    <div
                                        key={product.id}
                                        className={`relative flex flex-col rounded-xl overflow-hidden shadow-sm border bg-white transition hover:shadow-md ${isOutOfStock ? "opacity-60 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <Link to={`/product/${product.id}`} className="relative">
                                            <img
                                                alt={product.imageAlt || product.productName}
                                                src={product.thumb}
                                                className="aspect-square w-full object-cover"
                                            />
                                            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                                                {product.categories}
                                            </span>
                                        </Link>
                                        <div className="flex flex-col flex-grow p-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                                                {product.productName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {product.desc}
                                            </p>
                                            <div className="flex items-center justify-between mb-4">
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded-full ${isOutOfStock
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {isOutOfStock
                                                        ? "Out of stock"
                                                        : `Stock: ${product.stocks}`}
                                                </span>
                                                <span className="font-bold text-gray-900">
                                                    IDR {product.price}
                                                </span>
                                            </div>
                                            {isLoggedin && (
                                                <button
                                                    disabled={isOutOfStock || count >= product.stocks}
                                                    onClick={() => handleBuyClick(product)}
                                                    className={`mt-auto w-full py-2 rounded-lg text-white font-medium transition ${isOutOfStock || count >= product.stocks
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-600 hover:bg-green-700"
                                                        }`}
                                                >
                                                    {count > 0 ? `Qty Selected ${count}` : "Buy"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {hasMore && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => fetchProducts(false)}
                            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
