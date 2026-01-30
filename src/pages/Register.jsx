import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const images = [
    "https://i.pinimg.com/1200x/65/e8/1c/65e81c0a1ab979bd8b005b5cb3cebb13.jpg",
    "https://i.pinimg.com/1200x/99/38/22/9938224c141b28dd996d28dca1fbd426.jpg",
    "https://i.pinimg.com/1200x/70/10/ba/7010ba27d3d9879f1ca4952bb99c64de.jpg",
    "https://i.pinimg.com/736x/17/bf/65/17bf65964b1fd9feb3066d5841bdb05a.jpg",
    "https://i.pinimg.com/736x/a2/c0/f0/a2c0f09b1cdac1864423356a64425634.jpg",
    "https://i.pinimg.com/736x/64/18/ba/6418ba73bab06687cddf2ae38c76d166.jpg",
    "https://i.pinimg.com/736x/b9/3f/78/b93f780d2c6507e33240b3a68c79b47c.jpg",
    "https://i.pinimg.com/736x/de/76/45/de76456145c9c2c5287b2310f1a9bc5a.jpg",
]

export default function Register() {
    const [index, setIndex] = useState(0)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length)
        }, 3500)
        return () => clearInterval(timer)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
        if (existingUsers.find(user => user.email === formData.email)) {
            alert("Email already registered!")
            return
        }

        // Save new user
        const newUser = { ...formData }
        existingUsers.push(newUser)
        localStorage.setItem("users", JSON.stringify(existingUsers))

        alert("Registration successful! Redirecting to login...")
        navigate("/login")
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-rose-200 via-pink-200 to-fuchsia-200 flex items-center justify-center px-6">
            <div className="grid w-full max-w-5xl h-[700px] overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl shadow-2xl md:grid-cols-[1.1fr_0.9fr]">

                {/* LEFT – REGISTER FORM */}
                <form onSubmit={handleSubmit} className="flex flex-col justify-start px-14 pt-20 pb-14">
                    <h1 className="text-4xl font-serif font-bold text-pink-800 mb-2">
                        Luxe Collection
                    </h1>
                    <h2 className="text-lg font-medium text-black mb-6">
                        Create your account
                    </h2>
                    <p className="mb-10 text-sm text-black">
                        Sign up to start shopping with us
                    </p>

                    <div className="space-y-5">
                        <Input
                            name="name"
                            placeholder="Full name"
                            className="h-12"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="h-12"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            name="phone"
                            placeholder="Phone"
                            className="h-12"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="h-12"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <Button type="submit" className="h-12 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:opacity-90">
                            Continue
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-sm text-pink-700/80">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-pink-800 hover:underline cursor-pointer">
                            Login
                        </Link>
                    </p>

                    <p className="mt-8 text-center text-xs leading-relaxed text-pink-700/70">
                        By clicking <b>“Continue”</b>, you acknowledge that you have read and
                        accept the{" "}
                        <span className="font-medium hover:underline cursor-pointer">
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="font-medium hover:underline cursor-pointer">
                            Privacy Policy
                        </span>.
                    </p>
                </form>

                {/* RIGHT – IMAGE SLIDESHOW */}
                <div className="relative hidden md:block">
                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt=""
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    ))}

                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-400/30 via-pink-300/20 to-transparent" />
                </div>
            </div>
        </div>
    )
}
