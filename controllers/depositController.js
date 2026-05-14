const axios = require("axios");
const Deposit = require("../models/Deposit");



// =============================
// CREATE DEPOSIT
// =============================

exports.createDeposit = async (req, res) => {

    try {

        const {
            userId,
            amount,
            currency
        } = req.body;

        // VALIDATION

        if (!userId || !amount) {

            return res.status(400).json({
                success: false,
                message: "userId and amount required"
            });
        }

        // CALL FINTOLITE API

        const response = await axios.get(
            "https://apiv2.fintolite.com/payment/create",
            {
                params: {
                    address: process.env.MERCHANT_ADDRESS,
                    callback_url: process.env.CALLBACK_URL,

                    amount: amount,

                    blockchain: "bsc",

                    currency: currency || "SRIMO",

                    notify_pending: true,

                    notify_confirmations: 3,

                    priority: "high",

                    post: 1
                }
            }
        );

        const data = response.data;

        console.log("FINTOLITE RESPONSE:");
        console.log(data);

        // CHECK API STATUS

        if (data.status !== "success") {

            return res.status(400).json({
                success: false,
                message: "Failed to create deposit",
                data
            });
        }

        // SAVE DATABASE

        const deposit = await Deposit.create({

            userId: userId,

            paymentId: data.address_in,

            address_in: data.address_in,

            amount: amount,

            status: "pending"

        });

        // QR CODE URL

        const qr =
            `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${data.address_in}`;

        // RESPONSE

        return res.json({

            success: true,

            message: "Deposit created",

            depositId: deposit._id,

            wallet: data.address_in,

            amount: amount,

            currency: currency || "SRIMO",

            qr: qr,

            data: data
        });

    } catch (error) {

        console.log("CREATE DEPOSIT ERROR:");

        console.log(
            error.response?.data || error.message
        );

        return res.status(500).json({

            success: false,

            message: "Deposit creation failed"
        });
    }
};



// =============================
// CALLBACK HANDLER
// =============================

exports.callbackHandler = async (req, res) => {

    try {

        console.log("=================================");
        console.log("CALLBACK RECEIVED");
        console.log("=================================");

        // SUPPORT BOTH GET + POST

        const data =
            req.body.data || req.query.data;

        // IF CALLBACK OPENED DIRECTLY IN BROWSER

        if (!data || typeof data !== "string") {

            console.log(
                "Callback endpoint opened without data"
            );

            return res.status(200).json({

                success: true,

                message: "Callback endpoint working 🚀"
            });
        }

        // DECODE BASE64

        const decodedString = Buffer
            .from(data, "base64")
            .toString("utf-8");

        let callbackData;

        try {

            callbackData =
                JSON.parse(decodedString);

        } catch (parseError) {

            console.log("=================================");
            console.log("JSON PARSE ERROR:");
            console.log(parseError.message);

            return res.status(400).json({

                status: "error",

                error: "Invalid JSON format"
            });
        }

        // FULL DECODED CALLBACK

        console.log("=================================");
        console.log("FULL DECODED CALLBACK:");
        console.log(
            JSON.stringify(
                callbackData,
                null,
                2
            )
        );
        console.log("=================================");

        /*
            EXPECTED CALLBACK

            {
                paymentId,
                status,
                address_in,
                address_out,
                transaction_hash,
                fee,
                sent_amount,
                value,
                timestamp,
                fee_txid
            }
        */

        // FIND DEPOSIT

        const deposit =
            await Deposit.findOne({

                address_in:
                    callbackData.address_in

            });

        // NOT FOUND

        if (!deposit) {

            console.log("Deposit not found");

            return res.status(404).json({

                status: "error",

                error: "Deposit not found"
            });
        }

        // DUPLICATE PROTECTION

        if (deposit.status === "completed") {

            console.log("Already processed");

            return res.status(200).json({

                status: "success",

                message: "Already processed"
            });
        }

        // UPDATE DATABASE

        deposit.status =
            callbackData.status || "pending";

        deposit.transaction_hash =
            callbackData.transaction_hash || "";

        // OPTIONAL EXTRA DATA

        deposit.callbackData = callbackData;

        await deposit.save();

        console.log("Deposit updated successfully");

        // PAYMENT SUCCESS

        if (
            callbackData.status === "completed"
        ) {

            console.log(
                "CREDIT USER ACCOUNT"
            );

            /*
                USER BALANCE UPDATE HERE
            */
        }

        // SUCCESS RESPONSE

        return res.status(200).json({

            success: true,

            message:
                "Callback processed successfully",

            callbackData
        });

    } catch (error) {

        console.log("=================================");
        console.log("CALLBACK ERROR:");
        console.log(error);

        return res.status(500).json({

            status: "error",

            error: error.message
        });
    }
};