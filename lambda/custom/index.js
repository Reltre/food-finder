// SkillCode generated code.
// Paste this into an AWS Lambda function based on the Fact blueprint.

const invocationName = "food finder";

const languageStrings = {
   'en': {
        'translation': {
            'WELCOME1' : 'Welcome to food finder!',
            'WELCOME2' : 'Greetings!',
            'WELCOME3' : 'Hello there!',
            'DETAILS'  : 'You can ask me to find a restaurant nearby. Try saying "find a restaurant near me" or "search for a chinese restaurant 2 miles from Santa Monica".',
            'HELP'    : 'You can say help, stop, or cancel.',
            'STOP'    : 'Goodbye!'
        }
    }
    // , 'de-DE': { 'translation' : { 'WELCOME'   : 'German Welcome etc.' } }
    // , 'jp-JP': { 'translation' : { 'WELCOME'   : 'Japanese Welcome etc.' } }
};
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const Alexa = require("alexa-sdk");
const https = require("https");

exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID; //

    alexa.resources = languageStrings;
 // alexa.dynamoDBTableName = "myTable"; // persistent session attributes
    alexa.registerHandlers(handlers);
    alexa.execute();
}

const handlers = {
    'AMAZON.CancelIntent': function () {

        let say = 'Goodbye.';
        this.response
          .speak(say);

        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {

        var CustomIntents = getCustomIntents();
        var MyIntent = randomPhrase(CustomIntents);
        let say = 'Out of ' + CustomIntents.length + ' intents, here is one called, ' + MyIntent.name + ', just say, ' + MyIntent.samples[0];
        this.response
          .speak(say)
          .listen('try again, ' + say)
          .cardRenderer('Intent List', cardIntents(CustomIntents)); // , welcomeCardImg

        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {

        let say = 'Goodbye.';
        this.response
          .speak(say);

        this.emit(':responseReady');
    },
    'RecommendationIntent': function () {
        // delegate to Alexa to collect all the required slots
        let filledSlots = delegateSlotCollection.call(this);

        if (!filledSlots) {
            return;
        }

        console.log("filled slots: " + JSON.stringify(filledSlots));
        // at this point, we know that all required slots are filled.
        let slotValues = getSlotValues(filledSlots);

        console.log(JSON.stringify(slotValues));

        let key = `${slotValues.distance.resolved}-${slotValues.location.resolved}`;
        let option = options[slotsToOptionsMap[key.replace(/\s|\t/, '-')]];

        console.log("look up key: ", key,  "object: ", option);

        let speechOutput = `I found RESTAURANT_NAME  ${slotValues.distance.value} away from ${slotValues.location.value}.`;
        console.log("Speech output: ", speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');

        this.emit(':responseReady');
    },
    'LaunchRequest': function () {
        let say = this.t('WELCOME1') + ' ' + this.t('DETAILS') +  ' ' + this.t('HELP');
        this.response
          .speak(say)
          .listen('try again, ' + say);

        this.emit(':responseReady');
    },
    'Unhandled': function () {
        let say = 'The skill did not quite understand what you wanted.  Do you want to try something else? ';
        this.response
          .speak(say)
          .listen(say);
}};
//  ------ Helper Functions -----------------------------------------------

function randomPhrase(myArray) {
    return(myArray[Math.floor(Math.random() * myArray.length)]);
}

// returns slot resolved to an expected value if possible
function resolveCanonical(slot){
    try {
        var canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch(err){
        console.log(err.message);
        var canonical = slot.value;
    };
    return canonical;
};

// used to emit :delegate to elicit or confirm Intent Slots
function delegateSlotCollection(){
    console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        var updatedIntent = this.event.request.intent;

        this.emit(":delegate");

    } else if (this.event.request.dialogState !== "COMPLETED") {

        this.emit(":delegate");

    } else {
        console.log("returning: "+ JSON.stringify(this.event.request.intent));

        return this.event.request.intent;
    }
}

function getCustomIntents() {
    var customIntents = [];
    for (let i = 0; i < intentsReference.length; i++) {
        if(intentsReference[i].name.substring(0,7) != "AMAZON." && intentsReference[i].name !== "LaunchRequest" ) {
            customIntents.push(intentsReference[i]);
        }
    }
    return(customIntents);
}
function cardIntents(iArray) {
    var body = "";    for (var i = 0; i < iArray.length; i++) {
        body += iArray[i].name + "\n";
        body += "  '" + iArray[i].samples[0] + "'\n";
    }
    return(body);
}

const welcomeCardImg = {
    smallImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/alexa-devs-skill/cards/skill-builder-720x480._TTH_.png",
    largeImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/alexa-devs-skill/cards/skill-builder-1200x800._TTH_.png"
};

const REQUIRED_SLOTS = [
    "distance",
    "location"
];


const slotsToOptionsMap = {
    "zero-point two-Los Angeles": 0,
    "zero-point two-Hollywood": 1,
    "zero-point two-Santa Monica": 2,
    "zero-point two-Mar Vista": 3,
    "zero-point two-Inglewood": 4,
    "zero-point two-LAX": 5,
    "zero-point two-Northridge": 6,
    "zero-point two-Beverly Hills": 7,
    "zero-point two-Chinatown": 8,
    "zero-point two-Silver Lake": 9,
    "zero-point two-Brentwood": 10,
    "zero-point two-El Segundo": 11,
    "zero-point two-Malibu": 12,
    "zero-point five-Los Angeles": 13,
    "zero-point five-Hollywood": 14,
    "zero-point five-Santa Monica": 15,
    "zero-point five-Mar Vista": 16,
    "zero-point five-Inglewood": 17,
    "zero-point five-LAX": 18,
    "zero-point five-Northridge": 19,
    "zero-point five-Beverly Hills": 20,
    "zero-point five-Chinatown": 21,
    "zero-point five-Silver Lake": 22,
    "zero-point five-Brentwood": 23,
    "zero-point five-El Segundo": 24,
    "zero-point five-Malibu": 25,
    "one-Los-Angeles": 26,
    "one-Hollywood": 27,
    "one-Santa-Monica": 28,
    "one-Mar-Vista": 29,
    "one-Inglewood": 30,
    "one-LAX": 31,
    "one-Northridge": 32,
    "one-Beverly-Hills": 33,
    "one-Chinatown": 34,
    "one-Silver-Lake": 35,
    "one-Brentwood": 36,
    "one-El-Segundo": 37,
    "one-Malibu": 38,
    "two-Los-Angeles": 39,
    "two-Hollywood": 40,
    "two-Santa-Monica": 41,
    "two-Mar-Vista": 42,
    "two-Inglewood": 43,
    "two-LAX": 44,
    "two-Northridge": 45,
    "two-Beverly-Hills": 46,
    "two-Chinatown": 47,
    "two-Silver-Lake": 48,
    "two-Brentwood": 49,
    "two-El-Segundo": 50,
    "two-Malibu": 51,
    "three-Los-Angeles": 52,
    "three-Hollywood": 53,
    "three-Santa-Monica": 54,
    "three-Mar-Vista": 55,
    "three-Inglewood": 56,
    "three-LAX": 57,
    "three-Northridge": 58,
    "three-Beverly-Hills": 59,
    "three-Chinatown": 60,
    "three-Silver-Lake": 61,
    "three-Brentwood": 62,
    "three-El-Segundo": 63,
    "three-Malibu": 64
};

const options = [
    {"name": "name_0", "description": "description_0"},
    {"name": "name_1", "description": "description_1"},
    {"name": "name_2", "description": "description_2"},
    {"name": "name_3", "description": "description_3"},
    {"name": "name_4", "description": "description_4"},
    {"name": "name_5", "description": "description_5"},
    {"name": "name_6", "description": "description_6"},
    {"name": "name_7", "description": "description_7"},
    {"name": "name_8", "description": "description_8"},
    {"name": "name_9", "description": "description_9"},
    {"name": "name_10", "description": "description_10"},
    {"name": "name_11", "description": "description_11"},
    {"name": "name_12", "description": "description_12"},
    {"name": "name_13", "description": "description_13"},
    {"name": "name_14", "description": "description_14"},
    {"name": "name_15", "description": "description_15"},
    {"name": "name_16", "description": "description_16"},
    {"name": "name_17", "description": "description_17"},
    {"name": "name_18", "description": "description_18"},
    {"name": "name_19", "description": "description_19"},
    {"name": "name_20", "description": "description_20"},
    {"name": "name_21", "description": "description_21"},
    {"name": "name_22", "description": "description_22"},
    {"name": "name_23", "description": "description_23"},
    {"name": "name_24", "description": "description_24"},
    {"name": "name_25", "description": "description_25"},
    {"name": "name_26", "description": "description_26"},
    {"name": "name_27", "description": "description_27"},
    {"name": "name_28", "description": "description_28"},
    {"name": "name_29", "description": "description_29"},
    {"name": "name_30", "description": "description_30"},
    {"name": "name_31", "description": "description_31"},
    {"name": "name_32", "description": "description_32"},
    {"name": "name_33", "description": "description_33"},
    {"name": "name_34", "description": "description_34"},
    {"name": "name_35", "description": "description_35"},
    {"name": "name_36", "description": "description_36"},
    {"name": "name_37", "description": "description_37"},
    {"name": "name_38", "description": "description_38"},
    {"name": "name_39", "description": "description_39"},
    {"name": "name_40", "description": "description_40"},
    {"name": "name_41", "description": "description_41"},
    {"name": "name_42", "description": "description_42"},
    {"name": "name_43", "description": "description_43"},
    {"name": "name_44", "description": "description_44"},
    {"name": "name_45", "description": "description_45"},
    {"name": "name_46", "description": "description_46"},
    {"name": "name_47", "description": "description_47"},
    {"name": "name_48", "description": "description_48"},
    {"name": "name_49", "description": "description_49"},
    {"name": "name_50", "description": "description_50"},
    {"name": "name_51", "description": "description_51"},
    {"name": "name_52", "description": "description_52"},
    {"name": "name_53", "description": "description_53"},
    {"name": "name_54", "description": "description_54"},
    {"name": "name_55", "description": "description_55"},
    {"name": "name_56", "description": "description_56"},
    {"name": "name_57", "description": "description_57"},
    {"name": "name_58", "description": "description_58"},
    {"name": "name_59", "description": "description_59"},
    {"name": "name_60", "description": "description_60"},
    {"name": "name_61", "description": "description_61"},
    {"name": "name_62", "description": "description_62"},
    {"name": "name_63", "description": "description_63"},
    {"name": "name_64", "description": "description_64"}
];


// ***********************************
// ** Helper functions from
// ** These should not need to be edited
// ** www.github.com/alexa/alexa-cookbook
// ***********************************

// ***********************************
// ** Route to Intent
// ***********************************

// after doing the logic in new session,
// route to the proper intent

function routeToIntent() {

    switch (this.event.request.type) {
        case 'IntentRequest':
            this.emit(this.event.request.intent.name);
            break;
        case 'LaunchRequest':
            this.emit('LaunchRequest');
            break;
        default:
            this.emit('LaunchRequest');
    }
}

// ***********************************
// ** Dialog Management
// ***********************************

function getSlotValues (filledSlots) {
    //given event.request.intent.slots, a slots values object so you have
    //what synonym the person said - .synonym
    //what that resolved to - .resolved
    //and if it's a word that is in your slot values - .isValidated
    let slotValues = {};

    console.log('The filled slots: ' + JSON.stringify(filledSlots));
    Object.keys(filledSlots).forEach(function(item) {
        //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
        var name = filledSlots[item].name;
        //console.log("name: "+name);
        if(filledSlots[item]&&
            filledSlots[item].resolutions &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case "ER_SUCCESS_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        "isValidated": true
                    };
                    break;
                case "ER_SUCCESS_NO_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].value,
                        "isValidated":false
                    };
                    break;
            }
        } else {
            slotValues[name] = {
                "synonym": filledSlots[item].value,
                "resolved": filledSlots[item].value,
                "isValidated": false
            };
        }
    },this);
    //console.log("slot values: "+JSON.stringify(slotValues));
    return slotValues;
}
// This function delegates multi-turn dialogs to Alexa.
// For more information about dialog directives see the link below.
// https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html
function delegateSlotCollection() {
    console.log("in delegateSlotCollection");
    console.log("current dialogState: " + this.event.request.dialogState);

    if (this.event.request.dialogState === "STARTED") {
        console.log("in STARTED");
        console.log(JSON.stringify(this.event));
        var updatedIntent=this.event.request.intent;
        // optionally pre-fill slots: update the intent object with slot values
        // for which you have defaults, then return Dialog.Delegate with this
        // updated intent in the updatedIntent property

        disambiguateSlot.call(this);
        console.log("disambiguated: " + JSON.stringify(this.event));
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        //console.log(JSON.stringify(this.event));

        disambiguateSlot.call(this);
        this.emit(":delegate", updatedIntent);
    } else {
        console.log("in completed");
        //console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent.slots;
    }
    return null;
}
// If the user said a synonym that maps to more than one value, we need to ask
// the user for clarification. Disambiguate slot will loop through all slots and
// elicit confirmation for the first slot it sees that resolves to more than
// one value.
function disambiguateSlot() {
    let currentIntent = this.event.request.intent;

    Object.keys(this.event.request.intent.slots).forEach(function(slotName) {
        let currentSlot = this.event.request.intent.slots[slotName];
        let slotValue = slotHasValue(this.event.request, currentSlot.name);
        if (currentSlot.confirmationStatus !== 'CONFIRMED' &&
            currentSlot.resolutions &&
            currentSlot.resolutions.resolutionsPerAuthority[0]) {

            if (currentSlot.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_MATCH') {
                // if there's more than one value that means we have a synonym that
                // mapped to more than one value. So we need to ask the user for
                // clarification. For example if the user said "mini dog", and
                // "mini" is a synonym for both "small" and "tiny" then ask "Did you
                // want a small or tiny dog?" to get the user to tell you
                // specifically what type mini dog (small mini or tiny mini).
                if ( currentSlot.resolutions.resolutionsPerAuthority[0].values.length > 1) {
                    let prompt = 'Which would you like';
                    let size = currentSlot.resolutions.resolutionsPerAuthority[0].values.length;
                    currentSlot.resolutions.resolutionsPerAuthority[0].values.forEach(function(element, index, arr) {
                        prompt += ` ${(index == size -1) ? ' or' : ' '} ${element.value.name}`;
                    });

                    prompt += '?';
                    let reprompt = prompt;
                    // In this case we need to disambiguate the value that they
                    // provided to us because it resolved to more than one thing so
                    // we build up our prompts and then emit elicitSlot.
                    this.emit(':elicitSlot', currentSlot.name, prompt, reprompt);
                }
            } else if (currentSlot.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH') {
                // Here is where you'll want to add instrumentation to your code
                // so you can capture synonyms that you haven't defined.
                console.log("NO MATCH FOR: ", currentSlot.name, " value: ", currentSlot.value);

                if (REQUIRED_SLOTS.indexOf(currentSlot.name) > -1) {
                    let prompt = "What " + currentSlot.name + " are you looking for";
                    this.emit(':elicitSlot', currentSlot.name, prompt, prompt);
                }
            }
        }
    }, this);
}

// Given the request an slot name, slotHasValue returns the slot value if one
// was given for `slotName`. Otherwise returns false.
function slotHasValue(request, slotName) {

    let slot = request.intent.slots[slotName];

    //uncomment if you want to see the request
    //console.log("request = "+JSON.stringify(request));
    let slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}
