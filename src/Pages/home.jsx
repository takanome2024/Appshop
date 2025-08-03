import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, Auth } from "../configs/firebase";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { CartContext } from "../components/cartContext";
import toast from "react-hot-toast";

export default function HomePage() {

    const [products, setProducts] = useState([]);
    const [cartItems,setCartItems]=useState([]);
    const [isLoggedin, setIsLoggedin] = useState(false);
    const {addCart}=useContext(CartContext);


    useEffect(() => {
        const unsubscribe=onAuthStateChanged (Auth,(user)=>{
            setIsLoggedin(!!user);
        });
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setProducts(data);
            } catch (error) {
                console.error("fetching product:", error)
            }
        };
        fetchProducts();
        return()=>unsubscribe();
    }, []);

    return (
        <>
            <div className="bg-gray-50">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize mb-5">
                        our menus
                    </h2>
                    <div className="card justify-center grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => {
                            const isOutOfStock = product.stocks === 0;
                            return(
                            <a key={product.id} href={isOutOfStock ? undefined : "#"} onClick={(e) => {
                                if (!isOutOfStock) {
                                    e.preventDefault();
                                }
                                console.log("Product clicked:", product.productName);
                            }
                            }
                                className={`group shadow-sm p-2 rounded-lg transition ${isOutOfStock ? "opacity-60 cursor-not-allowed pointer-events-none" : "hover:shadow-md"}`}>
                                <figure>
                                    <img
                                        alt={product.imageAlt}
                                        src={product.thumb}
                                        className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                                    />
                                </figure>

                                <div className="card-body p-2">
                                    <h2 className="card-title text-base font-semibold">
                                        {product.productName}
                                    </h2>
                                    <div className="stockPrices flex justify-between items-center py-1">
                                        <div className="stock">
                                            {product.stocks > 0 ? (
                                                <span className="font-bold capitalize text-sm">Stock: {product.stocks}</span>
                                            ) : (
                                                <span className="font-bold capitalize text-red-600 text-sm">Out of stock</span>
                                            )}
                                        </div>

                                        <p className="font-bold text-sm text-right">
                                            IDR {product.price}
                                        </p>
                                    </div>
                                    {isLoggedin && (
                                    <div className="card-actions justify-center">
                                        <button disabled={product.stocks === 0} onClick={()=>{addCart(product); toast.success("Cart Added Successfully");}} className="btn bg-green-600 hover:bg-green-700 text-white w-[55%] capitalize">
                                            Buy
                                        </button>
                                    </div>)}
                                </div>
                            </a>

                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
