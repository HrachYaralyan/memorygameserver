const User =  require("./models/User")
const Role = require("./models/Role")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator")
const {secret} = require("./config")

const generateAccsesToken = (id , roles)=>{
    const payload ={
        id,
        roles
    } 
    return jwt.sign(payload,secret, {expiresIn:"24h"} )
}

const generateRefreshToken = (id) => {
    const payload = { id }
    return jwt.sign(payload, secret, { expiresIn: "7d" })
}

class authConroller{
    async registration(req , res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Registration error ", errors})
            }
            const  {username , password ,email} = req.body
            const candidate = await User.findOne({username})
            if(candidate){
                return res.status(400).json({message:"Please change your Username(( cos we have this name in our DB"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value:"USER"})
            const user = new User({username ,password :hashPassword ,email, count:0,level:1, roles:[userRole.value]})
            await user.save()
            return res.json({message:"User added correctly ))"})
        } catch (e) {
            res.status(400).json({message:`Registration error - ${e}`})
        }
    }

    async login(req , res){
        try {
            const  {username , password} = req.body
            const user = await User.findOne({username})
            if(!user){
                res.status(400).json({message:` This user name - ${username} is Invalid `})
            }

            const validPassword = bcrypt.compareSync(password , user.password)
            
            if(!validPassword){
                res.status(400).json({message:` This password is Invalid `})
            }
            const accessToken = generateAccsesToken(user._id , user.roles)
            const refreshToken = generateRefreshToken(user._id)

            console.log(user,"<-----user")
            let userInformation = {
                username:user.username,
                level:user.level,
                count:user.count,
                id:user._id,
                accessToken:accessToken,
                refreshToken: refreshToken,
                worlds:user.worlds
            }
            return res.json(userInformation)

            
        } catch (e) {
            res.status(400).json({message:"Login error"})
            
        }
    }

    async getUsers(req , res){
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

    async update(req , res){
        try {
            const userId = req.params.id;
            const { level, count } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.level = level; 
            user.count += Number(count);
        
            await user.save();

            res.status(200).json({ message: 'Update successful', updatedUser: user });

        } catch (e) {
            res.status(500).json({ message: 'Memory game Server error ', error: error.message });
        }
    }

        async refreshTokens(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token is required" });
            }

            let userId;
            try {
                const decoded = jwt.verify(refreshToken, secret);
                userId = decoded.id;                
            } catch (e) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Generate new tokens
            const newAccessToken = generateAccsesToken(user._id, user.roles);
            const newRefreshToken = generateRefreshToken(user._id);

            return res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });

        } catch (e) {
            res.status(500).json({ message: `Token refresh error - ${e}` });
        }
    }
}


module.exports = new authConroller()



// const userRole = new Role()
// const adminRole = new Role({value:"ADMIN"})
// await userRole.save()
// await adminRole.save()
