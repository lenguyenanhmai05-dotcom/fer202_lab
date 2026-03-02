import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AuthForm from "@/components/AuthForm"

export default function Register() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData) => {
        setIsLoading(true)

        // Using Supabase Auth
        const { error } = await signUp(formData.email, formData.password, formData.name)

        setIsLoading(false)

        if (error) {
            alert(error.message || "Registration failed!")
            return
        }

        alert("Registration successful! Redirecting to login...")
        navigate("/login")
    }

    return <AuthForm type="register" onSubmit={handleSubmit} isLoading={isLoading} />
}
