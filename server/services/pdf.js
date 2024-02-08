const puppeteer = require('puppeteer');
const fs = require('fs');

exports.pdfConventer = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const html = fs.readFileSync('./views/chart.hbs', 'utf8');
    await page.setContent(html, {waitUntil: 'domcontentloaded'});
    await page.emulateMediaType('screen');
     // Downlaod the PDF
    const pdf = await page.pdf({
        path: 'sales.pdf',
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
    });

    // Close the browser instance
    await browser.close();
}