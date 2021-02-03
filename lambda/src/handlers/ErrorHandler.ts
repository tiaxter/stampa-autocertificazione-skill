import {HandlerInput, RequestHandler} from "ask-sdk-core";
import {Response} from "ask-sdk-model";

const ErrorHandler: RequestHandler = {
    canHandle(): boolean {
        return true
    },
    handle(input: HandlerInput): Response {

        const speechText = 'Si è verificato un problema, riprovare più tardi!';

        return input.responseBuilder
            .speak(speechText)
            .withSimpleCard('Oh no!', speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
}

export default ErrorHandler;
