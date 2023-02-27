"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;


const gameWeekSchema = new Schema({
    startDate: {
        type: Date,
        index: true,
        required: 'Please specify start date',
    },
    startTime: {
        type: String,
        default: '00:00',
        required: 'Please specify start time',
    },
    endDate: {
        type: Date,
        index: true,
        required: 'Please specify end date',
    },
    endTime: {
        type: String,
        default: '23:59',
        required: 'Please specify end time',
    },
    title: {
        type: String,
        required: [true, "title is required"]
    },
    status: {
        type: String,
        default: "Scheduled",
        index: true,
        required: [true, "status is required"],
        enum: ["Scheduled", "Live", "Passed"],
    }
},
    {
        timestamps: true,
    });

gameWeekSchema.methods.toJSON = function () {

    return {
        id: this._id,
        startDate: this.startDate.toISOString().split('T')[0],
        endDate: this.endDate.toISOString().split('T')[0],
        endTime: this.endTime,
        startTime: this.startTime,
        title: this.title,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

var gameWeekModel = mongoose.model("gameWeek", gameWeekSchema, "gameWeek");

module.exports = gameWeekModel;