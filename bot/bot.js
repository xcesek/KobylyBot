
var sendApi = require('./send-api.js');
var dictionary = require('./dictionary.js');
var langProc = require('./language-processor.js')
var dbDaf = require('./dbDaf.js')


/* Main processing logic
*  Routes qyery based on tokes mined from incomming sentence
*/
exports.processTextMessage = function (messageText, senderId) {
    console.log("messaggeText: " + messageText);

    var clearedText = messageText.replace(/[.,!;:?]/g, "");
    clearedText = clearedText.toLowerCase();
    var tokens = clearedText.split(" ");

    console.log(tokens);
    if (langProc.containsMessQuestionWord(tokens)) {
        if (langProc.containsTimeQuestionWord(tokens)) {
            processTimeQuestion(tokens, senderId);
        } else if (langProc.containsPlaceQuestionWord(tokens)) {
            processPlaceQuestion(tokens, senderId);
        } else {
            notSureResponse(senderId);
        }

    } else if (langProc.containsGreetingWord(tokens)) {
        processGreetingMessage(tokens, senderId);

    } else if (langProc.containsThanksWord(tokens)) {
        processThanksMessage(tokens, senderId);

    } else {
        notSureResponse(senderId);
    }
};

// ===================================================================================================
function processGreetingMessage(tokens, senderID) {
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
    // determine time word
    var timeWord = langProc.getTimeWordFromTokens(tokens);

    // dtermine village if any
    var villageWords = [];
    if (langProc.containsKobylyQuestionWord(tokens)) {
        villageWords.push("KOBYLY")
    }
    if (langProc.containsKlusovQuestionWord(tokens)) {
        villageWords.push("KLUSOV")
    }
    if (langProc.containsJanovceQuestionWord(tokens)) {
        villageWords.push("JANOVCE")
    }

    // prepare sql query
    var queryStr;
    if (timeWord == 'TODAY' || timeWord == 'TOMORROW') {
        var offset1;
        switch (timeWord) {
            case 'TODAY':
                offset1 = 0;
                break;
            case 'TOMORROW':
                offset1 = 1;
                break;
            default:
                offset1 = 0;
        }
        var offset2 = offset1 + 1;
        queryStr = "SELECT * FROM MESS WHERE time between curdate() + INTERVAL " + offset1 + " day  and curdate() + INTERVAL " + offset2 + " day";
    } else {
        queryStr = "SELECT * FROM MESS WHERE (time between curdate() and curdate() + INTERVAL 7 day) AND day = '" + timeWord + "'";
    }
    console.log(queryStr);

    // call DB
    var con = dbDaf.createDbConnection();
    con.query(queryStr, function (err, result, fields) {
        if (err) throw err;

        if (result.length == 0) { // no mess on that day
            var sentence;
            sentence = dictionary.responseOkSentences["MESS_NO_" + timeWord + "_RESP"];
            sentence = sentence.replace("{VILLAGE}", "našej farnosti");
        }

        else if (result.length == 1) { // one mess on given day - simple sentece
            var sentence;
            var time = result[0].time
            var place = result[0].place
            var intention = result[0].intention

            var dateObj = new Date(time);
            var timeStr = dateObj.getHours() + ":" + dateObj.getMinutes();
            sentence = dictionary.responseOkSentences["MESS_" + timeWord + "_RESP"];
            sentence = sentence.replace("{VILLAGE}", langProc.transalteVillageConst(place));
            sentence = sentence.replace("{TIME}", timeStr);
        }

        else if (result.length > 1) { // mess in more than one village
            var sentence = "Sv. omše v " + langProc.transalteTimeConst(timeWord) + ": ";
            
            result.forEach(function (item, index, array) {
                var time = item.time
                var place = item.place
                var intention = item.intention

                var dateObj = new Date(time);
                var timeStr = dateObj.getHours() + ":" + dateObj.getMinutes();
                sentence += langProc.transalteVillageConst(place) + " - " + timeStr + ";\n ";
            });
        }

        console.log(sentence);
        sendApi.sendTextMessage(senderID, sentence);
        con.end();
    });
}

function processPlaceQuestion(tokens, senderID) {
    var timeWord = langProc.getTimeWordFromTokens(tokens);

    var queryStr;
    if (timeWord == 'TODAY' || timeWord == 'TOMORROW') {
        var offset1;
        switch (timeWord) {
            case 'TODAY':
                offset1 = 0;
                break;
            case 'TOMORROW':
                offset1 = 1;
                break;
            default:
                offset1 = 0;
        }
        var offset2 = offset1 + 1;
        queryStr = "SELECT place FROM MESS WHERE time between curdate() + INTERVAL " + offset1 + " day  and curdate() + INTERVAL " + offset2 + " day";
    } else {
        queryStr = "SELECT place FROM MESS WHERE (time between curdate() and curdate() + INTERVAL 7 day) AND day = '" + timeWord + "'";
    }
    console.log(queryStr);

    var con = dbDaf.createDbConnection();
    con.query(queryStr, function (err, result, fields) {
        if (err) throw err;
        
        var sentence;
        if (result.length == 0) {
            sentence = "No mne sa zdá, že omša nie je."
        }

        else if (result.length == 1) {
            var village = result[0].place
            console.log(village);

            var villageMorph;
            switch (village) {
                case 'KLUSOV':
                    villageMorph = "Kľušove";
                    break;
                case 'KOBYLY':
                    villageMorph = "Kobylách";
                    break;
                case 'JANOVCE':
                    villageMorph = "Janovciach";
                    break;
            }

            if (villageMorph != undefined) {
                sentence = dictionary.responseOkSentences["MESS_TIME_RESP"];
                sentence = sentence.replace("{VILLAGE}", villageMorph);
            } else {
                sentence = 'Neviem :(';
            }
        }

        else if (result.length > 1) {
            sentence = "Sv. omše budú v "
            result.forEach(function (item, index, array) {
                var village = item.place
                console.log(village);
    
                var villageMorph;
                switch (village) {
                    case 'KLUSOV':
                        villageMorph = "Kľušove ";
                        break;
                    case 'KOBYLY':
                        villageMorph = "Kobylách ";
                        break;
                    case 'JANOVCE':
                        villageMorph = "Janovciach ";
                        break;
                }

                sentence += villageMorph;
            });
        }

        console.log(sentence);
        sendApi.sendTextMessage(senderID, sentence);
        con.end();
    });
}

// ===================Other resp types ===================================================
function notSureResponse(senderID) {
    var rnd = Math.floor((Math.random() * 3));
    console.log(dictionary.responseNotSureSentences["NOT_SURE_RESP_" + rnd]);
    sendApi.sendTextMessage(senderID, dictionary.responseNotSureSentences["NOT_SURE_RESP_" + rnd]);
}
