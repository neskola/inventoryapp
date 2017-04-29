var functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuidV4 = require('uuid/v4');
const uuidV1 = require('uuid/v1');

var itemHashCache = {};

var config = {
    "apiKey": "AIzaSyCKF7f8gco-fY4zZA1OVgXQLKKDXPijJJ8",
    "authDomain": "mokki-inventaario.firebaseapp.com",
    "databaseURL": "https://mokki-inventaario.firebaseio.com",
    "projectId": "mokki-inventaario",
    "storageBucket": "mokki-inventaario.appspot.com",
    "messagingSenderId": "679532544309",
    "authdata": {
        "type": "service_account",
        "project_id": "mokki-inventaario",
        "private_key_id": "103cae6153ba2a74f53ba70c897435887ff2a4b5",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCv1vptN7W3pndb\nTDOG6Jxat2hoim/KE2UKIe3t3Z1GJp9VcYIN7ZCyaQxXTo9be5ZTkcwwKScTV74n\nViHzLKBqPiWvdDjOT14f75Uct6H7BmocweT56Zl/FLat0+B+4p/IqACqKA1A0i1+\nWSACnmiOOiZCIbNe6Jd77gwXyOz/Xdcx0Bxj9xB+qE6bqgK9xOrXiOAL1NghvWQ2\nJvKFQ74kHW5UOB53P8lVBsj7lqiLjgczgPzd95rAEBf6VWNrFEIM04ipTNRRS6jI\n1hxlN2bt/CMENJ+X/bYdqFtoDCM74lyQ6yle7CoOARnsj3yjbuUWOLYviDDmwpid\nI4oSai4RAgMBAAECggEARIfelg5uTiMcxYJPWrbxqRFuKcA6jWE9sdNDbb8/eoW2\n95ADhfYevMngO26sxJTII83g7Kw9RHaf76jMFoBADOgnu9fqA84++udfEBApmzIG\nzSpsWVJHtpWWFO1Mw2cDqyp/B9IQSEEh5epKZXrjePsEyiVkSQsRbwV5xRNT+roq\nsRpI0rnZ4KbY1FYUwjbK2FArPCf1vLeQcr5yDcDgiUixH6h/34pQhFOzKV/LpnNz\nc3c0ktq1MsEsfeq0IsACuiVo3c8hO7TllR1QvbIM/lnqmyAbuLFL1GAfh9LWTLwq\neHEgR4ksicLMEmVcIAN2mbcrZXzWfw6g1Urv0QVcAQKBgQD31UbUuhvFbn0bzdEi\nfUbkQLdCz2KNN7fwoSXahL0+Xhmd7pPo8TOjEeMKGPMPBVh1vpxH+1GGTpJsdEKL\neq4RS/8dFw4UVMcTNF1E2+HLIG6Z9pTc065aUnzGO/YT4guCZBseGVasm7FJLZ6p\nreO5XgUZJiGiqAefdyQK0bvf4QKBgQC1ol1cdeRjReIZGBDzu60FiSM+YMG70rxL\nSaUEZUjL4mMLtTm7ht4Qga3dGmAyXjpHo+SvpyQf+Y4x6tR2Ltv2ZkNhqBg7dTCk\nJyKl6fclz8TPn2g/Ht1va9/zyX/HO1h0LYnRVXxFq7p/sLbT08+zLLU3R5RCZOz3\ntLlEUc7UMQKBgQCcBiZYiG4xZnTXC0UNjIcT7fYx1nP56ckgcaNuJcEqQX2pIuj1\nbtyOXhVsZvamTzw4rG6hFoRlpJOkObEnNG3fr9OFUd1oSVMnMQFC95b4FYvr3AQt\n3gpXDLVG67rpG5cZWMKFuXgKpN4A7vqDYlkKezmEcrAcQeLCrvP+57l6oQKBgGDb\niHW52GSn633+O2v99LIzAzxMVINYSVjMmNbTPBKdUrv3lCXQMbMTtCdn3Ux+uw1g\n9J5Gvxjd91nfJBUxv9KRjfURsnpib+HZjLx1G3pqZUVieDDQwLyeBfr2xND1cKHj\nds7Oi0qL3RQipBwpo2Skvq4P2ZvePg+JrBImnejBAoGATFKxfFk38llOK8nSO2dh\n++tIW8XeFMGjAVkWGApXUbcth4+m9o4qJ5gpZcGwJO9gXWrScKIlX4isrDkkFaAd\n1Ky+QRYeIGwQr1oEvGKjcZdiUCeKpRIdKi7+tG1X9jHaJmtU5376g3ossqHaQfw3\n4T+Rohf1ZQH162DDZcWFewc=\n-----END PRIVATE KEY-----\n",
        "client_email": "mokki-inventaario@appspot.gserviceaccount.com",
        "client_id": "109979762912841576066",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mokki-inventaario%40appspot.gserviceaccount.com"
    }
};
console.log("Config ", config);
admin.initializeApp({
    credential: admin.credential.cert(config.authdata),
    databaseURL: config.databaseURL
});

console.log("Admin app initialized", admin);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

function resetItemIds(ref, items, type) {
    for (key in items) {
        var item = items[key];
        console.info(type + " item found", item);
        if (item.uuid === undefined) {
            item.uuid = uuidV4();

            console.log("set uuid %s for item %s", item.uuid, JSON.stringify(item));

            ref.child(type + "/" + key).set(item, function (error) {
                if (error) {
                    console.error("Failed to insert item data to inventory/" + type + "/" + key, error);
                }
            });
        }
    }
}

function setCors(res) {
    res.set("Access-Control-Allow-Origin", '*');
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
}

function getInventoryItems() {
    var inventoryref = admin.database().ref("/inventory/");
    inventoryref.once("value", function (snapshot) {
        var foundItem = undefined;
        if (snapshot.val() !== undefined) {
            let foodItems = snapshot.val().food;
            var output = Object.keys(foodItems).map(function (key) {
                return { uuid: foodItems[key].uuid, item: foodItems[key] };
            });
            console.log("map as array", output);
        }
        return foundItem;
    }, function (error) {
        console.error("Error while reading inventory", error);
        return undefined;
    });
}

exports.resetItemIds = functions.https.onRequest((req, res) => {
    setCors(res);
    //    var receivedData = JSON.parse(req.body);
    //    console.log("Received data", receivedData);
    var inventoryref = admin.database().ref("/inventory/");
    inventoryref.once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            resetItemIds(inventoryref, snapshot.val().food, "food");
            resetItemIds(inventoryref, snapshot.val().supplies, "supplies");
            return snapshot.val();
        } else {
            return undefined;
        }
    }, function (error) {
        console.error("Error while reading inventory", error);
        res.status(500).send("Error while handling inventory data", error);
    });
    res.status(200).send("Response ok.");

});

exports.resetAppliancesIds = functions.https.onRequest((req, res) => {
    setCors(res);

    //    var receivedData = JSON.parse(req.body);
    //    console.log("Received data", receivedData);
    var appliancesref = admin.database().ref("/appliances/");
    appliancesref.once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            resetItemIds(appliancesref, snapshot.val().unit, "unit");
            return snapshot.val();
        } else {
            return undefined;
        }
    }, function (error) {
        console.error("Error while reading appliances", error);
        res.status(500).send("Error while handling appliances data", error);
    });
    res.status(200).send("Response ok.");

});

exports.resetCleaningIds = functions.https.onRequest((req, res) => {
    setCors(res);

    //    var receivedData = JSON.parse(req.body);
    //    console.log("Received data", receivedData);
    var cleaningref = admin.database().ref("/cleaning/");
    cleaningref.once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            resetItemIds(cleaningref, snapshot.val().place, "place");
            return snapshot.val();
        } else {
            return undefined;
        }
    }, function (error) {
        console.error("Error while reading cleaning data", error);
        res.status(500).send("Error while handling cleaning data", error);
    });
    res.status(200).send("Response ok.");

});

exports.store = functions.https.onRequest((req, res) => {
    setCors(res);

    var receivedData = JSON.parse(req.body);

    console.log("received data", receivedData, req.query.user);
    receivedData.user = req.query.user;
    let newUUID = uuidV1();
    receivedData.timestamp = Date.now();
    var invetoryItems = getInventoryItems();
    for (index in receivedData.items) {
        
    }
    var saveref = admin.database().ref("/status/").child(newUUID).set(receivedData, function (error) {
        if (error) {
            console.error("Failed to store received data to /store/" + newUUID, error);
            res.status(500).send(error);
        }
        res.status(200).send(receivedData);
    });
});
