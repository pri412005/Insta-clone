import otpGenerator from "otp-generator";
import authModel from "../model/auth.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/token.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpTemplate } from "../email/otpTemplate.js";
import { welcomeTemplate } from "../email/welcomeTemplate.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import redis from "../config/cache.js";

export const sendOTP = async (email, username, password) => {
    try {
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        console.log(otp);

        const hashedOTP = await bcrypt.hash(otp, 10);
        password: password
        const existing = await redis.get(`insta:otp:${email}`);
        if (existing) {
            throw new AppError("Please wait before requesting another OTP", 400);
        }

        await redis.set(
            `insta:otp:${email}`,
            JSON.stringify({
                otp: hashedOTP,
                username,
                password
            }),
            "EX",
            300
        );

        await sendEmail({
            to: email,
            subject: "Verify Your Email - SnapSphere",
            html: otpTemplate(username, otp)
        });

        return true;

    } catch (err) {
        console.error("sendOTP error:", err);
        throw new AppError("Failed to send OTP. Please try again.", 500);
    }
};
export const verifyOTPAndRegister = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    const data = await redis.get(`insta:otp:${email}`);

    if (!data) {
        await redis.del(`insta:otp_attempts:${email}`);
        return next(new AppError("OTP expired", 400));
    }
    const parsedData = JSON.parse(data);

    const { otp: hashedOTP, username, password } = parsedData;

    const isValid = await bcrypt.compare(
        otp.toString().trim(),
        hashedOTP
    );
    if (!isValid) {
        let attempts = await redis.get(`insta:otp_attempts:${email}`) || 0;
        attempts = Number(attempts) + 1;

        await redis.set(`insta:otp_attempts:${email}`, attempts, "EX", 120);

        if (attempts >= 5) {
            return next(new AppError("Too many attempts. Try again later.", 429));
        }

        return next(new AppError("Invalid OTP", 400));
    }
    await redis.del(`insta:otp_attempts:${email}`);

    const existingUser = await authModel.findOne({ email });

    if (existingUser) {
        return next(new AppError("User already exists", 409));
    }
    const user = await authModel.create({
        username,
        email,
        password,
        isVerified: true
    });

    await redis.del(`insta:otp:${email}`);

    await sendEmail({
        to: user.email,
        subject: "Welcome to SnapSphere 🎉",
        html: welcomeTemplate(user.username)
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
});