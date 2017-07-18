const
  https = require('https'),
  config = require('config'),
  request = require('request');


const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');


/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  })
}

/*
   * Turn typing indicator on
   *
   */
function sendTypingOn(recipientId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
  console.log("Turning typing indicator off");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
}

/*
   * Send a read receipt to indicate the message has been read
   *
   */
function sendReadReceipt(recipientId) {
  console.log("Sending a read receipt to mark message as seen");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  callSendAPI(messageData);
}

function sendWithTyping(recipientId, messageData) {

  sendReadReceipt(recipientId);
  setTimeout(function () {
    sendTypingOn(recipientId);
    setTimeout(function () {
      sendTypingOff(recipientId);
      setTimeout(function () {
        callSendAPI(messageData);
      }, 10);
    }, 10);
  }, 10);

}


module.exports = {

  /*
   * Send a text message using the Send API.
   *
   */
  sendTextMessage: function (recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "NORMAL_RESPONSE"
      }
    };

    sendWithTyping(recipientId, messageData);
  },

  /*
   * Send a message with Quick Reply buttons.
   *
   */
  sendQuickReply: function (recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: "Najbližšie sv. omše:",
        quick_replies: [
          {
            "content_type": "text",
            "title": "Dnes",
            "payload": "QUICK_MASS_TODAY"
          },
          {
            "content_type": "text",
            "title": "Zajtra",
            "payload": "QUICK_MASS_TOMOROW"
          }
        ]
      }
    };

    sendWithTyping(recipientId, messageData);
  },


  /*
   * Send a message with the account linking call-to-action
   *
   */
  sendAccountLinking: function (recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Welcome. Link your account.",
            buttons: [{
              type: "account_link",
              url: SERVER_URL + "/authorize"
            }]
          }
        }
      }
    };

    callSendAPI(messageData);
  }
};