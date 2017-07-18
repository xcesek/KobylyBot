
var responseOkSentences = {};
responseOkSentences["MESS_TODAY_RESP"] = "Dnes je sv. omša v {VILLAGE} o {TIME}";
responseOkSentences["MESS_TOMORROW_RESP"] = "Zajtra bude sv. omša v {VILLAGE} o {TIME}";
responseOkSentences["MESS_SUNDAY_RESP"] = "V nedeľu bude sv. omša v {VILLAGE} o {TIME}";
responseOkSentences["MESS_TIME_RESP"] = "Sv. omša bude v {VILLAGE}";
//responseOkSentences["MESS_INTENTION_RESP"] = ["Úmysel sv. omše je za {}"];
exports.responseOkSentences = responseOkSentences;

var responseNotSureSentences = {};
responseNotSureSentences["NOT_SURE_RESP_0"] = "Viete čo? Nie celkom rozumiem, čo píšete. Skúste si pozrieť oznamy.";
responseNotSureSentences["NOT_SURE_RESP_1"] = "Pravdupovediac, nerozumiem Vám. Skúste si pozrieť oznamy.";
responseNotSureSentences["NOT_SURE_RESP_2"] = "Prepáčte, nerzumiem. Skúste si pozrieť oznamy.";
exports.responseNotSureSentences = responseNotSureSentences;

var responseHintSentences = {};
responseHintSentences["HINT_RESP_0"] = "Rozumiem iba jednonuchým vetám. Skúste napr. 'Kde je dnes sv. omša?', 'Za koho je sv. omša?'";
responseHintSentences["HINT_RESP_1"] = "Som iba jednoduchý bot. Skúste jednoduché vety, napr. 'Kde je dnes sv. omša?'";
exports.responseHintSentences = responseHintSentences;

var responseGreetingSentences = {};
responseGreetingSentences["GREET_RESP_0"] = "Zdavím";
responseGreetingSentences["GREET_RESP_1"] = "Dobrý deň";
responseGreetingSentences["GREET_RESP_2"] = "Pokoj a dobro!";
exports.responseGreetingSentences = responseGreetingSentences;

var responseThanksSentences = {};
responseThanksSentences["THANKS_RESP_0"] = "Prosím.";
responseThanksSentences["THANKS_RESP_1"] = "Nemáte za čo.";
responseThanksSentences["THANKS_RESP_2"] = "To je v poriadku.";
exports.responseThanksSentences = responseThanksSentences;