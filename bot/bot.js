
const sendApi = require('./send-api.js');


var userData = [];


exports.processTextMessage = function (messageText, senderID) {

    if (messageText.contains('omsa')) {
        sendApi.sendQuickReply(senderID);
    } else {
        sendApi.sendTextMessage(senderID, "Nerozumiem, čo tým myslíte. " );
    }    
};
