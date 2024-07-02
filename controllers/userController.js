const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailSender");
// make a function(Logic)

// 1. Creating a user function
const createUser = async (req, res) => {
    console.log(req.body);
    // destructuring
    const { firstName, lastName, address, email, password } = req.body;
    if (!firstName || !lastName || !address || !email || !password) {
        console.log(firstName, lastName, address, email, password);
        return res.json({
            sucess: false,
            message: "please enter all fields!",
        });
    }
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User Already Exists!",
            });
        }
        // Hash the password
        const randomSalt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, randomSalt);

        // Save the User in Database Model
        const newUser = new userModel({
            firstName: firstName,
            lastName: lastName,
            address: address,
            email: email,
            password: hashPassword,
        });

        // Saving the data in database
        await newUser.save();

        // Send the sucess responce
        res.json({
            success: true,
            message: "user created sucessfully",
        });
    } catch (error) {
        console.log(error);
        res.json({
            sucess: false,
            message: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    // res.send("Login APi iis working")
    console.log(req.body);
    // Destructuting
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            sucess: false,
            message: "Enter Email or Password",
        });
    }
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.json({
                sucess: false,
                message: "Invalid Email",
            });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.json({
                sucess: false,
                message: "Invalid Crediantials!",
            });
        }
        // generating JWT token
        const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            sucess: true,
            message: "Login Sucessfull!",
            token: jwtToken,
            user: user,
        });
    } catch (e) {
        res.json({
            sucess: false,
            message: "Interal Server Error",
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            sucess: false,
            message: "Please provide Email!",
        });
    }
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: "Invalid Email",
            });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = Date.now() + 600000; //10 minutes form noe

        user.verificationCode = verificationCode;
        user.verificationExpire = expirationTime;
        await user.save();

        // Sending email with otp
        await sendEmail(
            user.email,
            "OTP for passowrd reset", "",
            `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #d5b6ea; font-size: 24px; margin-bottom: 20px;">OTP Verification Code</h1>
            <p style="color: #333; margin-bottom: 10px;">Hi ${user.firstName},</p>
            <p style="color: #333; margin-bottom: 20px;">Your OTP code is <strong style="font-size: 28px; color: #d5b6ea; background-color: #e9f7ef; padding: 5px 10px; border-radius: 4px;">${verificationCode}</strong></p>
            <p style="color: #333;">Please enter this code to complete your verification. It is valid for 10 minutes.</p>
            <p style="color: #333; margin-bottom: 20px">If you did not request this code, please ignore this email.</p>
            <p style="color: #333; margin-bottom: 10px;">Thank you,<br>Sajilsales</p>
            <p style="font-size: 12px; color: #888; margin-top: 30px;">&copy; 2024 Sajilsales. All rights reserved.</p>
            </div>`
        );
        // Success Message
        res.status(200).json({
            'success': true,
            'message': 'OTP Send Successfully!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error!",
        });
    }
};


const resetPassword = async (req, res) => {
    console.log(req.body);
    const { email, newPassword, verificationCode } = req.body;
    if (!email || !newPassword || !verificationCode) {
        return res.status(400).json({
            sucess: false,
            message: "please enter all fields!",
        });
    }
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.verificationCode == verificationCode) {
            if (Date.now() > user.verificationExpire) {
                return res.status(400).json({
                    success: false,
                    message: "OTP has expired. Please request a new one.",
                });
            }

            // Hash the new password
            const randomSalt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, randomSalt);

            // Update user's password and clear verification fields
            user.password = hashedPassword;
            user.verificationCode = undefined;
            user.verificationExpire = undefined;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password reset successfully.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code.",
            });
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            sucess: false,
            message: "Interal Server Error",
        });
    }
}

// exporting the createuse
module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    resetPassword,


};
