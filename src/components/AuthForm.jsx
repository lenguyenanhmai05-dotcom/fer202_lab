import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const defaultImages = [
    "https://i.pinimg.com/1200x/65/e8/1c/65e81c0a1ab979bd8b005b5cb3cebb13.jpg",
    "https://i.pinimg.com/1200x/1c/16/d7/1c16d7936b89a60b9f6a3e2d2f420842.jpg",
    "https://i.pinimg.com/1200x/70/10/ba/7010ba27d3d9879f1ca4952bb99c64de.jpg",
    "https://i.pinimg.com/736x/17/bf/65/17bf65964b1fd9feb3066d5841bdb05a.jpg",
    "https://i.pinimg.com/736x/a2/c0/f0/a2c0f09b1cdac1864423356a64425634.jpg",
    "https://i.pinimg.com/736x/64/18/ba/6418ba73bab06687cddf2ae38c76d166.jpg",
    "https://i.pinimg.com/736x/b9/3f/78/b93f780d2c6507e33240b3a68c79b47c.jpg",
    "https://i.pinimg.com/736x/de/76/45/de76456145c9c2c5287b2310f1a9bc5a.jpg",
]

export default function AuthForm({ type, onSubmit, isLoading }) {
    const isLogin = type === "login"
    const [index, setIndex] = useState(0)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % defaultImages.length)
        }, 3500)
        return () => clearInterval(timer)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-rose-200 via-pink-200 to-fuchsia-200 flex items-center justify-center px-6">
            <div className="grid w-full max-w-5xl h-[700px] overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl shadow-2xl md:grid-cols-[1.1fr_0.9fr]">

                {/* LEFT – FORM */}
                <form onSubmit={handleSubmit} className={`flex flex-col justify-${isLogin ? 'center' : 'start'} px-14 py-14`}>
                    {isLogin ? (
                        <>
                            <h1 className="text-3xl font-extrabold text-pink-700 mb-2">Welcome Back</h1>
                            <h2 className="text-2xl font-serif font-bold text-black mb-6">Luxe Collection</h2>
                            <p className="mb-10 text-sm text-black">Please login to continue to your account</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl font-serif font-bold text-pink-800 mb-2">Luxe Collection</h1>
                            <h2 className="text-lg font-medium text-black mb-6">Create your account</h2>
                            <p className="mb-10 text-sm text-black">Sign up to start shopping with us</p>
                        </>
                    )}

                    <div className="space-y-5">
                        {!isLogin && (
                            <>
                                <Input
                                    name="name"
                                    placeholder="Full name"
                                    className="h-12 border-pink-200 focus:border-pink-500"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="phone"
                                    placeholder="Phone"
                                    className="h-12 border-pink-200 focus:border-pink-500"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        <div className={isLogin ? "space-y-2" : ""}>
                            {isLogin && <label className="text-sm font-medium text-pink-900">Email</label>}
                            <Input
                                name="email"
                                type="email"
                                placeholder={isLogin ? "example@gmail.com" : "Email"}
                                className="h-12 border-pink-200 focus:border-pink-500"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={isLogin ? "space-y-2" : ""}>
                            {isLogin && <label className="text-sm font-medium text-pink-900">Password</label>}
                            <Input
                                name="password"
                                type="password"
                                placeholder={isLogin ? "••••••••" : "Password"}
                                className="h-12 border-pink-200 focus:border-pink-500"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <Button disabled={isLoading} type="submit" className="mt-4 h-12 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:opacity-90">
                            {isLoading ? (isLogin ? "Signing In..." : "Signing up...") : (isLogin ? "Sign In" : "Continue")}
                        </Button>
                    </div>

                    {isLogin ? (
                        <p className="mt-8 text-center text-sm text-pink-700/80">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-semibold text-pink-800 hover:underline cursor-pointer">
                                Register now
                            </Link>
                        </p>
                    ) : (
                        <>
                            <p className="mt-6 text-center text-sm text-pink-700/80">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-pink-800 hover:underline cursor-pointer">
                                    Login
                                </Link>
                            </p>
                            <p className="mt-8 text-center text-xs leading-relaxed text-pink-700/70">
                                By clicking <b>“Continue”</b>, you acknowledge that you have read and
                                accept the{" "}
                                <span className="font-medium hover:underline cursor-pointer">Terms of Service</span>{" "}
                                and{" "}
                                <span className="font-medium hover:underline cursor-pointer">Privacy Policy</span>.
                            </p>
                        </>
                    )}
                </form>

                {/* RIGHT – IMAGE SLIDESHOW */}
                <div className="relative hidden md:block">
                    {defaultImages.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt=""
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-400/30 via-pink-300/20 to-transparent" />
                </div>
            </div>
        </div>
    )
}
