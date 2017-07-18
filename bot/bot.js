
var sendApi = require('./send-api.js');
var dictionary = require('./dictionary.js');
var messDao = require('./messDao.js');

exports.processTextMessage = function (messageText, senderId) {
    console.log("messaggeText: " + messageText);

    var clearedText = messageText.replace(/[.,!;:?]/g, "");
    clearedText = clearedText.toLowerCase();
    var tokens = clearedText.split(" ");

    console.log(tokens);
    if (containsMessQuestionWord(tokens)) {
        if (containsTimeQuestionWord(tokens)) {
            processTimeQuestion(tokens, senderId);
        } else if (containsPlaceQuestionWord(tokens)) {
            processPlaceQuestion(tokens, senderId);
        } else {
            notSureResponse(senderId);
        }
    } else if (containsGreetingWord(tokens)) { 
        processGreetingMessage(tokens, senderId);
    } else if (containsThanksWord(tokens)) { 
        processThanksMessage(tokens, senderId);
    } else {
        notSureResponse(senderId);
    }


    if (messageText.indexOf('aa') > -1) {
        sendApi.sendQuickReply(senderID);
    } else {

    }
};

// ===================================================================================================
function containsPlaceQuestionWord(tokens) {
    var placeQuestionWords = ["kde", "v"];
    return containsQuestionWord(tokens, placeQuestionWords);
}

function containsTimeQuestionWord(tokens) {
    var timeQuestionWords = ["kedy", "o"];
    return containsQuestionWord(tokens, timeQuestionWords);
}

function containsMessQuestionWord(tokens) {
    var timeQuestionWords = ["omsa", "omša", "bohosluzby", "bohoslužby"];
    return containsQuestionWord(tokens, timeQuestionWords);
}

function containsJanovceQuestionWord(tokens) {
    var timeQuestionWords = ["janovce", "jánovce", "janovciach", "jánovciach"];
    return containsQuestionWord(tokens, timeQuestionWords);
}

function containsKlusovQuestionWord(tokens) {
    var timeQuestionWords = ["klusov", "kľušov", "klusove", "kľušove"];
    return containsQuestionWord(tokens, timeQuestionWords);
}

function containsTomorrowQuestionWord(tokens) {
    var timeQuestionWords = ["zajtra"];
    return containsQuestionWord(tokens, timeQuestionWords);
}

function containsSundayQuestionWord(tokens) {
    var timeQuestionWords = ["nedela", "nedeľa", "nedelu", "nedeľu"];
    return containsQuestionWord(tokens, timeQuestionWords);
}

function containsGreetingWord(tokens) {
    var questionWords = ["zdravim", "zdravím", "dobry", "dobrý", "pochvalen", "pochválen", "pochvaleny", "pochválený"];
    return containsQuestionWord(tokens, questionWords);
}

function containsThanksWord(tokens) {
    var questionWords = ["dakujem", "dakujeme","vdaka"];
    return containsQuestionWord(tokens, questionWords);
}

function containsQuestionWord(tokens, words) {
    var isPresent = false;
    words.forEach(function (word) {
        if (tokens.includes(word)) {
            isPresent = true;
        }
    });
    return isPresent;
}
// ===================================================================================================
function processGreetingMessage(tokens, senderID) {
    var rnd = Math.floor((Math.random() * 3));
    var sentence = dictionary.responseGreetingSentences["GREET_RESP_" + rnd];

    console.log(sentence);
    sendApi.sendTextMessage(senderID, sentence);
}

function processThanksMessage(tokens, senderID) {
    var rnd = Math.floor((Math.random() * 3));
    var sentence = dictionary.responseGreetingSentences["GREET_RESP_" + rnd];

    console.log(sentence);
    sendApi.sendTextMessage(senderID, sentence);
}

function processThanksMessage(tokens, senderID) {
    var rnd = Math.floor((Math.random() * 3));
    var sentence = dictionary.responseThanksSentences["THANKS_RESP_" + rnd];

    console.log(sentence);
    sendApi.sendTextMessage(senderID, sentence);
}

function processTimeQuestion(tokens, senderID) {
    var village;
    if (containsKlusovQuestionWord(tokens)) {
        village = "Kľušove";
    } else if (containsSundayQuestionWord(tokens)) {
        village = "Janovciach";
    } else {
        village = "Kobylách";
    }

    var timeWord;
    if (containsTomorrowQuestionWord(tokens)) {
        timeWord = "TOMORROW";
    } else if (containsSundayQuestionWord(tokens)) {
        timeWord = "SUNDAY";
    } else {
        timeWord = "TODAY";
    }
    var time = messDao.findMess(village, timeWord);

    var sentence = dictionary.responseOkSentences["MESS_" + timeWord + "_RESP"];
    sentence = sentence.replace("{VILLAGE}", village);
    sentence = sentence.replace("{TIME}", time);

    console.log(sentence);
    sendApi.sendTextMessage(senderID, sentence);

}

function processPlaceQuestion(tokens, senderID) {
    
    var timeWord;
    if (containsTomorrowQuestionWord(tokens)) {
        timeWord = "TOMORROW";
    } else if (containsSundayQuestionWord(tokens)) {
        timeWord = "SUNDAY";
    } else {
        timeWord = "TODAY";
    }
    var village = messDao.findVillageForTime(timeWord);

    var sentence = dictionary.responseOkSentences["MESS_TIME_RESP"];
    sentence = sentence.replace("{VILLAGE}", village);

    console.log(sentence);
    sendApi.sendTextMessage(senderID, sentence);
}

// ===================================================================================================
function notSureResponse(senderID) {
    var rnd = Math.floor((Math.random() * 3));
    console.log(dictionary.responseNotSureSentences["NOT_SURE_RESP_" + rnd]);
    sendApi.sendTextMessage(senderID, dictionary.responseNotSureSentences["NOT_SURE_RESP_" + rnd]);
}


// ===================================================================================================