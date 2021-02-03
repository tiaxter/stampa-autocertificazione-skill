import {HandlerInput, RequestHandler} from "ask-sdk-core";
import {Response} from "ask-sdk-model";

const CancelAndStopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'Arrivederci!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Autocertificazione Print!', speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

export default CancelAndStopIntentHandler;
