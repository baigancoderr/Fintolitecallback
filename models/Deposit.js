const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    paymentId: {
        type: String,
        required: true
    },

    address_in: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "pending"
    },

    transaction_hash: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Deposit", depositSchema);