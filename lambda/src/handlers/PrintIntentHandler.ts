import {HandlerInput, RequestHandler} from "ask-sdk-core";
import PrintService from "../services/PrintService";
import {Response} from "ask-sdk-model";
require('dotenv').config();

const PrintIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'PrintIntent';
    },
    async handle(handlerInput): Promise<Response> {
        try{
            const message = await PrintService();
            console.log(message);

            return handlerInput.responseBuilder
                .speak(message)
                .withSimpleCard('Autocertificazione printer', message)
                .withShouldEndSession(true)
                .getResponse();
        } catch (e) {
            return handlerInput.responseBuilder
                .speak("Si è verificato un errore, riprovare più tardi")
                .withShouldEndSession(true)
                .getResponse();
        }

    }
}

export default PrintIntentHandler;
