import {Printer} from "ipp";
import { fromBuffer as convertPdfToPng } from 'pdf2pic'

require('dotenv').config();

import {URL} from 'url';
import {Options} from "pdf2pic/dist/types/options";
import {ToBase64Response} from "pdf2pic/dist/types/toBase64Response";

const fetch = require('node-fetch');
const ipp = require('ipp');
const evilScan = require('evilscan');

function findPrinters(): Promise<any[]> {
    const network: string = <string>process.env.NETWORK_IP;
    const networkSize: string = <string>process.env.NETWORK_SIZE;
    return new Promise((resolve, reject) => {
        new evilScan({
            target: `${network}/${networkSize}`,
            port: '631',
            banner: true,
        }, (err: any, scan: any) => {

            const devices: any[] = [];

            if (err) reject(err);

            scan.on('result', (data: any) => devices.push(data));

            scan.on('error', (err: any) => reject(err));

            scan.on('done', () => resolve(devices));

            scan.run();

        })
    })
}

function getPrinterAttributes(printer: Printer) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        printer.execute('Get-Printer-Attributes', null, (err: any, res: any) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

function doesPrinterSupportPDF(printerAttributes: any) {
    return printerAttributes['printer-attributes-tag']['document-format-supported'].indexOf('application/pdf') !== -1
}

export default async function (): Promise<string> {
    const printers: any[] = await findPrinters();

    if (printers.length === 0) {
        return 'Non trovo nessuna stampante collegata alla rete, oppure non hai stampanti compatibili';
    }

    const pdfURL: string = <string>process.env.PDF_URL;
    const pdfBuffer: Buffer = await fetch(pdfURL).then((res: any) => res.buffer());

    // TODO: in futuro implementare scelta stampanti
    let printer = ipp.Printer(`http://${printers[0]['ip']}:631`);
    const printerAttributes: any = await getPrinterAttributes(printer);
    printer = new URL(printerAttributes['printer-attributes-tag']['printer-uri-supported'][0]);
    printer.protocol = 'ipp';
    printer = ipp.Printer(printer.toString());

    const printMessage: any = {
        "operation-attributes-tag": {
            "requesting-user-name": "Gerardo",
            "job-name": "autocertificazione",
        },
    };

    // The printer support PDF Format
    if (doesPrinterSupportPDF(printerAttributes)) {
        printMessage['operation-attributes-tag']['document-format'] = 'application/pdf';
        printMessage['data'] = pdfBuffer;
    } else {
        // The printer DOESN'T support PDF Format
        printMessage['operation-attributes-tag']['document-format'] = 'image/jpeg';

        try {
            const convertOptions: Options = {
                density: 600,
                quality: 1,
                height: 2970,
                width: 2100
            }
            const convert = convertPdfToPng(pdfBuffer, convertOptions);

            const pageOutput: ToBase64Response = await convert(1, true);
            printMessage['data'] = Buffer.from(<string>pageOutput.base64, 'base64')
        } catch (e: any) {
            console.error(e);
            return e.message;
        }

    }

    printer.execute("Print-Job", printMessage, () => {});

    return "Autocertificazione in stampa!";


}
