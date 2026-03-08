import { useState, useEffect } from "react"
import NavHeader from "@/components/NavHeader"
import ProductCard from "@/components/ProductCard"
import { products } from "@/data/products"

// Hero Carousel Images
const heroSlides = [
    "/assets/hero_slides/slide1.png",
    "/assets/hero_slides/slide2.png",
    "/assets/hero_slides/slide3.png",
]

export default function Home() {
    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-screen bg-[#fdf2f8]"> {/* Very light pink background */}
            {/* Header */}
            <NavHeader />

            {/* Hero Section (Carousel) */}
            <section className="relative h-[500px] w-full overflow-hidden">
                {/* Slides */}
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img
                            src={slide}
                            alt={`Hero Slide ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ))}

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-center z-10">
                    <div className="space-y-4 px-4 animate-in fade-in zoom-in duration-1000">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-md">
                            Beauty & Elegance
                        </h1>
                        <p className="text-lg md:text-xl text-rose-50 font-medium drop-shadow-sm">
                            Discover the Luxe Collection for your unique style
                        </p>
                    </div>
                </div>

                {/* Indicators (Dots) */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 w-2 rounded-full transition-all ${index === currentSlide
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white/80"
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Products Grid */}
            <main className="container mx-auto px-6 py-16">
                <div className="flex flex-col gap-8">
                    <div className="flex items-end justify-between border-b border-rose-100 pb-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-rose-900">Featured Products</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-rose-100 bg-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <span className="text-lg font-serif font-bold text-rose-900">Luxe Collection</span>
                            <p className="mt-2 text-sm text-rose-900/60">Elevating your everyday with timeless beauty.</p>
                        </div>
                    </div>
                    <div className="border-t border-rose-50 pt-8 text-center text-sm text-rose-400">
                        © 2024 Luxe Collection. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
