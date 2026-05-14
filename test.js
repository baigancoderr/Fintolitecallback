const axios = require("axios");


// =========================================
// TEST CALLBACK DATA
// =========================================

const callbackData = {

    paymentId: "test-payment-123",

    status: "completed",

    // REAL ADDRESS FROM MONGODB

    address_in:
        "0xf651d82b0B016c131D53EAeCbd999708e1AaCAC6",

    address_out:
        "0xB4011122995F737DAf67E358c870210CEdf4bC4f",

    transaction_hash:
        "0xTXHASH123456789",

    fee: 0.1,

    sent_amount: 11,

    value: 11,

    timestamp: Date.now(),

    fee_txid:
        "0xFEEHASH123"
};


// =========================================
// ENCODE BASE64
// =========================================

const encoded = Buffer
    .from(JSON.stringify(callbackData))
    .toString("base64");


// =========================================
// SHOW TEST DATA
// =========================================

console.log("=================================");
console.log("ORIGINAL CALLBACK JSON:");
console.log(
    JSON.stringify(
        callbackData,
        null,
        2
    )
);

console.log("=================================");
console.log("BASE64 ENCODED:");
console.log(encoded);

console.log("=================================");
console.log("SENDING CALLBACK TO RENDER...");
console.log("=================================");


// =========================================
// SEND CALLBACK REQUEST TO RENDER
// =========================================

axios.post(

    "https://fintolitecallback-1.onrender.com/api/deposit/callback",

    {
        data: encoded
    }

)

.then((res) => {

    console.log("=================================");
    console.log("SUCCESS RESPONSE:");
    console.log(
        JSON.stringify(
            res.data,
            null,
            2
        )
    );
    console.log("=================================");

})

.catch((err) => {

    console.log("=================================");
    console.log("CALLBACK TEST ERROR");
    console.log("=================================");

    // FULL ERROR

    console.log("FULL ERROR:");
    console.log(err);

    console.log("=================================");

    // RESPONSE ERROR

    console.log("ERROR RESPONSE:");
    console.log(
        err.response?.data
    );

    console.log("=================================");

    // MESSAGE

    console.log("ERROR MESSAGE:");
    console.log(
        err.message
    );

    console.log("=================================");
});