//Unofficial WebPay SDK for Node.js
//Copyright (C) 2017-2020  Rodrigo González Castillo <r.gnzlz.cstll@gmail.com>, et al.

module.exports = (res) => {

    return function(err) {
        console.log('ERROR', err);
        res.send(`
        <html>
            <head><meta charset="utf-8"></head>
            <body>
              <h1>ERROR</h1>
              <pre>
              ${err.stack}
              </pre>
            </body>
        </html>
      `);
    };

};