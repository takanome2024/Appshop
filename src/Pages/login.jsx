import logo from '../assets/logo.png';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Auth, googleProvider } from '../configs/firebase';
import { FcGoogle } from 'react-icons/fc';
// import { onAuthStateChanged } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';


export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailed, setShowFailed] = useState(false);
    // const [isLoggedin, setIsLoggedin] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(Auth, email, password);
            setShowSuccess(true);
            toast.success('you successfully login')
            setTimeout(() => {
                setShowSuccess(false);
                navigate("/");
            }, 2000);
        } catch (error) {
            // console.error(error.message)
            setShowFailed(true);
            toast.error('Login Failed!');
            setTimeout(() => {
                setShowFailed(false);
            }, 2000);
        }
    }

    async function handleLoginWithGoogle(e) {
        e.preventDefault();
        try {
            const oauthLogin = await signInWithPopup(Auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(oauthLogin);
            const token = credential.accessToken;
            const user = oauthLogin.user;
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate("/")
            }, 2000);
        } catch (error) {
            setShowFailed(true);
            setTimeout(() => {
                setShowFailed(false);
            }, 2000);
        }
    }

    // useEffect(() => {
    //     const unlogin = onAuthStateChanged(Auth, (user) => {
    //         console.log("Auth state:", user);
    //         setIsLoggedin(!!user);
    //         setCheckAuth(false)
    //     });
    //     return () => unlogin();
    // }, []);

    return (
        <>
        <Toaster position="top-center" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md bg-[#F9FAFB] p-8 sm:p-10 rounded-lg shadow-md">
                    <div className="flex flex-col items-center">
                        <img src={logo} alt="loginLogo" className="h-8 sm:h-10 lg:h-14 max-w-full object-contain mb-4" />
                        <h2 className="text-center text-2xl font-bold text-gray-900">Welcome back!</h2>
                    </div>

                    <form onSubmit={handleLogin} action="#" method="POST" className="mt-8 space-y-6 w-full">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 capitalize">email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Input email"
                                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 placeholder:text-gray-400 border-gray-300 focus:outline-none focus:border-green-500 focus:ring-green-200 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Input Password"
                                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-none border-gray-300 focus:border-green-500 focus:ring-green-200 sm:text-sm"
                            />
                            <div className="text-right mt-1">
                                <a href="#" className="text-sm text-green-600 hover:text-green-700">Forgot password?</a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={handleLoginWithGoogle}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition"
                            >
                                <FcGoogle />
                                Login with Google
                            </button>

                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Not a member?{" "}
                        <button onClick={() => navigate("/auth/register")} className="font-medium text-green-600 hover:text-green-700">
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}
