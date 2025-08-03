import { useState } from "react";
import logo from ".../assets/logo.png"
export default function LoginAdmin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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

    return (
        <div className="flex h-screen">
            {/* Kiri - Form */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-10">
                <h1 className="text-3xl font-bold mb-8 text-green-700">Login</h1>
                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition"
                    >
                        Login
                    </button>
                </form>
            </div>

            {/* Kanan - Gambar/Background */}
            <div className="w-1/2 bg-gradient-to-br from-green-300 to-green-600 flex justify-center items-center">
            <img src="" alt="" srcset="" />
                <h2 className="text-white text-4xl font-bold">Selamat Datang!</h2>
            </div>
        </div>
    );
}