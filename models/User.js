const {Schema , model} = require("mongoose")

const User = new Schema({
    username:{type:String , unique:true , required:true},
    password:{type:String ,  required:true},
    roles: [{type:String ,  ref:"Role"}],
    email:{type:String ,  required:true},
    count:{type:Number },
    level:{type:Number },
})

module.exports = model("User" , User)

