const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();


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
        BTC: 0
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
            if (currencyData[currency].TotalVolume >= volume) {

                currencyData[currency].SoldVolume += volume;
                currencyData[currency].TotalVolume -= volume;
                db.collection("CryptData").doc("Currencies").set(currencyData);


                db.collection("CryptData").doc("PersonPort").get().then((doc) => {
                    const persons = doc.data();
                    console.log(volume + " <= " + currencyData[currency].TotalVolume + " && " + persons[buyer].Money + " >= " + volume + " * " + buyingRate)
                    if (volume <= currencyData[currency].TotalVolume && persons[buyer].Money >= volume * buyingRate) {
                        persons[buyer].Money -= (volume * buyingRate);
                        persons[buyer].portfolio[currencyData[currency]["Symbol"]] += volume;
                        var temp = persons[buyer].Transactions;
                        var date = Date();
                        temp[date] = { type: "Buy", Currency: currencyData[currency]["Symbol"], Volume: volume, BuyingRate: buyingRate };
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
            else {
                response.send("Invalid Amount!");
            }
        }
    })
})

exports.sellCoin = functions.https.onRequest((request, response) => {
    const seller = request.body.name;
    const currency = request.body.currName;
    const SellingRate = request.body.rate;
    const volume = request.body.value;
    var currencyData;

    db.collection("CryptData").doc("Currencies").get().then((doc) => {
        if (doc.exists) {
            var temp = doc.data();
            // console.log(temp)
            currencyData = temp;
            // console.log(currencyData);
            if (currencyData[currency].SoldVolume >= volume) {
                currencyData[currency].SoldVolume -= volume;
                currencyData[currency].TotalVolume += volume;
                db.collection("CryptData").doc("Currencies").set(currencyData);

                db.collection("CryptData").doc("PersonPort").get().then((doc1) => {
                    const persons = doc1.data();
                    console.log(volume + " <= " + currencyData[currency].SoldVolume);

                    if (volume <= currencyData[currency].SoldVolume) {
                        persons[seller].Money += (volume * SellingRate);
                        console.log(currencyData);
                        persons[seller].portfolio[currencyData[currency]["Symbol"]] += volume;

                        var temp = persons[seller].Transactions;
                        var date = Date();
                        temp[date] = { type: "Sell", Currency: currencyData[currency]["Symbol"], Volume: volume, SellingRate: SellingRate };
                        persons[seller].Transactions = temp;

                        var profit = {};

                        for (let transaction in persons[seller].Transactions) {
                            if (profit[transaction.Currency] == undefined) profit[transaction.Currency] = 0;
                            if (transaction.type == "Buy") {
                                profit[transaction.Currency] -= transaction.Volume * transaction.BuyingRate;
                            }
                            else {
                                profit[transaction.Currency] += transaction.Volume * transaction.SellingRate;
                            }
                        }

                        persons[seller].Transactions.profit = profit;

                        db.collection("CryptData").doc("PersonPort").set(persons).then((doc) => {
                            console.log("Transaction Completed");
                            response.status(200).send("Transaction Complete");
                        }).catch((reason) => {
                            console.log("Failed due to " + reason);
                            response.send("Transaction Failed!");
                        })

                    }
                    else {
                        response.send("You do not have enough Volume inside");
                    }
                })
            }
            else {
                response.send("You do not have enough Volume");
            }
        }
    })

})