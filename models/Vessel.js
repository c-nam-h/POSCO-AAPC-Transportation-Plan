const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VesselSchema = new Schema({
    name: String,
    ETA: Date,
    actualArrivalDate: Date,
    LFD: Date
});

const Vessel = mongoose.model("Vessel", VesselSchema);

module.exports = Vessel;