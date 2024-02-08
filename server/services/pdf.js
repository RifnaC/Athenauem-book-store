// const puppeteer = require('puppeteer');

// (async () => {
//   // Launch headless Chromium browser
//   const browser = await puppeteer.launch();

//   // Create a new page
//   const page = await browser.newPage();

//   // Set the HTML content (you need to replace this with your Handlebars template)
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Handlebars PDF</title>
//       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
//     </head>
//     <body>
//       <div class="container">
//         <h1>Handlebars PDF Example</h1>
//         <p>This is the content of your Handlebars template.</p>
//       </div>
//     </body>
//     </html>
//   `;

//   // Set the HTML content of the page
//   await page.setContent(htmlContent);

//   // Wait for the content to be rendered (you may need to adjust the timeout)
//   await new Promise(resolve => setTimeout(resolve, 5000));

//   // Generate the PDF of the current page
//   await page.pdf({ path: 'handlebars.pdf', format: 'A4' });

//   // Close the browser
//   await browser.close();
// })();
