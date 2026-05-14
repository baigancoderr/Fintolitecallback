const axios = require("axios");

const data = {

    // MongoDB me jo REAL address_in hai wahi lagao
    address_in: "0xB07259168daa2b969cF09BdA686b2c0Ac35750Ae",

    status: "completed",

    transaction_hash: "0xTXHASH123"
};

// BASE64 ENCODE

const encoded = Buffer
    .from(JSON.stringify(data))
    .toString("base64");

console.log("ENCODED:");
console.log(encoded);


// SEND CALLBACK

axios.post(
    "http://localhost:5000/api/deposit/callback",
    {
        data: encoded
    }
)
.then((res) => {

    console.log("SUCCESS:");
    console.log(res.data);

})
.catch((err) => {

    console.log("FULL ERROR:");

    console.log(err);

    console.log("ERROR RESPONSE:");

    console.log(
        err.response?.data
    );

    console.log("ERROR MESSAGE:");

    console.log(
        err.message
    );
});