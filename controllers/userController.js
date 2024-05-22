const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
// make a function(Logic)

// 1. Creating a user function
const createUser = async (req, res) => {
    console.log(req.body)
    // destructuring
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.json({
            "sucess": false,
            'message': "please enter all fields!"
        })
    }
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }
        // Hash the password
        const randomSalt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, randomSalt);


        // Save the User in Database Model
        const newUser = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword
        }
        )

        // Saving the data in database
        await newUser.save()


        // Send the sucess responce
        res.json({
            "success": true,
            "message": "user created sucessfully"
        })

    }
    catch (error) {
        console.log(error);
        res.json({
            "sucess": false,
            "message": "Internal server error"
        })
    }
}

const loginUser = async (req, res) => {
    // res.send("LOgin APi iis working")
    console.log(req.body)
    // Destructuting
    const { email, password } = req.body
    if (!email ||
        !password
    ) {
        return res.json({
            "sucess": false,
            "message": "Enter Email or Password"
        })
    }
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.json({
                "sucess": false,
                "message": "Invalid Email"
            })
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.json({
                "sucess": false,
                "message": "Invalid Crediantials!"
            })
        }
        // generating JWT token
        const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            "sucess": true,
            "message": "Login Sucessfull!",
            "token": jwtToken,
            "user": user
        })


    } catch (e) {
        res.json({
            "sucess": false,
            "message": "Interal Server Error"

        })
    }

}

// exporting the createuse
module.exports = {
    createUser, loginUser
}