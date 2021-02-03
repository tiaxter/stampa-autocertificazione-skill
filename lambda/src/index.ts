import { SkillBuilders } from 'ask-sdk-core';
require('dotenv').config();

import LaunchRequestHandler from "./handlers/LaunchRequestHandler";
import HelpIntentHandler from "./handlers/HelpIntentHandler";
import CancelAndStopIntentHandler from "./handlers/CancelAndStopIntentHandler";
import ErrorHandler from './handlers/ErrorHandler';
import SessionEndedRequestHandler from "./handlers/SessionEndedRequestHandler";
import PrintIntentHandler from "./handlers/PrintIntentHandler";

const skillBuilder = SkillBuilders.custom().addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    PrintIntentHandler
).addErrorHandlers(
    ErrorHandler
);

import express, {Request, Response} from 'express';
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const skill = skillBuilder.create();

app.post('/', async (req: Request, res: Response) => {
    try {
        res.send(await skill.invoke(req.body));
    } catch (e) {
        res.status(500).send('Error during the request');
    }
});

app.listen(process.env.PORT || 3000);
