//------------------------- Include Section  ------------------------
//-------------------------------------------------------------------

var __https = require('https');
var express = require("express");
var __fs = require('fs');
var __jsonBodyParser = require("body-parser");
var kubernetes_explorer = express();
var k8sAPIRequest = require('./kubernetesAPIRequest.js');
var terraformRequest = require('./Terraform-Request.js');

// Standard Request Types in Alexa
const STDREQUEST_LAUNCH = "LaunchRequest";
const STDREQUEST_CANFULFILL = "CanFulfillIntentRequest";
const STDREQUEST_INTENT = "IntentRequest";
const STDREQUEST_SESSIONENDED = "SessionEndedRequest";

// Non-Standard Request Types in Alexa
const REQUEST_AUDIOPLAYER = "AudioPlayer";
const REQUEST_PLAYBACKCONTROLLER = "PlaybackController";
const REQUEST_DISPLAYELEMENTSEL = "Display.ElementSelected";
const REQUEST_GADGETCONTROLLER = "GadgetController";
const REQUEST_GAMEENGINE = "GameEngine";

// SSML Shortcuts
const SSML_BREAKTIME_1S = "<break time=\"1s\"/>";
const SSML_BREAKTIME_500MS = "<break time=\"500ms\"/>";
const SSML_BREAKTIME_250MS = "<break time=\"250ms\"/>";
const SSML_CHIME = "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_bell_med_chime_02.mp3'/>";
const SSML_BEEP =  "<audio src='https://s3.amazonaws.com/ask-soundlibrary/musical/amzn_sfx_beep_1x_01.mp3'/>";

const SSML_PROSODY_RATE_FAST = "<prosody pitch=\"medium\" rate=\"fast\">";
const SSML_PROSODY_RATE_MEDIUM = "<prosody pitch=\"medium\" rate=\"medium\">";
const SSML_PROSODY_CLOSE = "</prosody>";
const SSML_JIHUZOOR = "<say-as interpret-as=\"interjection\">ji huzoor</say-as>";

// ResponseBody Types Definition
const TYPE_OUTPUTSPEECH = {
                            "PLAINTEXT": "PlainText",
                            "SSML": "SSML"
                         };

const TYPE_CARD = {
                        "SIMPLE": "Simple",
                        "STD": "Standard",
                        "LINKACC": "LinkAccount"
                  };

// Dialog Delegation
const DIALOG_DELEGATE = { type: "Dialog.Delegate"  };
const DIALOG_CONFIRM = { 
                            type: "Dialog.ConfirmSlot",
                            slotToConfirm: "",
                            updatedIntent: ""
                       };

// Intents Defined in Alexa
const INTENT_PODSNUMBEROF = "podsNumberOfIntent";
const INTENT_GETNODES = "getNodesIntent";
const INTENT_GETNAMESPACES = "getNamespacesIntent";
const INTENT_GETSTATUSUPDATE = "getStatusUpdateIntent";
const INTENT_GETDEPLOYMENTS = "getDeploymentsIntent";
const INTENT_SCALEDEPLOYMENT = "scaleDeploymentIntent";
const INTENT_CREATEK8SCLUSTER = "createKubernetesClusterIntent";

// Alexa Global Variables
var __alexaJSONRequest = null;


// Kubernetes Global Variales
var __k8sNodes = null;
var __k8sDeployments = null;
var __k8sPods = null;
var __k8sNamespaces = null;

//----------------- Construct Alexa Response Body Helper-------------
//-------------------------------------------------------------------

function constructAlexaJSONResponse(_sessionAttributes, _outputSpeech, _card, _repromptOutputSpeech, _directives, _shouldEndSession) {
    var alexaJSONResponse = {
                                version: "string",
                             };
    alexaJSONResponse.response = new Object();
    // var alexaJSONResponse = JSON.parse(alexaJSONResponseText);
    
    if(_sessionAttributes != null) {
        alexaJSONResponse.sessionAttributes = _sessionAttributes;
    }

    if (_outputSpeech != null) {
        alexaJSONResponse.response.outputSpeech = _outputSpeech;
    }

    if (_card != null) {
        alexaJSONResponse.response.card = _card;
    }
    else {
        alexaJSONResponse.response.card = {
                                    "type": "Simple",
                                    "title": "Kubernetes Explorer",
                                    "content": "Kubernetes Explorer Card Content"
                                 };
    }

    if(_repromptOutputSpeech != null) {
        alexaJSONResponse.response.reprompt.outputSpeech = _repromptOutputSpeech;
    }

    // TODO: Condition for directives specification
    if(_directives != null) {
        alexaJSONResponse.response.directives = [ _directives ];
    }
    if(_shouldEndSession == true)
        alexaJSONResponse.shouldEndSession = true;
    else
        alexaJSONResponse.shouldEndSession = false;

    // console.log(JSON.stringify(alexaJSONResponse));

    return alexaJSONResponse;
}

function createOutputSpeechObject(_type, _text, _ssml) {
    // TODO: Input Validation
    var outputSpeechObject = {
                            "type": _type
                       };

    if(_type == TYPE_OUTPUTSPEECH.PLAINTEXT) {
        outputSpeechObject.text = _text;
    }

    if(_type == TYPE_OUTPUTSPEECH.SSML) {
        outputSpeechObject.ssml = "<speak>" + _ssml + "</speak>";
    }
    return outputSpeechObject;
}

function createCardObject(_type, _title, _content, _text, _image) {
    // TODO: Input Validation
    var cardObject = {
        "type": _type
    };

    if(_type == TYPE_CARD.SIMPLE) {
        cardObject.title = _title;
        cardObject.content = _content;
    }

    if(_type == TYPE_CARD.STD) {
        cardObject.title = _title;
        cardObject.text = _text;
        cardObject.image = _image;
    }

    return cardObject;

}

function createRepromptObject(_type, _text, _ssml) {
    // Need to be completed
}

//---------------------- Intent Handler Functions -------------------
//-------------------------------------------------------------------

function createKubernetesClusterIntentHandler() {
    try {
        __alexaJSONRequest.request.intent.slots.scaleCount
    }
    catch(err) {
        return constructAlexaJSONResponse(null, null, null, null, DIALOG_DELEGATE, null);
    }
}

function scaleDeploymentIntentHandler() {
    // var delegateJSONRequest =  { response: { directives: [ { type: "Dialog.Delegate"  } ], shouldEndSession: "false" } };
    try {
        scaleCount = __alexaJSONRequest.request.intent.slots.scaleCount.value;
        deploymentNumber = __alexaJSONRequest.request.intent.slots.deploymentNumber.value
        scaleCountConfirmed = __alexaJSONRequest.request.intent.slots.scaleCount.confirmationStatus;
        deploymentNumberConfirmed = __alexaJSONRequest.request.intent.slots.deploymentNumber.confirmationStatus;
        
        // TODO: Handle Edge Case Here. For e.g. Deployment < 0 and Deployment > AvailableLength

        if((deploymentNumber!= null) && (deploymentNumberConfirmed != "CONFIRMED")) {
            var deploymentName = __k8sDeployments.items[deploymentNumber-1].metadata.name;
            var outputSpeech = "Deployment Number " + deploymentNumber + " corresponds to " + deploymentName + ". Is that the one you want to scale?";
            var outputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, outputSpeech, null);
            
            var confirm_directive = DIALOG_CONFIRM;

            confirm_directive.slotToConfirm = "deploymentNumber";
            confirm_directive.updatedIntent = __alexaJSONRequest.request.intent;

            console.log(JSON.stringify(confirm_directive));

            return constructAlexaJSONResponse(null, outputSpeechObj, null, null, confirm_directive, false);
        } else

        if((scaleCount != null) && (deploymentNumber != null) && (scaleCountConfirmed == "CONFIRMED") && (deploymentNumberConfirmed == "CONFIRMED")) {
            // LOGIC:
            var deploymentName = __k8sDeployments.items[deploymentNumber-1].metadata.name;
            var namespaceName = __k8sDeployments.items[deploymentNumber-1].metadata.namespace;
            var outputSpeech = "I will scale your deployment " + deploymentName + " to a new replica count of " + scaleCount + ". You can check the status later by asking me to list deployments";
            var path = 'apis/extensions/v1beta1/namespaces/' + namespaceName + '/deployments/' + deploymentName;
            k8sAPIRequest.query(path, function(err, data) {
                var deploymentResponse = data;
                // console.log("*********** THIS **********" + JSON.stringify(deploymentResponse));
                deploymentResponse.spec.replicas = Number(scaleCount);
                k8sAPIRequest.queryScale(path, deploymentResponse);
            });
            
            var outputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, outputSpeech, null);
            return constructAlexaJSONResponse(null, outputSpeechObj, null, null, null, null);
        }
        else {
            return constructAlexaJSONResponse(null, null, null, null, DIALOG_DELEGATE, null);
        }
    }
    catch(err) {
        return constructAlexaJSONResponse(null, null, null, null, DIALOG_DELEGATE, null);
    }
}

function getStatusUpdateIntentHandler() {
    var outputSpeechSSML;
    var outputSpeechObject;

    outputSpeechSSML = "Here's the latest rundown" + SSML_BREAKTIME_250MS
                       + SSML_PROSODY_RATE_FAST
                       + SSML_BEEP + "Yesterday, we reached a peak of 12000 transactions per second with an average of 9500 transactions per second. This is 20% more than last month." +  SSML_BREAKTIME_250MS
                       + SSML_BEEP + "At 5 PM yesterday, we received a surge of transactions from E-commerce vendor 1. Our deployments were scaled by 5% to handle the surge." + SSML_BREAKTIME_250MS + " No transaction failures were reported during this occurrence." + SSML_BREAKTIME_250MS
                       + SSML_BEEP + "Our payment transactions remained flat at 4500 transactions per second. We will scale based on the default scaling settings today at 10:45 AM." + SSML_BREAKTIME_250MS
                       + SSML_BEEP + "Based on the last probe, one of our Kubernetes Worker nodes could possibly be down, however, all services are operational. Optionally, you can check the status of individual nodes with node status command." + SSML_BREAKTIME_250MS
                       + SSML_BEEP + "That's all for now! Have a great day ahead!"
                       + SSML_PROSODY_CLOSE
                       ;

    outputSpeechObject = createOutputSpeechObject(TYPE_OUTPUTSPEECH.SSML, null, outputSpeechSSML);
    return constructAlexaJSONResponse(null, outputSpeechObject, null, null, null, false);
}

function getDeploymentsIntentHandler() {
    var outputSpeechSSML;

    if(__k8sDeployments == null) {
        getDeploymentsOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, "Server is fetching the necessary data. Please try again in sometime!", null);
    }
    else {
        var outputSpeechSSML;
        var numberOfItems = __k8sDeployments.items.length;
        outputSpeechSSML = SSML_JIHUZOOR + SSML_PROSODY_RATE_MEDIUM + SSML_BREAKTIME_1S + "! I found " + numberOfItems;
        
        if(numberOfItems == 1) {
            outputSpeechSSML += " deployment in your Kubernetes Cluster. Here's the desired and available replica count: ";
        }
        if(numberOfItems > 1) {
            outputSpeechSSML += " deployments in your Kubernetes Cluster. Here's their desired and available replica count: ";
        }

        for(i=0; i<numberOfItems; i++) {
            outputSpeechSSML +=   
                             // SSML_BEEP +
                             "Number " + (i+1) + ": "
                             + SSML_BREAKTIME_500MS + __k8sDeployments.items[i].metadata.name + ". With "
                             + __k8sDeployments.items[i].status.replicas + " desired, "
                             + " and, " + __k8sDeployments.items[i].status.availableReplicas + " available."
                             + SSML_BREAKTIME_250MS
                             ;
        }
        outputSpeechSSML += SSML_PROSODY_CLOSE + " Want to scale a deployment? Just let me know!";
        getDeploymentsOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.SSML, null, outputSpeechSSML);
    }
    return constructAlexaJSONResponse(null, getDeploymentsOutputSpeechObj, null, null, null, false);
}

function getNamespacesIntentHandler() {
    var outputSpeechSSML;

    // Check if the refresh job has completed
    if(__k8sNamespaces == null) {
        getNamespacesOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, "Server is fetching the necessary data. Please try again in sometime!", null);
    }
    else {
        
        var outputSpeech;
        var numberOfItems = __k8sNamespaces.items.length;
        outputSpeech = "Your Kubernetes cluster has " + numberOfItems;
        
        if(numberOfItems == 1) {
            outputSpeech += " namespace. And, that is ";
        }
        if(numberOfItems > 1) {
            outputSpeech += " namespaces. They are: ";
        }
        for(i=0; i<numberOfItems; i++) {
            if((i == numberOfItems-1) && (i!=0)) {
                outputSpeech += "and, " + __k8sNamespaces.items[i].metadata.name + ".";
            } else {
                outputSpeech += __k8sNamespaces.items[i].metadata.name + ", ";
            }
        }
    }
    getNamespacesOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, outputSpeech, null);
    return constructAlexaJSONResponse(null, getNamespacesOutputSpeechObj, null, null, null, false);
}

function getNodesIntentHandler() {
    var outputSpeechSSML;
    var getNodesOutputSpeechObj;
    var memoryPressureNodes = null;
    var diskPressureNodes = null;
    var outOfDiskNodes = null;
    var partialIssues = null;
    
    // Check if the refresh job has completed
    if(__k8sNodes == null) {
        getNodesOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, "Server is fetching the necessary data. Please try again in sometime!", null);
    }
    else {
        var outputSpeechSSML;
        var numberOfItems = __k8sNodes.items.length;
        outputSpeechSSML = "Your Kubernetes cluster has " + numberOfItems;
        if(numberOfItems == 1) {
            outputSpeechSSML += " node. Here is the availability status for that node: <break time=\"1s\"/>";
        }
        if(numberOfItems > 1) {
            outputSpeechSSML += " nodes. The availability status of each are as follows: <break time=\"1s\"/>";
        }

        for(i=0; i<numberOfItems; i++) {
            var readyStatus;
            if(__k8sNodes.items[i].status.conditions[3].status == "True") {
                readyStatus = "READY";
                outputSpeechSSML += __k8sNodes.items[i].metadata.name + " is " + readyStatus + ". <break time=\"1s\"/>";
            }
            else {
                readyStatus = "NOT READY";
                outputSpeechSSML += "<say-as interpret-as=\"interjection\">baap re</say-as> <break time=\"250ms\"/>" + __k8sNodes.items[i].metadata.name + " is " + readyStatus + ". <break time=\"1s\"/>";
            }

            // OutOfDisk
            if(__k8sNodes.items[i].status.conditions[0].status == "True")
                outOfDiskNodes += __k8sNodes.items[i].metadata.name + ", ";
            // Memory Pressure
            if(__k8sNodes.items[i].status.conditions[1].status == "True")
                memoryPressureNodes += __k8sNodes.items[i].metadata.name + ", ";
            // Disk Pressure
            if(__k8sNodes.items[i].status.conditions[2].status == "True")
                diskPressureNodes += __k8sNodes.items[i].metadata.name + ", ";
        }

        // No Issues
        if((outOfDiskNodes == null) && (memoryPressureNodes == null) && (diskPressureNodes == null)) {
            outputSpeechSSML += "<say-as interpret-as=\"interjection\">shabash</say-as><break time=\"250ms\"/> ";
            outputSpeechSSML += "Even though one node is down, the other available nodes are healthy enough to handle traffic!";
        } 
        else {
            if(outOfDiskNodes != null) {
            outputSpeechSSML += "I found, OutOfDisk issues in " + outOfDiskNodes + ".";
            } else {
                partialIssues += ", out of disk ";
            }

            if(memoryPressureNodes != null) {
                outputSpeechSSML += "I found memory pressure issues in " + memoryPressureNodes + ".";
            } else {
                partialIssues += ", memory pressure ";
            }

            if(diskPressureNodes != null) {
                outputSpeechSSML += "I found disk pressure issues in " + diskPressureNodes + ".";
            } else {
                partialIssues += ", disk pressure ";
            }
            // A Few Issues
            if(partialIssues != null)
                outputSpeechSSML += "I didn't find any " + partialIssues + " across the nodes.";
        }

        // outputSpeechSSML += "But Sanjeev, all of this is fine... HDFC Deal kab aayegaa?";
        console.log(outputSpeechSSML);
        getNodesOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.SSML, null, outputSpeechSSML);
    }
    return constructAlexaJSONResponse(null, getNodesOutputSpeechObj, null, null, null, false);
}

function podsNumberOfIntentHandler() {
    var outputSpeech = "Your engine-x deployment is running with 35 pods."
    var launchOutputSpeechObj = createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, outputSpeech, null);
    return constructAlexaJSONResponse(null, launchOutputSpeechObj, null, null, null, false);
}

function launchRequestIntentHandler() {
    var outputSpeechText = "Welcome to Container Engine! I can give you information about your Kubernetes Cluster, your services and cluster components. Additionally, I can even scale your deployments!";
    return createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, outputSpeechText, null);
}

//------------------ Intent Handler Helper Functions ----------------
//-------------------------------------------------------------------

function findIntentHandler() {
    var intentName = __alexaJSONRequest.request.intent.name;
    if(intentName == INTENT_PODSNUMBEROF)       return podsNumberOfIntentHandler;       else
    if(intentName == INTENT_GETNODES)           return getNodesIntentHandler;           else
    if(intentName == INTENT_GETNAMESPACES)      return getNamespacesIntentHandler;      else
    if(intentName == INTENT_GETSTATUSUPDATE)    return getStatusUpdateIntentHandler;    else
    if(intentName == INTENT_GETDEPLOYMENTS)     return getDeploymentsIntentHandler;     else
    if(intentName == INTENT_SCALEDEPLOYMENT)    return scaleDeploymentIntentHandler;    else
    if(intentName == INTENT_CREATEK8SCLUSTER)   return createKubernetesClusterIntentHandler;
}

function launchRequestProcessor() {
    return constructAlexaJSONResponse(null, launchRequestIntentHandler(), null, null, null, false);
}

function intentRequestProcessor() {
    intentHandler = findIntentHandler();
    return intentHandler();
}


//------------------------ Helper Functions -------------------------
//-------------------------------------------------------------------

function findRequestTypeProcessor(_requestType) {
    // Function receives the request type and determines the correct intent
    // and its corresponding processor function

    if(_requestType == STDREQUEST_LAUNCH) {
        return launchRequestProcessor;
    }
    else if(_requestType == STDREQUEST_INTENT) {
        return intentRequestProcessor;
    }
    else if(_requestType == STDREQUEST_SESSIONENDED) {
        // TODO: Complete the Session Ended Request
        return constructAlexaJSONResponse(null, createOutputSpeechObject(TYPE_OUTPUTSPEECH.PLAINTEXT, "Okay!",null) ,null, null, null, false);
    }
}

function processRequest(_httpRequest) {
    try {
        var requestProcessor = findRequestTypeProcessor(__alexaJSONRequest.request.type);
        if(requestProcessor == null) {
            console.log("ERROR: " + __alexaJSONRequest.request.type);
        }
        return requestProcessor();
    } catch(err) {
        console.log("Couldn't find the intent handler function for the request.");
    }
}

//--------------------- HTTP Request Handler -----------------------
//-------------------------------------------------------------------

kubernetes_explorer.use(__jsonBodyParser.json());
kubernetes_explorer.post("", function (request, response) {
    console.log("------- Request Received -------");
    console.log(JSON.stringify(request.body));
    console.log("-------- End of Request  -------");
    __alexaJSONRequest = request.body;
    alexaJSONResponse = processRequest(request.body);
    console.log("-------- Response Created  -------");
    response.json(alexaJSONResponse);
    console.log(alexaJSONResponse);
    console.log("-------- End of Response  -------");
    response.send();
});

const SSLCERT = {
    key: __fs.readFileSync("/home/opc/alexacert/private-key.pem"),
    cert: __fs.readFileSync("/home/opc/alexacert/certificate.pem")
};

var webserver = __https.createServer(SSLCERT, kubernetes_explorer);
webserver.listen(443);

function refreshJob() {
    console.log("Starting Refresh Job");

    // Fetch all the Nodes
    k8sAPIRequest.query('api/v1/nodes', function(err, data) {
        __k8sNodes = data;
    });

    // Fetch all the namespaces
    k8sAPIRequest.query('api/v1/namespaces', function(err, data) {
        __k8sNamespaces = data;
    });
    
    // Fetch all deployments
    k8sAPIRequest.query('apis/apps/v1/deployments', function(err, data) {
       __k8sDeployments = data;
    });
}

refreshJob();

const intervalObj = setInterval(refreshJob, 30000);