import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth.context'

import {
    login,
    register,
    getCurrentUser,
    logout,
    verifyUser,
    updateProfileApi,
    getAllUsersApi,
    getUserByIdApi
} from '../services/auth.api'

import { handleApi } from '../../shared/utils/apihandler'

export const useAuth = () => {

    const {
        user,
        setUser,

        authLoading,
        setAuthLoading,

        profileLoading,
        setProfileLoading,

        errors,
        setErrors,

        profileUser,
        setProfileUser,

        profilePosts,
        setProfilePosts

    } = useContext(AuthContext)

    const handlegetCurrentUser = async () => {

        try {

            const data = await getCurrentUser()

            setUser(data.user)

        } catch (error) {

            if (error?.response?.status === 401) {
                setUser(null)
            }

        } finally {

            setAuthLoading(false)

        }

    }

    const handleRegister = async (formData) => {

        return handleApi({

            apiCall: () => register(formData),

            setLoading: setAuthLoading,

            setErrors,

            errorMessage: "Registration failed"

        })

    }

    const handleVerifyUser = async (formData) => {

        return handleApi({

            apiCall: () => verifyUser(formData),

            setLoading: setAuthLoading,

            onSuccess: (data) => {

                setUser(data.user)

            },

            errorMessage: "OTP verification failed"

        })

    }

    const handleLogin = async (formData) => {

        return handleApi({

            apiCall: () => login(formData),

            setLoading: setAuthLoading,

            setErrors,

            onSuccess: (data) => {

                setUser(data.user)

            },

            errorMessage: "Login failed"

        })

    }

    const handleLogout = async () => {

        return handleApi({

            apiCall: () => logout(),

            setLoading: setAuthLoading,

            onSuccess: () => {

                setUser(null)

            }

        })

    }

    const handleUpdateProfile = async (formData) => {

        return handleApi({

            apiCall: () => updateProfileApi(formData),

            setLoading: setAuthLoading,

            onSuccess: (data) => {

                if (data?.user) {

                    setUser(data.user)

                }

            }

        })

    }

    const handleGetUserById = async (id) => {

        return handleApi({

            apiCall: () => getUserByIdApi(id),

            setLoading: setProfileLoading,

            onSuccess: (data) => {

                if (data?.user) {

                    setProfileUser(data.user)

                }

                if (data?.posts) {

                    setProfilePosts(data.posts)

                }

            },

            errorMessage: "Failed to fetch user details"

        })

    }

    useEffect(() => {

        handlegetCurrentUser()

    }, [])

    return {

        user,
        setUser,

        authLoading,
        setAuthLoading,

        profileLoading,
        setProfileLoading,

        errors,
        setErrors,

        profileUser,
        setProfileUser,

        profilePosts,
        setProfilePosts,

        handleLogin,
        handleRegister,
        handleVerifyUser,
        handleLogout,
        handleUpdateProfile,
        handleGetUserById

    }

}