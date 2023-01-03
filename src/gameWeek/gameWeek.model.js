let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const gameWeekSchema = new Schema({
    gameWeek: {
        type: Number, 
        unique: true,
        index: true,
    },
    startDate: {
        type: Date, 
        required: 'Please specify start date',
    },
    endDate: {
        type: Date, 
        required: 'Please specify end date',
    },
    status: {
        type: String,
        default: "Scheduled",
        required: [true, "status is required"],
        enum: ["Scheduled", "Live", "Passed"],
    }
},
{
    timestamps: false,
});

var gameWeekModel = mongoose.model("gameWeek", gameWeekSchema, "gameWeek");

module.exports = gameWeekModel;