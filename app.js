const express = require("express")
const app = express()
const ejs = require("ejs")
app.set ("view engine", "ejs")

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"))

const XLSX = require("xlsx")

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);





const Vessel = require("./models/Vessel");

require("./public/js/helpers")();



app.get("/", async (req, res) => {
    const vessel = await Vessel.find({});

    res.render("index", {
        vessel: vessel.sort(compare_date),
        errorValue: null
    });
})



const PackingList = require("./models/PackingList");
const assert = require("assert");

// const packingList = new PackingList({
//     grossWeightKg: "sldkjfslk"
// });

// const err = packingList.validateSync();
// console.log(err.errors["grossWeightKg"].name);

// const packingList = new PackingList({
//     deliveryDate: "2/1/21"
// });

// console.log("Delivery date:", packingList.deliveryDate)
// console.log(packingList.deliveryDate instanceof Date);
// console.log(packingList.validateSync().errors);


// packingList.save(function (err) {
//     if (err) {
//         console.log(err)
//     }
// })



app.post("/", async (req, res) => {
    const packingListArray = JSON.parse(req.body.table);
    const vessel_id = req.body.vessel;
    const selectedVessel = await Vessel.findById(vessel_id);
    const vessel = await Vessel.find({});
    const vesselName = selectedVessel.name;

    console.log(vessel_id, vesselName)


    // validate whether input data has the correct data type
    // for (var i = 0; i < packingListArray.length; i++) {
    //     let packingList = new PackingList ({
    //         vessel_id,
    //         vesselName,
    //         coilContainerNo: packingListArray[i][0],
    //         origin: packingListArray[i][1],
    //         destination: packingListArray[i][2],
    //         transportationType: packingListArray[i][3],
    //         item: packingListArray[i][4],
    //         specification: packingListArray[i][5],
    //         thickness: packingListArray[i][6],
    //         width: packingListArray[i][7],
    //         netWeightKg: packingListArray[i][8],
    //         grossWeightKg: packingListArray[i][9],
    //         deliveryDate: packingListArray[i][10],
    //         importerConsignee: packingListArray[i][11],
    //         customer: packingListArray[i][12],
    //         remark: packingListArray[i][13],
    //         inputDate: "1/16/2021",
    //         inputPerson: "Namhyun Cho",
    //         confirmDate: "1/16/2021",
    //         confirmPerson: "Daphne Glover"
    //     });

    //     let err = packingList.validateSync();

    //     if (err) {
    //         assert.strictEqual(err.errors["thickness"].name, "CastError")
    //         assert.strictEqual(err.errors["width"].name, "CastError")
    //         assert.strictEqual(err.errors["netWeightKg"].name, "CastError")
    //         assert.strictEqual(err.errors["grossWeightKg"].name, "CastError")
    //         res.redirect("/");
    //         return
    //     }



        // if ( isNaN( packingListArray[i][6] )) { // thickness => Number
        //     console.log("thickness value error")
        //     res.redirect("/");
        //     return
        // }

        // if ( isNaN( packingListArray[i][7] )) { // width => Number
        //     console.log("width value error")
        //     res.redirect("/");
        //     return
        // }

        // if ( isNaN( packingListArray[i][8] )) { // net weight => Number
        //     console.log("net weight value error")
        //     res.redirect("/");
        //     return
        // }

        // if ( isNaN( packingListArray[i][9] )) { // gross weight => Number
        //     console.log("gross weight value error")
        //     res.redirect("/");
        //     return
        // }
    // }


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
    res.redirect("/");
})


app.get("/manage-vessel-watchlist", async (req, res) => {
    const vessel = await Vessel.find({});
    res.render("manage-vessel-watchlist", {
        vessel
    });
});

app.post("/add-vessel", async (req, res) => {
    const vessel = req.body.vessel;
    const d = req.body.ETA;
    const ETA = new Date(d.replace(/-/g, '\/').replace(/T.+/, ''));
    console.log(ETA)

    await Vessel.create({
        name: vessel,
        ETA
    });

    res.redirect("/manage-vessel-watchlist");
});

app.get("/update-vessel/:_id", async (req, res) => {
    const vessel = await Vessel.findOne({_id: req.params._id});
    const schedule = [];

    const ETA = new Date(vessel.ETA).yyyymmdd();
    schedule.push(ETA);

    if (vessel.actualArrivalDate) {
        const actualArrivalDate = new Date(vessel.actualArrivalDate).yyyymmdd();
        schedule.push(actualArrivalDate);
    };

    if (vessel.LFD) {
        const LFD = new Date(vessel.LFD).yyyymmdd();
        schedule.push(LFD);
    };

    res.render("update-vessel", {
        vessel,
        schedule
    });
});

app.post("/update-vessel/:_id", async (req, res) => {
    const vessel_id = req.params._id;
    const vessel = req.body.vessel;
    const ETA = new Date(req.body.ETA.replace(/-/g, '\/').replace(/T.+/, ''));
    
    console.log(req.body);

    let actualArrivalDate = ""

    if (req.body.actualArrivalDate) {
        actualArrivalDate = new Date(req.body.actualArrivalDate.replace(/-/g, '\/').replace(/T.+/, ''));
    }
    console.log(actualArrivalDate)

    let LFD = ""
    if (req.body.LFD) {
        LFD = new Date(req.body.LFD.replace(/-/g, '\/').replace(/T.+/, ''));
    }
    console.log(LFD)

    await Vessel.findByIdAndUpdate(vessel_id, {
        name: vessel,
        ETA,
        actualArrivalDate,
        LFD
    })

    res.redirect("/manage-vessel-watchlist")
})

app.get("/delete-vessel/:_id", async (req, res) => {
    await Vessel.findByIdAndDelete(req.params._id);
    console.log("Successfully deleted");
    res.redirect("/manage-vessel-watchlist")
})


app.listen(3000, () => {
    console.log("App listening on port 3000")
});
