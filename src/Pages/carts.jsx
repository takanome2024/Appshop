import { useContext } from "react";
import { CartContext } from "../components/cartContext";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';

export default function CartList() {
    const { cartItems, setCartItems, removeCart } = useContext(CartContext);

    const handleRemove = (id) => {
        Swal.fire({
            title: "Confirm",
            text: "Are you sure want to remove this item from cart?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Removing...",
                    text: "Please wait",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                setTimeout(() => {
                    removeCart(id);
                    Swal.close();
                    toast.success("Item removed from cart");
                }, 800);
            }
        });
    };

const totalPrice = (cartItems ?? []).reduce(
    (acc, item) => acc + item.price * item.qty,
    0
);

const increase = (id) => {
    const update = cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item);
    setCartItems(update);
}

const decrease = (id) => {
    const update = cartItems.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item);
    setCartItems(update);
}

return (
    <div className="w-full max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-5 border border-green-100">
        <h2 className="text-2xl font-bold text-green-700 mb-4 capitalize">
            your cart
        </h2>
        {(cartItems?.length ?? 0) === 0 ? (
            <p className="text-gray-500 capitalize">cart is empty</p>
        ) : (
            <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                    <li
                        key={item.id}
                        className="py-4 flex items-center justify-between"
                    >
                        <div className="flex gap-4 items-center">
                            <img
                                src={item.thumb}
                                alt={item.productName}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                                <h4 className="font-semibold text-gray-900 capitalize">
                                    {item.productName}
                                </h4>

                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        onClick={() => decrease(item.id)}
                                        disabled={item.qty === 1}
                                        className={`p-1 rounded-full ${item.qty === 1
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                : "bg-red-100 hover:bg-red-200 text-red-600"
                                            }`}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="w-6 text-center">{item.qty}</span>
                                    <button
                                        onClick={() => increase(item.id)}
                                        className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 uppercase mt-1">
                                    idr {item.price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove from cart"
                        >
                            <FaTrashAlt />
                        </button>
                    </li>
                ))}
            </ul>
        )}

        {(cartItems?.length ?? 0) > 0 && (
            <div className="mt-5 border-t pt-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-700 capitalize">total:</h3>
                <p className="text-xl text-green-700 font-semibold uppercase">
                    idr {totalPrice.toLocaleString()}
                </p>
            </div>
        )}
    </div>
);
}