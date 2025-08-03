import { FaBell } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../assets/logo.png"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { Auth } from "../configs/firebase";
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { CartContext } from "./cartContext";


export default function Navbar() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [checkAuth, setCheckAuth] = useState(true)
  const navigate = useNavigate();
  const notify = () => toast('Logout has been successfully');
  const {cartItems}=useContext(CartContext);

  useEffect(() => {
    const unlogin = onAuthStateChanged(Auth, (user) => {
      setIsLoggedin(!!user);
      setCheckAuth(false)
    });
    return () => unlogin();
  }, []);


  const handleLogout = async () => {
    Swal.fire({
      title: 'Confrim',
      text: 'Are you sure want to Logout?',
      icon: 'question',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut(Auth);
        toast.success('you successfully logout')
        navigate("/");
      }
    });
  }

  return (
    <>
      <Toaster position="top-center" />
      <nav className="navbar w-screen bg-gradient-to-r from-green-500 via-green-600 to-green-700 flex justify-between py-3 px-10">
        <div className="logo flex items-center">
          <img src={logo} alt="logo" className="h-12 sm:h-14 lg:h-18 max-w-full object-contain" />
        </div>
        {/* nav desktop start */}
        <ul className="menus hidden lg:flex">
          <li className="dropdown dropdown-hover">
            <button onClick={() => navigate("/")} className="btn m-1 bg-transparent text-white hover:text-yellow-200 border-0 shadow-none capitalize">home</button>
            {/* <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-transparent text-white border-0 shadow-none capitalize"
            >
              home
            </div> */}
          </li>
          {isLoggedin && (
            <li className="dropdown dropdown-hover">
              <button onClick={() => navigate("/auth/ProductData")} className="btn m-1 bg-transparent text-white hover:text-yellow-200 border-0 shadow-none capitalize">product list</button>
            </li>
          )}
          <li className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-transparent text-white hover:text-yellow-200 border-0 shadow-none capitalize"
            >
              about us
            </div>
          </li>

        </ul>
        {/* nav desktop end */}
        {/* hamburger start */}
        <div className="others flex gap-4 aligns-center">

          <>
            <FaSearch className="text-white text-lg self-center hidden lg:flex" />
            {isLoggedin && (<FaBell className="text-white text-lg self-center" />)}
             {isLoggedin && (<div className="relative flex items-center cursor-pointer" onClick={()=>navigate("/auth/cart")}>
              <FaShoppingCart className="text-white text-lg" />{cartItems.length>0&&(
              <div className="absolute -top-2 -right-2 bg-red-800 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartItems.length}
              </div>
              )}
            </div>)}

          </>

          <FaSearch className="text-white text-lg self-center flex lg:hidden" />
          {!checkAuth && (
            isLoggedin ? (
              <button onClick={handleLogout} className="btn border-none bg-red-700 hidden lg:flex capitalize text-white">logout</button>
            ) : (
              <>
                <button onClick={() => navigate("/auth/login")} className="btn bg-white text-green-700 hover:bg-green-100 hidden lg:flex capitalize">login</button>
                <button onClick={() => navigate("/auth/register")} className="btn bg-yellow-400 text-white hover:bg-yellow-500 text-white hidden lg:flex capitalize">signup</button>
              </>
            )
          )}


          <ul className="menus flex lg:hidden">
            <li className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn px-0 m-1 bg-transparent text-white border-0 shadow-none capitalize"
              >
                <GiHamburgerMenu />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-none left-auto right-0"
              >
                <li className="collapse collapse-arrow bg-base-100">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <button
                    onClick={() => navigate("/")}
                    className="btn m-1 bg-transparent text-green-700 border-0 shadow-none capitalize"
                  >
                    Home
                  </button>
                </li>
                {isLoggedin && (
                  <li className="collapse collapse-arrow bg-base-100">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <button
                      onClick={() => navigate("/auth/ProductData")}
                      className="btn m-1 bg-transparent text-green-700 border-0 shadow-none capitalize"
                    >
                      Product List
                    </button>
                  </li>
                )}

                <li className="collapse bg-base-100">
                  <input type="radio" name="my-accordion-2" defaultChecked />
                  <div className="btn m-1 bg-transparent text-green-700 border-0 shadow-none capitalize">
                    About Us
                  </div>
                </li>
                <div className="buttons flex justify-around mt-2">
                  {!checkAuth && (
                    isLoggedin ? (
                      <button
                        onClick={handleLogout}
                        className="btn bg-red-700 capitalize w-full text-white"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/auth/login")}
                          className="btn bg-white text-green-700 hover:bg-green-100 capitalize"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => navigate("/auth/register")}
                          className="btn bg-yellow-400 text-white hover:bg-yellow-500 capitalize"
                        >
                          Signup
                        </button>
                      </>
                    )
                  )}
                </div>
              </ul>
            </li>
          </ul>
          {/* hamburger end */}
        </div>
      </nav >
    </>
  );
}
