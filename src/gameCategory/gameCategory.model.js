let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const gameCategorySchema = new Schema({
    category: {
        type: String, 
        trim: true,
        unique: true
    },
    description: {
        type: String, 
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    }
},
{
    timestamps: false,
});

var gameCategoryModel = mongoose.model("gameCategory", gameCategorySchema, "gameCategory");

module.exports = gameCategoryModel;