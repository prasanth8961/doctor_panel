import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { app } from '../Firebase/firebase_config';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, GoogleAuthProvider, getAuth } from 'firebase/auth'
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setForm({ email: "", password: "", confirmPassword: "" });
        setError("");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const signup = async (email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log("✅ Signup successful:", result.user);
            const user = result.user;
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                photoUrl: user.photoURL || null,
                displayName: user.displayName || null
            }));
            return user;
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    console.error("❌ Email already registered.");
                    break;
                case "auth/invalid-email":
                    console.error("❌ Invalid email format.");
                    break;
                case "auth/weak-password":
                    console.error("❌ Password should be at least 6 characters.");
                    break;
                default:
                    console.error("❌ Signup failed:", error.message);
                    break;
            }
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Login successful:", result.user);
            const user = result.user;
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                photoUrl: user.photoURL || null,
                displayName: user.displayName || null
            }));
            return user;
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    console.error("❌ No user found with this email.");
                    break;
                case "auth/wrong-password":
                    console.error("❌ Incorrect password.");
                    break;
                case "auth/invalid-email":
                    console.error("❌ Invalid email format.");
                    break;
                case "auth/too-many-requests":
                    console.error("❌ Too many failed attempts. Try again later.");
                    break;
                default:
                    console.error("❌ Login failed:", error.message);
                    break;
            }
            return null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password || (!isLogin && !form.confirmPassword)) {
            return setError("Please fill in all fields.");
        }

        if (!isLogin && form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }

        let user;

        if (isLogin) {
            console.log("Logging in with:", form.email, form.password);
            user = login(form.email, form.password);
        } else {
            console.log("Signing up with:", form.email, form.password);
            user = signup(form.email, form.password);
        }

        if (user) {
            navigate('/')
        }
    };


    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;


            const token = await user.getIdToken();


            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify({
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));
            navigate('/');
        } catch (error) {
            const msg = error.message;
            const code = error.code;

            switch (code) {
                case "auth/popup-closed-by-user":
                    console.error("Google popup was closed before completing sign in.");
                    break;
                case "auth/cancelled-popup-request":
                    console.error("Only one popup request is allowed at a time.");
                    break;
                case "auth/email-already-in-use":
                    console.error("This email is already in use. Try logging in instead.");
                    break;
                case "auth/network-request-failed":
                    console.error("Network error occurred. Please check your connection.");
                    break;
                default:
                    console.error("Google Auth Error:", msg);
                    break;
            }
        }
    }

    return (
        <div className="fixed inset-0 w-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg shadow-md rounded-md p-8 space-y-6">
                <h4 className="text-2xl font-semibold text-center">
                    {isLogin ? "Login" : "Sign Up"}
                </h4>

                <form autoComplete="off" aria-autocomplete="off" onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="off"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="off"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2 cursor-pointer rounded-md hover:bg-blue-950 transition duration-300"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-sm text-gray-500">or</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                <button
                    onClick={() => handleGoogleAuth()}
                    className="w-full flex items-center justify-center gap-3 cursor-pointer border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
                >
                    <FcGoogle className="text-xl" />
                    <span className="text-sm font-medium text-gray-700">
                        {isLogin ? "Login with Google" : "Sign up with Google"}
                    </span>
                </button>

                <p className="text-center text-sm text-gray-600">
                    {isLogin ? (
                        <>
                            Don’t have an account?{" "}
                            <span
                                onClick={handleToggle}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                Sign up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span
                                onClick={handleToggle}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                Login
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};
