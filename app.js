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



// app.post("/", (req, res, next) => {
//     console.log(req.body);
    
//     const form = new formidable.IncomingForm();
//     // console.log(form)
//     form.parse(req, function(err, fields, files) {
//         const f = files[Object.keys(files)[0]];
//         const workbook = XLSX.readFile(f.path);

//         /* DO SOMETHING WITH workbook HERE */
//         const first_sheet = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[first_sheet];

//         const worksheetRange = XLSX.utils.decode_range(worksheet['!ref']);

//         for (var R = worksheetRange.s.r; R <= worksheetRange.e.r; ++R) {
//             for (var C = worksheetRange.s.c; C <= worksheetRange.e.c; ++C) {
//                 let cell_address = {c:C, r:R};
//                 /* if an A1-style address is needed, encode the address */
//                 let cell_ref = XLSX.utils.encode_cell(cell_address);
//                 let cell_row = cell_address.r;

//                 const header = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1"];
//                 if (header.includes(cell_ref)) {
//                     continue;
//                 }

//                 if (cell_row === cell_address.r) {

//                 }

//                 console.log(cell_row)
//                 console.log(cell_ref)
//                 let desired_cell = worksheet[cell_ref]
//                 let desired_value = (desired_cell ? desired_cell.w : undefined);
//                 console.log(desired_value)
//                 console.log()

//             }
//         }
//     })
    
//     res.redirect("/");
// })


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

    res.redirect("/");
});

app.get("/update-vessel/:_id", async (req, res) => {
    const vessel = await Vessel.findOne({_id: req.params._id});
    const year = vessel.ETA.getFullYear();
    let m = vessel.ETA.getMonth();
    const d = vessel.ETA.getDate();

    console.log("m", m)

    let month = ""
    if (m < 10) {
        m += 1
        month = "0" + m;
    } else {
        month = m + 1;
    }
    console.log(month);

    let date = ""
    if (d < 10) {
        date = "0" + d;
    } else {
        date = d;
    }
    console.log(d);

    const ETA = year + "-" + month + "-" + date;
    console.log(ETA);
    res.render("update-vessel", {
        vessel,
        ETA
    });
});

app.post("/update-vessel/:_id", async (req, res) => {
    const vessel_id = req.params._id;
    const vessel = req.body.vessel;
    const d = req.body.ETA;
    const ETA = new Date(d.replace(/-/g, '\/').replace(/T.+/, ''));

    console.log(vessel_id);

    await Vessel.findByIdAndUpdate(vessel_id, {
        name: vessel,
        ETA
    })

    res.redirect("/manage-vessel-watchlist")
})


app.listen(3000, () => {
    console.log("App listening on port 3000")
});
