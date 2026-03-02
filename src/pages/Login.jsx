import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AuthForm from "@/components/AuthForm"

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { signIn } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    // Redirect back to previous page or home
    const from = location.state?.from || "/"

    const handleSubmit = async (formData) => {
        setIsLoading(true)
        const { error } = await signIn(formData.email, formData.password)
        setIsLoading(false)

        if (error) {
            alert(error.message || "Invalid email or password!")
        } else {
            alert("Login successful!")
            navigate(from)
        }
    }

    return <AuthForm type="login" onSubmit={handleSubmit} isLoading={isLoading} />
}
