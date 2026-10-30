import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaInstagram,
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../hook/useAuth";
import { useFormHandler } from "../hook/useformhandler";
import "../style/login.scss"

const Login = () => {
    const { handleLogin, errors, setErrors, loading, setLoading } = useAuth();

    const submit = useFormHandler(handleLogin, setErrors, setLoading);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        submit({ email, password }, () => navigate("/"));
    }

    function handleGoogleLogin() {
        console.log("Google login integration is not connected yet.");
    }

    const clearErrors = (field, value) => {
        if (field === "email") setEmail(value);
        if (field === "password") setPassword(value);

        setErrors((prev) => ({
            ...prev,
            [field]: "",
            api: "",
        }));
    };

    return (
        <main className="login-page">

            {/* LEFT SECTION - DESKTOP */}
            <section className="login-visual">

                <div className="login-visual__gradient login-visual__gradient--top" />
                <div className="login-visual__gradient login-visual__gradient--bottom" />

                {/* Logo */}
                <Link to="/" className="brand-logo">
                    <span className="brand-logo__icon">
                        <FaInstagram />
                    </span>

                    <span className="brand-logo__name">SnapSphere</span>
                </Link>

                {/* Hero Content */}
                <div className="login-hero">

                    <div className="login-hero__content">
                        <div className="login-hero__tag">
                            <FaWandMagicSparkles />
                            <span>SHARE YOUR WORLD</span>
                        </div>

                        <h1 className="login-hero__heading">
                            Little
                            <br />
                            moments.
                            <br />
                            <span>Big</span>
                            <br />
                            <span>memories.</span>
                        </h1>

                        <p className="login-hero__description">
                            A space for the people, places, and everyday stories that make
                            life feel a little more beautiful.
                        </p>
                    </div>

                    {/* Visual Collage */}
                    <div className="login-collage">

                        <div className="login-collage__images">
                            <img
                             src="/loginpageImg.jfif"
                                alt="A memorable moment"
                            />

                            <img
                               src="/loginpageImg1.jfif"
                                alt="Coffee moments"
                            />

                            <img
                               src="/loginpageImg2.jfif"
                                alt="Friends spending time together"
                            />

                            <img
                               src="/loginpageImg3.jfif"
                                alt="A happy dog"
                            />
                        </div>

                        <div className="login-collage__caption">
                            <span className="login-collage__avatar" />

                            <div>
                                <p>Your people, your place</p>
                                <span>Make every moment count</span>
                            </div>
                        </div>

                    </div>
                </div>

                <footer className="login-visual__footer">
                    © 2026 SnapSphere · Made for meaningful moments
                </footer>
            </section>

            {/* RIGHT SECTION - LOGIN FORM */}
            <section className="login-form-section">

                <div className="login-container">

                    {/* Logo - MOBILE */}
                    <Link to="/" className="brand-logo brand-logo--mobile">
                        <span className="brand-logo__icon">
                            <FaInstagram />
                        </span>

                        <span className="brand-logo__name">SnapSphere</span>
                    </Link>

                    {/* Heading */}
                    <div className="login-heading">
                        <h2>Welcome back</h2>
                        <p>Log in to keep up with your world.</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} noValidate>

                        {/* API Error */}
                        {errors?.api && (
                            <div className="login-error login-error--api" role="alert">
                                {errors.api}
                            </div>
                        )}

                        {/* Email */}
                        <div
                            className={`login-input ${errors?.email ? "login-input--error" : ""
                                }`}
                        >
                            <FaEnvelope className="login-input__icon" />

                            <input
                                type="text"
                                name="email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => clearErrors("email", e.target.value)}
                                placeholder="Email or username"
                                aria-label="Email or username"
                                aria-invalid={Boolean(errors?.email)}
                            />
                        </div>

                        {errors?.email && (
                            <p className="login-error">{errors.email}</p>
                        )}

                        {/* Password */}
                        <div
                            className={`login-input login-input--password ${errors?.password ? "login-input--error" : ""
                                }`}
                        >
                            <FaLock className="login-input__icon" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => clearErrors("password", e.target.value)}
                                placeholder="Password"
                                aria-label="Password"
                                aria-invalid={Boolean(errors?.password)}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {errors?.password && (
                            <p className="login-error">{errors.password}</p>
                        )}

                        {/* Forgot Password */}
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="login-divider">
                        <span />
                        <p>OR</p>
                        <span />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="google-button"
                    >
                        <FcGoogle />
                        <span>Continue with Google</span>
                    </button>

                    {/* Register */}
                    <p className="register-text">
                        New to SnapSphere?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>

                    {/* Terms */}
                    <p className="terms-text">
                        By continuing, you agree to our{" "}
                        <Link to="/terms">Terms</Link>
                        {" "}and{" "}
                        <Link to="/privacy">Privacy Policy</Link>.
                    </p>

                </div>
            </section>
        </main>
    );
};

export default Login;