import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiInstagram } from "react-icons/fi"
import { BsStars } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import { useAuth } from "../hook/useAuth"
import { useFormHandler } from "../hook/useformhandler"
import "../style/register.scss"

// Unsplash photos (swap any link with your own image if you want)
const PHOTOS = [
  "/loginpageImg2.jfif",
  "/registerpageimg1.jpg",
  "/registerpageimg2.jpg",
]

const Register = () => {
  const { handleRegister, errors, setErrors, loading, setLoading } = useAuth()
  const navigate = useNavigate()
  const submit = useFormHandler(handleRegister, setErrors, setLoading)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // remove the error of a single field when the user starts typing again
  const clearError = (field) =>
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
      return
    }

    submit({ email, username, password }, () =>
      navigate("/verify-otp", { state: { email } })
    )
  }

  function handleGoogle() {
    // TODO: connect your Google OAuth flow here
    console.log("Continue with Google")
  }

  return (
    <main className="register-page">
      {/* ================= LEFT : HERO ================= */}
      <section className="reg-hero">
        <div className="reg-brand">
          <span className="reg-brand__logo">
            <FiInstagram />
          </span>
          <span className="reg-brand__name">SnapSphere</span>
        </div>

        <div className="reg-hero__text">
          <span className="reg-hero__badge">
            <BsStars /> FIND YOUR PEOPLE
          </span>

          <h1>
            Your
            <br />
            story
            <em>
              starts
              <br />
              here.
            </em>
          </h1>

          <p>
            Collect the little joys, follow the people who inspire you, and make
            space for what matters.
          </p>

          <div className="reg-hero__note">
            <span className="reg-hero__num">01</span>
            One profile. Many moments.
          </div>
        </div>

        <div className="reg-hero__visual" aria-hidden="true">
          <span className="reg-blob reg-blob--peach" />
          <span className="reg-blob reg-blob--lilac" />

          <div className="reg-phone">
            <span className="reg-phone__tag">MOMENTS TOGETHER</span>
            <span className="reg-phone__shape reg-phone__shape--rose" />
            <span className="reg-phone__shape reg-phone__shape--sand" />
            {PHOTOS.map((src, i) => (
              <div
                key={i}
                className={`reg-photo reg-photo--${["one", "two", "three"][i]}`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            ))}
          </div>

          <div className="reg-float">
            <span className="reg-float__avatar" />
            <div>
              <strong>your people, your place</strong>
              <small>Make every moment count</small>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RIGHT : FORM ================= */}
      <section className="reg-side">
        <div className="reg-card">
          <div className="reg-brand reg-brand--mobile">
            <span className="reg-brand__logo">
              <FiInstagram />
            </span>
            <span className="reg-brand__name">SnapSphere</span>
          </div>

          <div className="reg-step">
            <span className="reg-step__bar" />
            STEP ONE OF ONE
          </div>

          <h2>Make it yours</h2>
          <p className="reg-subtitle">
            Set up your profile and start sharing the good stuff.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {errors.api && <p className="reg-api-error">{errors.api}</p>}

            {/* Username */}
            <div className={`reg-field ${errors.username ? "has-error" : ""}`}>
              <div className="reg-field__box">
                <FiUser className="reg-field__icon" />
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  autoComplete="username"
                  onChange={(e) => {
                    setUsername(e.target.value)
                    clearError("username")
                  }}
                />
              </div>
              {errors.username && <p className="reg-error">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className={`reg-field ${errors.email ? "has-error" : ""}`}>
              <div className="reg-field__box">
                <FiMail className="reg-field__icon" />
                <input
                  type="email"
                  value={email}
                  placeholder="Email Address"
                  autoComplete="email"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearError("email")
                  }}
                />
              </div>
              {errors.email && <p className="reg-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`reg-field ${errors.password ? "has-error" : ""}`}>
              <div className="reg-field__box">
                <FiLock className="reg-field__icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearError("password")
                  }}
                />
                <button
                  type="button"
                  className="reg-field__toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="reg-error">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className={`reg-field ${errors.confirmPassword ? "has-error" : ""}`}>
              <div className="reg-field__box">
                <FiLock className="reg-field__icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    clearError("confirmPassword")
                  }}
                />
                <button
                  type="button"
                  className="reg-field__toggle"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="reg-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="reg-submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="reg-divider">
            <span>OR</span>
          </div>

          <button type="button" className="reg-google" onClick={handleGoogle}>
            <FcGoogle />
            Continue with Google
          </button>

          <p className="reg-login">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <p className="reg-terms">
            By continuing, you agree to our <a href="/terms">Terms</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register
