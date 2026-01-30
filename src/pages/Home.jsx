import { useState, useEffect } from "react"
import NavHeader from "@/components/NavHeader"
import ProductCard from "@/components/ProductCard"

const products = [
    {
        id: 1,
        name: "Serum Torriden",
        price: "550.000 ₫",
        description: "Deeply hydrating serum with hyaluronic acid for a plump and glowing complexion.",
        image: "https://i.pinimg.com/1200x/cc/c5/81/ccc581b17e4c8b9f4cc909e7783f0804.jpg",
        rating: 5,
    },
    {
        id: 2,
        name: "Nail Pink",
        price: "375.000 ₫",
        description: "Elegant pink press-on nails for a sophisticated and feminine look.",
        image: "https://i.pinimg.com/1200x/af/b3/a9/afb3a960cc87a1d5c9dfbcfd92df4c39.jpg",
        rating: 4,
    },
    {
        id: 3,
        name: "Pretty Dress",
        price: "1.125.000 ₫",
        description: "A charming dress with delicate details, perfect for any special occasion.",
        image: "https://i.pinimg.com/1200x/42/f5/89/42f589c6d483ded587f4113af15424c3.jpg",
        rating: 5,
    },
    {
        id: 4,
        name: "Coo Model Butterfly",
        price: "450.000 ₫",
        description: "Exquisite butterfly-themed decor to add a touch of whimsy to your space.",
        image: "https://i.pinimg.com/1200x/67/e6/21/67e6211183c6ca64dbc189ee3aff5d99.jpg",
        rating: 5,
    },
    {
        id: 5,
        name: "Dreamy Women's Bag",
        price: "875.000 ₫",
        description: "Stylish and practical bag designed to complement your dreamy aesthetic.",
        image: "https://i.pinimg.com/736x/44/a2/10/44a210531db9897550407cf5c6159ffb.jpg",
        rating: 4,
    },
    {
        id: 6,
        name: "Pretty Pink Water Bottle",
        price: "625.000 ₫",
        description: "Stay hydrated in style with this durable and cute pink water bottle.",
        image: "https://i.pinimg.com/736x/7b/92/37/7b923783ef97c09db43b204b46fc3dba.jpg",
        rating: 5,
    },
    {
        id: 7,
        name: "Super Cute Night Light",
        price: "500.000 ₫",
        description: "A soft, warm glow to comfort you through the night. Adorable design.",
        image: "https://i.pinimg.com/736x/6b/72/60/6b72606419ef5e32376964dabe286ad6.jpg",
        rating: 4,
    },
    {
        id: 8,
        name: "GladGlow Body Wash",
        price: "700.000 ₫",
        description: "Brightening body wash for radiant, smooth, and healthy-looking skin.",
        image: "https://i.pinimg.com/1200x/b9/91/26/b99126e3c9ef7aac033e05b8de41bb9a.jpg",
        rating: 5,
    },
    {
        id: 9,
        name: "Girl's Bracelet",
        price: "300.000 ₫",
        description: "Dainty and elegant bracelet, the perfect accessory for a subtle shine.",
        image: "https://i.pinimg.com/1200x/57/97/57/579757008a6d6601b4834dc383e7490a.jpg",
        rating: 4,
    },
    {
        id: 10,
        name: "Lip Balm for Rosy Lips",
        price: "200.000 ₫",
        description: "Nourishing balm that leaves your lips soft, hydrated, and naturally rosy.",
        image: "https://i.pinimg.com/736x/7d/9f/d5/7d9fd58dd107856cf4d728997a90fbde.jpg",
        rating: 5,
    },
    {
        id: 11,
        name: "Sport Shoes",
        price: "1.375.000 ₫",
        description: "Comfortable and stylish sport shoes for your active lifestyle.",
        image: "https://i.pinimg.com/736x/76/9d/62/769d629fa24fec4c9fb4e6315852e560.jpg",
        rating: 5,
    },
    {
        id: 12,
        name: "Cushion Mooekiss",
        price: "800.000 ₫",
        description: "Flawless coverage cushion foundation for a natural, dewy finish.",
        image: "https://i.pinimg.com/1200x/46/4e/eb/464eeb8a42b09c576ec75686755c12c9.jpg",
        rating: 4,
    },
    {
        id: 13,
        name: "Romand Lipstick",
        price: "350.000 ₫",
        description: "Velvety smooth lipstick with vibrant, long-lasting color.",
        image: "https://i.pinimg.com/736x/3a/5b/9a/3a5b9a8a33c4352b7054ba536863f296.jpg",
        rating: 5,
    },
    {
        id: 14,
        name: "Makeup Set with Bow",
        price: "1.200.000 ₫",
        description: "Complete makeup set in adorable bow-themed packaging.",
        image: "https://i.pinimg.com/736x/d6/53/04/d653040c29b3bac874684c851676932f.jpg",
        rating: 5,
    },
    {
        id: 15,
        name: "Garnier Makeup Remover",
        price: "225.000 ₫",
        description: "Gentle yet effective makeup remover for all skin types.",
        image: "https://i.pinimg.com/736x/a9/a9/69/a9a969373607f7c2153c7e86e2098d1c.jpg",
        rating: 4,
    },
    {
        id: 16,
        name: "Decorative Shelves",
        price: "1.625.000 ₫",
        description: "Minimalist decorative shelves to showcase your favorite items.",
        image: "https://i.pinimg.com/736x/80/34/a9/8034a98b020201e941ccf1e3632a41e7.jpg",
        rating: 5,
    },
]

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
