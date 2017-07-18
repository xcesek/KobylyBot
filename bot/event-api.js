const
    crypto = require('crypto'),
    config = require('config'),
    request = require('request');

const sendApi = require('./send-api.js');
const bot = require('./bot.js');


const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
    process.env.MESSENGER_APP_SECRET :
    config.get('appSecret');


module.exports = {

    /*
     * Message Event
     */
    receivedMessage: function (event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var isEcho = message.is_echo;
        var messageId = message.mid;
        var appId = message.app_id;
        var metadata = message.metadata;

        // You may get a text or attachment but not both
        var messageText = message.text;
        var messageAttachments = message.attachments;
        var quickReply = message.quick_reply;


        if (isEcho) {
            // Just logging message echoes to console
            console.log("Received echo for message %s and app %d with metadata %s", 
            messageId, appId, metadata);
            return;
        } else if (quickReply) {
            var quickReplyPayload = quickReply.payload;
            console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
            bot.respondToQuickReply(messageText, senderID, quickReplyPayload);

        } else if (messageText) {
            bot.processTextMessage(messageText, senderID);

        } else if (messageAttachments) {
            sendApi.sendTextMessage(senderID, "Ó, ďakujem za like, obrazok, alebo inú prílohu. Ale pravdupovediac, nerozumiem jej. :)");
        }
    },


    /*
     * Verify that the callback came from Facebook.
     */
    verifyRequestSignature: function (req, res, buf) {
        var signature = req.headers["x-hub-signature"];
        if (!signature) {
            console.error("Couldn't validate the signature:", signature);
        } else {
            var elements = signature.split('=');
            var method = elements[0];
            var signatureHash = elements[1];

            var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                .update(buf)
                .digest('hex');

            console.error("expectedHash is :", expectedHash);
            if (signatureHash != expectedHash) {
                throw new Error("Couldn't validate the request signature.");
            }
        }
    },

    /*
     * Authorization Event
     */
    receivedAuthentication: function (event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfAuth = event.timestamp;

        // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
        // The developer can set this to an arbitrary value to associate the 
        // authentication callback with the 'Send to Messenger' click event. This is
        // a way to do account linking when the user clicks the 'Send to Messenger' 
        // plugin.
        var passThroughParam = event.optin.ref;

        console.log("Received authentication for user %d and page %d with pass " +
            "through param '%s' at %d", senderID, recipientID, passThroughParam,
            timeOfAuth);

        // When an authentication is received, we'll send a message back to the sender
        // to let them know it was successful.
        sendApi.sendTextMessage(senderID, "Authentication successful");
    },

    /*
    * Delivery Confirmation Event
    */
    receivedDeliveryConfirmation: function (event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var delivery = event.delivery;
        var messageIDs = delivery.mids;
        var watermark = delivery.watermark;
        var sequenceNumber = delivery.seq;

        if (messageIDs) {
            messageIDs.forEach(function (messageID) {
                console.log("Received delivery confirmation for message ID: %s",
                    messageID);
            });
        }

        console.log("All message before %d were delivered.", watermark);
    },


    /*
     * Postback Event
     */
    receivedPostback: function (event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfPostback = event.timestamp;

        // The 'payload' param is a developer-defined field which is set in a postback 
        // button for Structured Messages. 
        var payload = event.postback.payload;

        console.log("Received postback for user %d and page %d with payload '%s' " +
            "at %d", senderID, recipientID, payload, timeOfPostback);

        // When a postback is called, we'll send a message back to the sender to 
        // let them know it was successful
        sendApi.sendTextMessage(senderID, "Postback called");
    },

    /*
     * Message Read Event
     */
    receivedMessageRead: function (event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;

        // All messages before watermark (a timestamp) or sequence have been seen.
        var watermark = event.read.watermark;
        var sequenceNumber = event.read.seq;

        console.log("Received message read event for watermark %d and sequence " +
            "number %d", watermark, sequenceNumber);
    },

    /*
     * Account Link Event
     */
    receivedAccountLink: function (event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;

        var status = event.account_linking.status;
        var authCode = event.account_linking.authorization_code;

        console.log("Received account link event with for user %d with status %s " +
            "and auth code %s ", senderID, status, authCode);
    }
}