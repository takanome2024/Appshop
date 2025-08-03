import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/navbar"
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Auth } from "../configs/firebase";
import Loading from "../components/load";
import { useLocation } from "react-router";

export default function AdminLayouts() {
    // untuk protecting route start
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [isAdmin,setIsAdmin]=useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            const isAuthPage=
            location.pathname==="/auth/login" || 
            location.pathname==="/auth/register";
            // console.log(user);
            if (user && isAuthPage) {
                    setIsLoading(false);
                    navigate("/")
            } else {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [location, navigate]); // untuk protecting route end
    return (
        <>
            <Navbar />
            <div>
                {isLoading ? <Loading /> : <Outlet />}
            </div>

        </>
    )
}