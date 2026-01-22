import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const images = [
  "https://i.pinimg.com/736x/8e/4e/d1/8e4ed1ce9a7e8704720b4e969b74b9f4.jpg",
  "https://i.pinimg.com/1200x/f0/5b/9b/f05b9b0938648bf8ec91aca145f6496f.jpg",
  "https://i.pinimg.com/1200x/70/10/ba/7010ba27d3d9879f1ca4952bb99c64de.jpg",
  "https://i.pinimg.com/736x/17/bf/65/17bf65964b1fd9feb3066d5841bdb05a.jpg",
  "https://i.pinimg.com/736x/a2/c0/f0/a2c0f09b1cdac1864423356a64425634.jpg",
  "https://i.pinimg.com/736x/64/18/ba/6418ba73bab06687cddf2ae38c76d166.jpg",
  "https://i.pinimg.com/736x/b9/3f/78/b93f780d2c6507e33240b3a68c79b47c.jpg",
  "https://i.pinimg.com/736x/de/76/45/de76456145c9c2c5287b2310f1a9bc5a.jpg",
]

export default function App() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-rose-200 via-pink-200 to-fuchsia-200 flex items-center justify-center px-6">
      <div className="grid w-full max-w-5xl h-[700px] overflow-hidden rounded-[2.5rem] bg-white/60 backdrop-blur-2xl shadow-2xl md:grid-cols-[1.1fr_0.9fr]">

        {/* LEFT – REGISTER FORM */}
        <form className="flex flex-col justify-start px-14 pt-20 pb-14">
          <h1 className="text-3xl font-extrabold text-pink-700 mb-3">
            Create your account
          </h1>
          <p className="mb-10 text-sm text-pink-600/80">
            Sign up to start shopping with us
          </p>

          <div className="space-y-5">
            <Input placeholder="Full name" className="h-12" required />
            <Input type="email" placeholder="Email" className="h-12" required />
            <Input placeholder="Phone" className="h-12" required />
            <Input type="password" placeholder="Password" className="h-12" required />

            <Button className="h-12 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:opacity-90">
              Continue
            </Button>
          </div>

          {/* OR DIVIDER */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-pink-300/60" />
            <span className="text-xs text-pink-600">or</span>
            <div className="h-px flex-1 bg-pink-300/60" />
          </div>

          {/* GOOGLE BUTTON */}
          <Button
            variant="outline"
            className="h-12 w-full rounded-full border-pink-300 bg-white text-pink-700 hover:bg-pink-50 flex items-center justify-center gap-3"
          >
            {/* GOOGLE ICON */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.96 1.08 8.18 2.85l6.12-6.12C34.52 2.44 29.6 0 24 0 14.64 0 6.56 5.38 2.7 13.22l7.36 5.72C11.82 13.22 17.4 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.58-.14-2.72-.46-3.9H24v7.38h12.7c-.26 2.02-1.66 5.06-4.78 7.1l7.3 5.66C43.7 36.66 46.1 30.96 46.1 24.5z" />
              <path fill="#FBBC05" d="M10.06 28.94c-.48-1.42-.76-2.94-.76-4.44s.28-3.02.74-4.44l-7.36-5.72C.9 17.98 0 20.92 0 24.5s.9 6.52 2.68 9.66l7.38-5.22z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.3-5.66c-1.96 1.38-4.6 2.34-8.6 2.34-6.6 0-12.18-3.72-13.94-8.94l-7.38 5.22C6.54 42.62 14.64 48 24 48z" />
            </svg>

            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-pink-700/80">
            Already have an account?{" "}
            <span className="font-semibold text-pink-800 hover:underline cursor-pointer">
              Login
            </span>
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
