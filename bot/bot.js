
const sendApi = require('./send-api.js');


var userData = [];


exports.processTextMessage = function (messageText, senderID) {

    sendApi.sendTextMessage(senderID, "Ok, got it. You just came wrote " + messaeText);
};
