import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { db, Auth } from "../configs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { CartContext } from "../components/cartContext";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
    const { id } = useParams(); // product id from route
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [count, setCount] = useState(0);
    const { addCart } = useContext(CartContext);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            setIsLoggedin(!!user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const ref = doc(db, "products", id);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    setProduct({ id: snap.id, ...snap.data() });
                } else {
                    console.error("Product not found");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleBuyClick = () => {
        if (count < product.stocks) {
            setCount((prev) => prev + 1);
            addCart(product);
            toast.success("Cart Added Successfully");
        } else {
            toast.error("Stock limit reached!");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-gray-500 mb-4">Product not found.</p>
                <Link to="/" className="text-green-600 hover:underline">Go back</Link>
            </div>
        );
    }

    const isOutOfStock = product.stocks === 0;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
                <Link to="/" className="text-green-600 hover:underline mb-4 inline-block">
                    ← Back to menu
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img
                            src={product.thumb}
                            alt={product.imageAlt || product.productName}
                            className="w-full rounded-lg object-cover"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
                        <p className="text-gray-600 mb-4">{product.desc}</p>

                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-4">
                            {product.categories}
                        </span>

                        <div className="flex items-center gap-4 mb-6">
                            <span
                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    isOutOfStock
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                }`}
                            >
                                {isOutOfStock ? "Out of stock" : `Stock: ${product.stocks}`}
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                                IDR {product.price}
                            </span>
                        </div>

                        {isLoggedin && (
                            <button
                                disabled={isOutOfStock || count >= product.stocks}
                                onClick={handleBuyClick}
                                className={`w-full py-3 rounded-lg text-white font-medium transition ${
                                    isOutOfStock || count >= product.stocks
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {count > 0 ? `Qty Selected ${count}` : "Buy"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
