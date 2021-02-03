import {HandlerInput, RequestHandler } from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import PrintService from "../services/PrintService";
require('dotenv').config();

const LaunchRequestHandler: RequestHandler = {
    canHandle(input: HandlerInput): boolean {
        return input.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(input: HandlerInput): Promise<Response> {
        let speechText = "";
        try {
            speechText = await PrintService();
        }catch (e) {
            console.error(e);
        }

        return input.responseBuilder
            .speak(speechText)
            .withSimpleCard('Stato stampa', speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
}

export default LaunchRequestHandler;
