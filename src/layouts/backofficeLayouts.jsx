import { Outlet, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Auth } from "../configs/firebase";
import Loading from "../components/load";
import { useLocation } from "react-router";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../configs/firebase";

export default function AdminLayouts() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, async (user) => {
      const isAuthPage =
        location.pathname === "/auth/login" ||
        location.pathname === "/auth/register";

      if (!user) {
        navigate("/auth/login");
        setIsLoading(false);
        return;
      }


      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/");
      }

      if (user && isAuthPage) {
        navigate("/");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [location, navigate]);

  if (isLoading) return <Loading />;

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => navigate("/admin")}>Dashboard</button>
          <button onClick={() => navigate("/admin/products")}>Products</button>
          <button onClick={() => navigate("/admin/orders")}>Orders</button>
        </nav>
      </aside>

      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
