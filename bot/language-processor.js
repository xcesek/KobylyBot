
module.exports = {
    // ======================== Question words checking ======================================================
    containsMessQuestionWord: function (tokens) {
        var timeQuestionWords = ["omsa", "omša", "omse", "omše", "bohosluzby", "bohoslužby"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsPlaceQuestionWord: function (tokens) {
        var placeQuestionWords = ["kde", "v"];
        return containsQuestionWord(tokens, placeQuestionWords);
    },

    containsTimeQuestionWord: function (tokens) {
        var timeQuestionWords = ["kedy", "o", "ako"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsJanovceQuestionWord: function (tokens) {
        var timeQuestionWords = ["janovce", "jánovce", "janovciach", "jánovciach"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsKlusovQuestionWord: function (tokens) {
        var timeQuestionWords = ["klusov", "kľušov", "klusove", "kľušove"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsKobylyQuestionWord: function (tokens) {
        var timeQuestionWords = ["kobyly", "kobylach", "kobylách"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsTomorrowQuestionWord: function (tokens) {
        var timeQuestionWords = ["zajtra"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsMondayQuestionWord: function (tokens) {
        var timeQuestionWords = ["pondelok"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsTuesdayQuestionWord: function (tokens) {
        var timeQuestionWords = ["utorok"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsWednesdayQuestionWord: function (tokens) {
        var timeQuestionWords = ["streda", "stredu"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsThursdayQuestionWord: function (tokens) {
        var timeQuestionWords = ["štvrtok", "stvrtok"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsFridayQuestionWord: function (tokens) {
        var timeQuestionWords = ["piatok"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsSaturdayQuestionWord: function (tokens) {
        var timeQuestionWords = ["sobotu", "sobota"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsSundayQuestionWord: function (tokens) {
        var timeQuestionWords = ["nedela", "nedeľa", "nedelu", "nedeľu"];
        return containsQuestionWord(tokens, timeQuestionWords);
    },

    containsGreetingWord: function (tokens) {
        var questionWords = ["zdravim", "zdravím", "dobry", "dobrý", "pochvalen", "pochválen", "pochvaleny", "pochválený", "ahoj", "cau", "čau"];
        return containsQuestionWord(tokens, questionWords);
    },

    containsThanksWord: function (tokens) {
        var questionWords = ["dakujem", "ďakujem", "dakujeme", "ďakujeme", "vďaka", "vdaka", "dik"];
        return containsQuestionWord(tokens, questionWords);
    },

    // ===============================================================================================
    getTimeWordFromTokens: function (tokens) {
        var timeWord;
        if (module.exports.containsTomorrowQuestionWord(tokens)) {
            timeWord = "TOMORROW";
        } else if (module.exports.containsMondayQuestionWord(tokens)) {
            timeWord = "MONDAY";
        } else if (module.exports.containsTuesdayQuestionWord(tokens)) {
            timeWord = "TUSDAY";
        } else if (module.exports.containsWednesdayQuestionWord(tokens)) {
            timeWord = "WEDNESDAY";
        } else if (module.exports.containsThursdayQuestionWord(tokens)) {
            timeWord = "THURSDAY";
        } else if (module.exports.containsFridayQuestionWord(tokens)) {
            timeWord = "FRIDAY";
        } else if (module.exports.containsSaturdayQuestionWord(tokens)) {
            timeWord = "SATURDAY";
        } else if (module.exports.containsSundayQuestionWord(tokens)) {
            timeWord = "SUNDAY";
        } else {
            timeWord = "TODAY";
        }
        return timeWord;
    },

    transalteTimeConst: function (timeToken) {
        var timeWord;
        if (timeToken == "TOMORROW") {
            timeWord = "zajtra";
        } else if (timeToken == "MONDAY") {
            timeWord = "pondelok";
        } else if (timeToken == "TUESDAY") {
            timeWord = "utorok";
        } else if (timeToken == "WEDNESDAY") {
            timeWord = "stredu";
        } else if (timeToken == "THURSDAY") {
            timeWord = "štvrtok";
        } else if (timeToken == "FRIDAY") {
            timeWord = "piatok";
        } else if (timeToken == "SATRUDAY") {
            timeWord = "sobotu";
        } else if (timeToken == "SUNDAY") {
            timeWord = "nedeľu";
        } else {
            timeWord = "dnes";
        }
        return timeWord;
    },

    transalteVillageConst: function (placeConst) {
        var placeWord;
        if (placeConst == "KOBYLY") {
            placeWord = "Kobyly";
        } else if (placeConst == "KLUSOV") {
            placeWord = "Kľušov";
        } else if (placeConst == "JANOVCE") {
            placeWord = "Janovce";
        } else {
            placeWord = "";
        }
        return placeWord;
    }
}

// ===============================================================================================
function containsQuestionWord(tokens, words) {
    var isPresent = false;
    words.forEach(function (word) {
        if (tokens.includes(word)) {
            isPresent = true;
        }
    });
    return isPresent;
}

