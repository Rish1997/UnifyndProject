const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initializind admin and firestore variable

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.addCurrency = functions.https.onRequest((request, response) => {

    const currency = request.body.currName;
    const value = request.body.value;
    const symbol = request.body.symbol;
    const sold = 0;

    var curr = {};
    db.collection("CryptData").doc("Currencies").get().then((doc) => {
        curr = doc.data();
        console.log("Curr before");
        console.log(curr);
        curr[currency] = {
            CurrencyName: currency,
            TotalVolume: value,
            SoldVolume: sold,
            Symbol: symbol
        }
        console.log("Curr After");
        console.log(curr);

        db.collection("CryptData").doc("Currencies").set(curr).then((success) => {
            return response.status(200).send("Successfully stored Data " + success);
        }).catch((reason) => {
            return response.send("Rejected because " + reason);
        })


    })
})

exports.addPerson = functions.https.onRequest((request, response) => {
    const name = request.body.name;
    const money = request.body.money;
    const currencies = {
        "BTC": 0
    };
    const port = {};
    port[name] = {
        Name: name,
        Money: money,
        portfolio: {
            BTC: 0
        },
        Transactions: {
            profit: {
                BTC: 0
            }
        }
    }
    db.collection("CryptData").doc("PersonPort").set(port).then((success) => {
        return response.status(200).send("Successfully stored Data " + success);
    }).catch((reason) => {
        return response.send("Rejected Because " + reason);
    })
})

exports.buyCoin = functions.https.onRequest((request, response) => {

    const buyer = request.body.name;
    const currency = request.body.currName;
    const buyingRate = request.body.rate;
    const volume = request.body.value;
    var currencyData;

    db.collection("CryptData").doc("Currencies").get().then((doc) => {
        if (doc.exists) {
            var temp = doc.data();
            currencyData = temp['currencyData'];
            console.log(currencyData);
            console.log(currency);
            currencyData[currency].SoldVolume += volume;
            currencyData[currency].TotalVolume -= volume;
            db.collection("CryptData").doc("Currencies").set({
                currencyData
            });


            db.collection("CryptData").doc("PersonPort").get().then((doc) => {
                const persons = doc.data();
                console.log(volume + " <= " +  currencyData[currency].TotalVolume + " && " +  persons[buyer].Money + " >= " +  volume + " * " + buyingRate)
                if (volume <= currencyData[currency].TotalVolume && persons[buyer].Money >= volume * buyingRate) {
                    persons[buyer].Money -= (volume * buyingRate);
                    persons[buyer].portfolio[currencyData[currency]["Symbol"]] += volume;
                    var temp = persons[buyer].Transactions;
                    var date = Date();
                    temp[date] = { type: "Buy", Currency: "BTC", Volume: volume, BuyingRate: buyingRate };
                    persons[buyer].Transactions = temp;

                    db.collection("CryptData").doc("PersonPort").set(persons).then((doc) => {
                        console.log("Transaction Completed");
                        response.status(200).send("Transaction Complete");
                    }).catch((reason) => {
                        console.log("Failed due to " + reason);
                        response.send("Transaction Failed!");
                    })
                }
                else {
                    response.send("Not Enough Money or Volume!!");
                }
            })
        }
    })
})

// exports.sellCoin = functions.https