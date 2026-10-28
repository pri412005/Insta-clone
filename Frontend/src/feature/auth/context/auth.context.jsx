import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const [profileUser, setProfileUser] = useState(null)

    const [authLoading, setAuthLoading] = useState(true)

    const [profileLoading, setProfileLoading] = useState(false)

    const [errors, setErrors] = useState({})

    const [profilePosts, setProfilePosts] = useState([])

    const [search, setSearch] = useState("")


    return (

        <AuthContext.Provider
            value={{

                user,
                setUser,

                profileUser,
                setProfileUser,

                authLoading,
                setAuthLoading,

                profileLoading,
                setProfileLoading,

                errors,
                setErrors,

                search,
                setSearch,

                profilePosts,
                setProfilePosts,


            }}
        >

            {children}

        </AuthContext.Provider>

    )

}