import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user || null)
            setLoading(false)
        })

        // Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user || null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email, password, name) => {
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        })
        setLoading(false)
        return { data, error }
    }

    const signIn = async (email, password) => {
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setLoading(false)
        return { data, error }
    }

    const signOut = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signOut()
        setLoading(false)
        return { error }
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}
