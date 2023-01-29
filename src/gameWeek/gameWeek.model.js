"use strict";
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
    startTime: {
        type: String, 
        required: 'Please specify start time',
    },
    endDate: {
        type: Date, 
        required: 'Please specify end date',
    },
    endTime: {
        type: String, 
        required: 'Please specify end time',
    },
    title: {
        type: String,
        // required: [true, "title is required"]
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

gameWeekSchema.methods.toJSON = function () {
   
    return {
      id: this._id,
      gameWeek: this.gameWeek,
      startDate: this.startDate.toISOString().split('T')[0],
      endDate: this.endDate.toISOString().split('T')[0],
      title: this.title,
      status: this.status
    };
  };

var gameWeekModel = mongoose.model("gameWeek", gameWeekSchema, "gameWeek");

module.exports = gameWeekModel;