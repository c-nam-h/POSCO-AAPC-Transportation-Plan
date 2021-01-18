const express = require("express")
const app = express()
const ejs = require("ejs")
app.set ("view engine", "ejs")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"))

const XLSX = require("xlsx")
const formidable = require('formidable')

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", {useNewUrlParser: true, useUnifiedTopology: true})






const Vessel = require("./models/Vessel");
// Vessel.create({
//     name: "Mandarin",
//     ETA: "2021-1-3",
//     actualArrivalDate: "2021-1-4"
// })



app.get("/", async (req, res) => {
    const vessel = await Vessel.find({});
    res.render("index", {
    vessel,
    errorValue: null
    });
})



const PackingList = require("./models/PackingList");


// console.log(packingList.validateSync().errors);




app.post("/", async (req, res) => {
    const packingListArray = JSON.parse(req.body.table);
    const vessel_id = req.body.vessel;
    const selectedVessel = await Vessel.findById(vessel_id);
    const vessel = await Vessel.find({});
    const vesselName = selectedVessel.name;

    console.log(vessel_id, vesselName)


    // validate whether input data has the correct data type
    for (var i = 0; i < packingListArray.length; i++) {
        if ( isNaN( packingListArray[i][6] )) { // thickness => Number
            console.log("thickness value error")
            res.redirect("/");
            return
        }

        if ( isNaN( packingListArray[i][7] )) { // width => Number
            console.log("width value error")
            res.redirect("/");
            return
        }

        if ( isNaN( packingListArray[i][8] )) { // net weight => Number
            console.log("net weight value error")
            res.redirect("/");
            return
        }

        if ( isNaN( packingListArray[i][9] )) { // gross weight => Number
            console.log("gross weight value error")
            res.redirect("/");
            return
        }
        console.log("Delivery date:", packingListArray[i][10].deliveryDate)
        console.log(packingListArray[i][10].deliveryDate instanceof Date);

        if (packingListArray[i][10].deliveryDate instanceof Date === false) {
            res.redirect("/");
            return
        }
    }


    for (var i = 0; i < packingListArray.length; i++) {

        console.log(typeof packingListArray[i][6])

        await PackingList.create({
            vessel_id,
            vesselName,
            coilContainerNo: packingListArray[i][0],
            origin: packingListArray[i][1],
            destination: packingListArray[i][2],
            transportationType: packingListArray[i][3],
            item: packingListArray[i][4],
            specification: packingListArray[i][5],
            thickness: packingListArray[i][6],
            width: packingListArray[i][7],
            netWeightKg: packingListArray[i][8],
            grossWeightKg: packingListArray[i][9],
            deliveryDate: packingListArray[i][10],
            importerConsignee: packingListArray[i][11],
            customer: packingListArray[i][12],
            remark: packingListArray[i][13],
            inputDate: "1/16/2021",
            inputPerson: "Namhyun Cho",
            confirmDate: "1/16/2021",
            confirmPerson: "Daphne Glover"
        })
    }
    console.log("successfully uploaded")
    res.redirect("/");
})



app.listen(3000, () => {
    console.log("App listening on port 3000")
});
