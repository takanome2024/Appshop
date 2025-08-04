import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../configs/firebase";

const AdminProductContext = createContext();

export const useAdminProduct = () => useContext(AdminProductContext);

export function AdminProductProvider({ children }) {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchProducts = async () => {
        try {
            setLoading(true)
            const querySnapshot = await getDocs(collection(db, "product"));
            const list = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setProduct(list);
        } catch (error) {
            console.error("failed:", error)
        } finally {
            setLoading(false);
        }
    };

    const getProductbyId = async (id) => {
        try {
            const docRef = doc(db, "product", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("error: ", error);
            return null;
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <AdminProductContext.Provider value={{ product, loading, fetchProducts, getProductbyId }}>
            {children}
        </AdminProductContext.Provider>
    )
}