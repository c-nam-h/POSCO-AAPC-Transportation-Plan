const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PackingListSchema = new Schema({
    vessel_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    vesselName: {
        type: String,
        required: true
    },
    coilContainerNo: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    transportationType: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    specification: {
        type: String,
        required: true
    },
    thickness: {
        type: Number,
        min: [0, "Negative Thickness"],
        required: true
    },
    width: {
        type: Number,
        min: [0, "Negative Width"],
        required: true
    },
    netWeightKg: {
        type: Number,
        min: [0, "Negative Net Weight"],
        required: true
    },
    grossWeightKg: {
        type: Number,
        min: [0, "Negative Gross Weight"],
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    importerConsignee: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    inputDate: {
        type: Date,
        default: new Date(),
        required: true
    },
    inputPersonName: {
        type: String,
        // required: true
    },
    inputPersonID: {
        type: mongoose.Schema.ObjectId,
        // required: true
    },
    confirmDate: {
        type: Date
    },
    confirmPersonName: {
        type: String
    },
    confirmPersonID: {
        type: mongoose.Schema.ObjectId
    }
})

const PackingList = mongoose.model("PackingList", PackingListSchema);
module.exports = PackingList;