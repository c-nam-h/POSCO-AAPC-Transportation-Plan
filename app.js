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


app.post("/", async (req, res) => {
    const vessel = await Vessel.find({});

    const packingListArray = JSON.parse(req.body.table);
    if (packingListArray.length === 0) {
        const errorMsg = "An Excel Upload file is missing."

        res.render("index", {
            vessel: vessel.sort(compare_date),
            errorValue: errorMsg
        });
        
        return
    }
    
    const vessel_id = req.body.vessel;
    const selectedVessel = await Vessel.findById(vessel_id);
    const vesselName = selectedVessel.name;

    console.log(vessel_id, vesselName)


    // validate whether input data has the correct data type
    for (var i = 0; i < packingListArray.length; i++) {
        let packingList = new PackingList ({
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
        });


        console.log("Delivery date:", packingList.deliveryDate) // date validator => Date
        const deliveryDateValidator = packingList.deliveryDate instanceof Date;
        if (!deliveryDateValidator) {
            const errorMsg = "Delivery Date is not a date."
            res.render("index", {
                vessel: vessel.sort(compare_date),
                errorValue: errorMsg
            });

            return
        }
        

        if ( isNaN( packingListArray[i][6] )) { // thickness validator => Number
            const errorMsg = "Thickness is not a number."
            res.render("index", {
                vessel: vessel.sort(compare_date),
                errorValue: errorMsg
            });

            return
        }

        if ( isNaN( packingListArray[i][7] )) { // width validator => Number
            const errorMsg = "Width is not a number."
            res.render("index", {
                vessel: vessel.sort(compare_date),
                errorValue: errorMsg
            });

            return
        }

        if ( isNaN( packingListArray[i][8] )) { // net weight validator => Number
            const errorMsg = "Net Weight is not a number."
            res.render("index", {
                vessel: vessel.sort(compare_date),
                errorValue: errorMsg
            });

            return
        }

        if ( isNaN( packingListArray[i][9] )) { // gross weight validator => Number
            const errorMsg = "Gross Weight is not a number."
            res.render("index", {
                vessel: vessel.sort(compare_date),
                errorValue: errorMsg
            });

            return
        }

        packingList.save(function (err) {
            if (err) {
                console.log(err)
            }
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
