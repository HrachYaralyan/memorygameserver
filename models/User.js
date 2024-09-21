const {Schema , model} = require("mongoose")

const LevelDifficultySchema = new Schema({
    easy: { type: [Number], default: [1, 0, 0, 0, 0] },
    normal: { type: [Number], default: [0, 0, 0, 0, 0] },
    hard: { type: [Number], default: [0, 0, 0, 0, 0] },
    veryHard: { type: [Number], default: [0, 0, 0, 0, 0] }
});

// Subschema for each world
const WorldSchema = new Schema({
    isHaveAccess: { type: Boolean, default: false },
    levelDifficulty: { type: LevelDifficultySchema, default: {} }
});


const User = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: "Role" }],
    email: { type: String, required: true },
    count: { type: Number },
    level: { type: Number },
    worlds: {
        dragons: { type: WorldSchema, default: { isHaveAccess: true }},
        mythical: { type: WorldSchema, default: { isHaveAccess: true }},
        space: { type: WorldSchema, default: { isHaveAccess: false }},
        jungle: { type: WorldSchema, default: { isHaveAccess: false }},
        ocean: { type: WorldSchema, default: { isHaveAccess: false }}
    }
});

module.exports = model("User" , User)















// const {Schema , model} = require("mongoose")

// const User = new Schema({
//     username:{type:String , unique:true , required:true},
//     password:{type:String ,  required:true},
//     roles: [{type:String ,  ref:"Role"}],
//     email:{type:String ,  required:true},
//     count:{type:Number },
//     level:{type:Number },
// })

// module.exports = model("User" , User)

