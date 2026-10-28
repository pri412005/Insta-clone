import React, { useEffect, useState } from 'react'
import FormGroup from '../../../Componenet/FormGroup'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { verifyUser } from '../services/auth.api'
import { useFormHandler } from '../hook/useformhandler'
import "../style/verifyotp.scss"

const VerifyOTP = () => {
    const { setUser, errors, setErrors, loading, setLoading } = useAuth()
    const submit = useFormHandler(verifyUser, setErrors, setLoading)
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setemail] = useState(location.state?.email || "")
    const [otp, setotp] = useState("")

    useEffect(() => {
        if (!location.state?.email) {
            navigate("/register")
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        await submit(
            { email, otp: otp.trim() },
            (data) => {
                try {
                    setUser(data.user)
                    navigate("/")
                } catch (err) {
                    console.error("onSuccess error:", err)
                }
            }
        )
    }

    return (
        <div>
            <main className="verifyotp-page">
                <div className="form-container">

                    <h2>📩 Verify your account</h2>
                    <p>Enter the OTP sent to your email</p>

                    <form onSubmit={handleSubmit}>
                        {errors.otp && <p className="error-text">{errors.otp}</p>}
                        {errors.api && <p className="error-text">{errors.api}</p>}
                        <FormGroup
                            value={email}
                            placeholder="Enter Your Email"
                            readOnly
                            type="email"
                            onChange={(e) => {
                                setemail(e.target.value)
                                setErrors(prev => ({ ...prev, email: "" }))
                            }}
                        />

                        <FormGroup
                            value={otp}
                            placeholder="Enter Your OTP"
                            type="text"
                            onChange={(e) => {
                                setotp(e.target.value)
                                setErrors(prev => ({ ...prev, otp: "" }))
                            }}
                        />

                        <button type="submit" className="button" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                </div>
            </main>
        </div>
    )
}

export default VerifyOTP