module.exports = {
    // cada funncion se separa por comas  
    componeBody: function(sql, id) {
        //  
        var request = new sql.Request();
        request.input('id', sql.Int, id);
        return request.execute("ksp_TraeDetalleK");
        //
    },

    enviarCorreo: function(res, nodemailer, mailList, htmlBody) {
        //
        sender = 'grupocaltex.kinetik@grupocaltex.cl';
        psswrd = 'PPQL.2020';
        // sender = 'grupocaltex.kinetik@gmail.com';
        // psswrd = 'traqueral419';
        // sender = 'jogv66@gmail.com';
        // psswrd = 'murielybelen';    
        //
        cTo = mailList[0].to;
        cCc = mailList[0].cc;
        cSu = 'Contacto de pre-venta';
        // si no tiene correo se envia al vendedor
        if (cTo == '' || cTo == undefined) {
            cTo = cCc;
            cSu = 'Contacto de pre-venta (CLIENTE SIN CORREO)';
        }
        // datos del enviador
        var transporter = nodemailer.createTransport({
            host: "mail.grupocaltex.cl",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: sender,
                pass: psswrd
            }
        });
        // opciones del correo
        var mailOptions = {
            from: { name: "GrupoCaltex 👻", address: sender },
            to: cTo,
            cc: cCc, // [{ name: "julio gonzalez 👻", address: 'jogv66@gmail.com'}, 'pedroalfonsofrancisco@gmail.com' ],
            subject: cSu,
            html: htmlBody
        };
        // enviar el correo
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('error en sendmail->', error);
                res.status(500).send(error.message);
            } else {
                console.log("Email enviado a -> ", mailList[0].to);
                res.status(200).send(req.body);
            }
        });
    },

    primeraParte: function(cObs, cNumero, cOcc, xDatosVendedor, xDatosCliente) {
        return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
      
          <style type="text/css">
              * { margin: 0;  padding: 0; font-size: 100%; font-family: 'Avenir Next', "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; line-height: 1.65; }
              img { max-width: 100%;  margin: 0 auto; display: block; }
              body, .body-wrap { width: 100% !important; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; }
              a { color: #71bc37; text-decoration: none; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
              .button { display: inline-block; color: white;  background: #71bc37; border: solid #71bc37; border-width: 10px 20px 8px; font-weight: bold; border-radius: 4px; }
              h1, h2,  h3, h4, h5, h6 { margin-bottom: 20px; line-height: 1.25; }
              h1 { font-size: 32px; }
              h2 { font-size: 28px; }
              h3 { font-size: 24px; }
              h4 { font-size: 20px; }
              h5 { font-size: 16px; }
              p, ul, ol { font-size: 16px; font-weight: normal; margin-bottom: 20px; }
              .container { display: block !important; clear: both !important; margin: 0 auto !important; max-width: 980px !important; }
              .container table { width: 100% !important; border-collapse: collapse; }
              .container .masthead { padding: 10px 0;  background: #222; color: white; }
              .container .masthead h1 { margin: 0 auto !important; max-width: 90%; text-transform: uppercase; }
              .container .content {  background: white; padding: 30px 35px; }
              .container .content.footer { background: none;  }
              .container .content.footer p { margin-bottom: 0; color: #888; text-align: center; font-size: 10px; }
              .container .content.footer a { color: #888; text-decoration: none; font-weight: bold; }
          </style>
      </head>
      
      <body>
          <table class="body-wrap">
              <tr>
                  <td class="container">
      
                      <!-- Message start -->
                      <table>
                          <tr>
                              <td align="center" class="masthead">
                              <img src="http://www.grupocaltex.cl/imagenes/fotos18/banner_logos_correo.png" alt="grupocaltex.cl"></img>
                              </td>
                          </tr>
                          <!-- KINETIK -->
                          <tr>
                              <td class="content">
                                  <p>Estimado cliente: Este documento es una copia de respaldo a la atención prestada. Tenga en cuenta que stocks y precios podrían variar en el tiempo. Sírvase revisar con el vendedor los datos definitivos de su pedido.</p>
                                    <br>
                                    <table border="1">
                                        ` + (xDatosCliente.codCliente != '' && xDatosCliente.codCliente != undefined ? '<tr><td>Código Cliente   </td><td align="left">' + xDatosCliente.codCliente + '  </td></tr>' : '') + `
                                        ` + (xDatosCliente.rsocial != '' && xDatosCliente.rsocial != undefined ? '<tr><td>Razón Social     </td><td align="left">' + xDatosCliente.rsocial + '     </td></tr>' : '') + `
                                        ` + (xDatosCliente.sucCliente != '' && xDatosCliente.sucCliente != undefined ? '<tr><td>Sucursal Cliente </td><td align="left">' + xDatosCliente.sucCliente + '  </td></tr>' : '') + `
                                        ` + (xDatosVendedor.nombreVend != '' && xDatosVendedor.nombreVend != undefined ? '<tr><td>Vendedor Asignado</td><td align="left">' + xDatosVendedor.nombreVend + ' </td></tr>' : '') + `
                                        ` + (cNumero != '' && cNumero != undefined ? '<tr><td>Documento        </td><td align="left">' + cNumero + '                      </td></tr>' : '') + `
                                        ` + (cObs != '' && cObs != undefined ? '<tr><td>Observaciones    </td><td align="left">' + cObs + '                         </td></tr>' : '') + `
                                        ` + (cOcc != '' && cOcc != undefined ? '<tr><td>Orden de Compra  </td><td align="left">' + cOcc + '                         </td></tr>' : '') + `
                                    <!--  KINETIK -->
                                    </table>
                                    <br>
                                    <h3>Detalle de la atención</h3>
                                    <table border="1">
                                        <tr>
                                            <td align="center">Cantidad</td>
                                            <td align="center">Código</td>
                                            <td align="center">Descripción</td>
                                            <td align="center">Precio Unit</td>
                                            <td align="center">Descto.</td>
                                            <td align="center">SubTotal</td>
                                        </tr>`;
    },

    segundaParte: function() {
        return `            </table>

            </td>
        </tr>
        <!--  KINETIK -->
        </table>

        </td>
        </tr>
        <tr>
        <td class="container">

        <!-- Message start -->
        <table>
        <tr>
            <td class="content footer" align="center">
                <p>Desarrollado por Kinetik - Soluciones Móviles</p>
            </td>
        </tr>
        </table>

        </td>
        </tr>
        </table>
        </body>

        </html>`;
    },

    cotizcuerpo: function(nombreVendedor, nombrecliente, empresa, xemailobs) {
        return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width" />
    
        <style type="text/css">
            * { margin: 0;  padding: 0; font-size: 100%; font-family: 'Avenir Next', "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; line-height: 1.65; }
            img { max-width: 100%;  margin: 0 auto; display: block; }
            body, .body-wrap { width: 100% !important; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; }
            a { color: #71bc37; text-decoration: none; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .button { display: inline-block; color: white;  background: #71bc37; border: solid #71bc37; border-width: 10px 20px 8px; font-weight: bold; border-radius: 4px; }
            h1, h2,  h3, h4, h5, h6 { margin-bottom: 20px; line-height: 1.25; }
            h1 { font-size: 32px; }
            h2 { font-size: 28px; }
            h3 { font-size: 24px; }
            h4 { font-size: 20px; }
            h5 { font-size: 16px; }
            p, ul, ol { font-size: 16px; font-weight: normal; margin-bottom: 20px; }
            .container { display: block !important; clear: both !important; margin: 0 auto !important; max-width: 980px !important; }
            .container table { width: 100% !important; border-collapse: collapse; }
            .container .masthead { padding: 10px 0;  background: #222; color: white; }
            .container .masthead h1 { margin: 0 auto !important; max-width: 90%; text-transform: uppercase; }
            .container .content {  background: white; padding: 30px 35px; }
            .container .content.footer { background: none;  }
            .container .content.footer p { margin-bottom: 0; color: #888; text-align: center; font-size: 10px; }
            .container .content.footer a { color: #888; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    
    <body>
        <table class="body-wrap">
            <tr>
                <td class="container">
    
                    <!-- Message start -->
                    <table>
                        <tr>
                            <td align="center" class="masthead">
                            <img src="http://www.grupocaltex.cl/imagenes/fotos18/banner_logos_correo.png" alt="grupocaltex.cl"></img>
                            </td>
                        </tr>
                        <!-- KINETIK -->
                        <tr>
                            <td class="content">
                                <p>Estimado cliente: Este documento es una copia de respaldo a la atención prestada. Tenga en cuenta que stocks y precios podrían variar en el tiempo. Sírvase revisar con el vendedor los datos definitivos de su atención.</p>
                                  <br>
                                  <table border="1">
                                    ` + (nombreVendedor != '' && nombreVendedor != undefined ? '<tr><td>Vendedor Atendiendo</td><td align="left">' + nombreVendedor + '</td></tr>' : '') + `
                                    ` + (nombrecliente != '' && nombrecliente != undefined ? '<tr><td>Cliente Atendido</td><td align="left">' + nombrecliente + ' </td></tr>' : '') + `
                                    ` + (xemailobs != '' && xemailobs != undefined ? '<tr><td>Observaciones</td><td align="left">' + xemailobs + ' </td></tr>' : '') + `
                                  <!--  KINETIK -->
                                  </table>
                                  <br><h3>
                                  ` + (empresa === '04' ? 'Detalle de la Pre-Venta' : 'Detalle de la Cotización') + `
                                  </h3>
                                  <table border="1">
                                  ` + (empresa === '04' ? '<tr><td align="center">Código Principal</td><td align="center">Código Técnico</td><td align="center">Descripción</td><td align="center">Precio x Mt.</td><td align="center">Cantidad</td><td align="center">Unidad</td></tr>' : '<tr><td align="center">Imagen (150x150)</td><td align="center">Código Interno</td><td align="center">Cód.Técnico</td><td align="center">Descripción</td><td align="center">Precio Unit.</td><td align="center">Curva</td></tr>')
    },

    cotizfin: function() {
        return `            </table>

          </td>
      </tr>
      <!--  KINETIK -->
      </table>

      </td>
      </tr>
      <tr>
      <td class="container">

      <!-- Message start -->
      <table>
      <tr>
          <td class="content footer" align="center">
              <p>Desarrollado por Kinetik - Soluciones Móviles a su medida (2019)</p>
          </td>
      </tr>
      </table>

      </td>
      </tr>
      </table>
      </body>

      </html>`;
    },

    enviarCotizacion: function(res, nodemailer, mailList, htmlBody, empresa) { //, cfile, pathfile ) {
        //
        sender = 'grupocaltex.kinetik@grupocaltex.cl';
        psswrd = 'PPQL.2020';
        // sender = 'grupocaltex.kinetik@gmail.com';
        // psswrd = 'traqueral419';
        // sender = 'jogv66@gmail.com';
        // psswrd = 'murielybelen';    
        //
        cTo = mailList[0].to;
        cCc = mailList[0].cc;
        cSu = (empresa === '04') ? 'Información de Pre-Venta' : 'Cotización Grupo Caltex';
        // datos del enviador
        var transporter = nodemailer.createTransport({
            host: "mail.grupocaltex.cl",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: sender,
                pass: psswrd
            }
        });
        // opciones del correo
        var mailOptions = {
            from: { name: "GrupoCaltex 👻", address: sender },
            to: cTo,
            cc: cCc, // [{ name: "julio gonzalez 👻", address: 'jogv66@gmail.com'}, 'pedroalfonsofrancisco@gmail.com' ],
            subject: cSu,
            html: htmlBody
                /*,
                       attachments: [{ // file on disk as an attachment
                               filename: cfile,
                               path: pathfile // stream this file
                           }
                       ]*/
        };
        // enviar el correo
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('error en sendmail->', error);
                res.status(500).send(error.message);
            } else {
                console.log("Email enviado a -> ", mailList[0].to);
                res.status(200).send(req.body);
            }
        });
    },

    enCo2: function(res, nodemailer, mailList, htmlBody, cfile, pathfile, fs, empresa) {
        //
        sender = 'grupocaltex.kinetik@grupocaltex.cl';
        psswrd = 'PPQL.2020';
        // sender = 'grupocaltex.kinetik@gmail.com';
        // psswrd = 'traqueral419';
        // sender = 'jogv66@gmail.com';
        // psswrd = 'murielybelen';    
        //
        cTo = mailList[0].to;
        cCc = mailList[0].cc;
        cSu = (empresa === '04') ? 'Detalle de Pre-Venta' : 'Cotización Grupo Caltex';
        // datos del enviador
        var transporter = nodemailer.createTransport({
            host: "mail.grupocaltex.cl",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: sender,
                pass: psswrd
            }
        });
        // opciones del correo
        var mailOptions = {
            from: { name: "GrupoCaltex 👻", address: sender },
            to: cTo,
            cc: (empresa === '04') ? [cCc, { name: "Andres Cuminao", address: 'acuminao@grupocaltex.cl' }] : cCc,
            subject: cSu,
            html: htmlBody,
            attachments: [{ filename: cfile, path: pathfile + '/' + cfile }]
        };
        // enviar el correo
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('error en sendmail->', error);
                res.status(500).send(error.message);
            } else {
                console.log("Email enviado a -> ", mailList[0].to);
                fs.unlinkSync(pathfile + '/' + cfile);
                res.status(200).send(req.body);

            }
        });
    },

    validarHTML: function() {
        return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width" />
    
        <style type="text/css">
            * { margin: 0;  padding: 0; font-size: 100%; font-family: 'Avenir Next', "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; line-height: 1.65; }
            img { max-width: 100%;  margin: 0 auto; display: block; }
            body, .body-wrap { width: 100% !important; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; }
            a { color: #71bc37; text-decoration: none; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .button { display: inline-block; color: white;  background: #71bc37; border: solid #71bc37; border-width: 10px 20px 8px; font-weight: bold; border-radius: 4px; }
            h1, h2,  h3, h4, h5, h6 { margin-bottom: 20px; line-height: 1.25; }
            h1 { font-size: 32px; }
            h2 { font-size: 28px; }
            h3 { font-size: 24px; }
            h4 { font-size: 20px; }
            h5 { font-size: 16px; }
            p, ul, ol { font-size: 16px; font-weight: normal; margin-bottom: 20px; }
            .container { display: block !important; clear: both !important; margin: 0 auto !important; max-width: 980px !important; }
            .container table { width: 100% !important; border-collapse: collapse; }
            .container .masthead { padding: 10px 0;  background: #222; color: white; }
            .container .masthead h1 { margin: 0 auto !important; max-width: 90%; text-transform: uppercase; }
            .container .content {  background: white; padding: 30px 35px; }
            .container .content.footer { background: none;  }
            .container .content.footer p { margin-bottom: 0; color: #888; text-align: center; font-size: 10px; }
            .container .content.footer a { color: #888; text-decoration: none; font-weight: bold; }
            .link-button-wrapper {
                width: 200px;
                height: 40px;
                box-shadow: inset 0px 1px 0px 0px #ffffff;
                border-radius: 4px;
                background-color: #BC0000;
                box-shadow: 0px 2px 4px gray;
                display: block;
                border:1px solid #094BC0;
                }
                .link-button-wrapper > a {
                    display: inline-table;
                    cursor: pointer;
                    text-decoration: none;
                    height: 100%;
                    width:100%;
                }
                .link-button-wrapper > a > h1 {
                    margin: 0 auto;
                    display: table-cell;
                    vertical-align: middle;
                    color: #FFFFFF;
                    font-size: 18px;
                    text-align: center;
                }
        </style>
    </head>
      
    <body>
        <table class="body-wrap">
            <tr>
                <td class="container">
                    <!-- Message start -->
                    <table>
                        <tr>
                            <td align="center" class="masthead">
                            <img src="http://www.grupocaltex.cl/imagenes/fotos18/bannerch_logos_correo.png" alt="chelech.cl"></img>
                            </td>
                        </tr>
                        <!-- KINETIK -->
                        <tr>
                            <td class="content">
                                <p>Hola ##usuario##</p>
                                <br>
                                <p>Gracias por registrarse en la App de Empresas CHELECH. Solo falta un pequeño paso.</p>
                                <br>
                                <p>Pulsa el botón rojo, el cual terminará de validar tu registro.</p>
                                <br>
                                <div class="link-button-wrapper">
                                    <a href="##verificador##">
                                        <h1>Verifica mi correo!</h1>
                                    </a>
                                </div>
                                <br>
                            </td>
                        </tr>
                        <!--  KINETIK -->
                    </table>
                </td>
            </tr>
            <tr>
                <td class="container">
                    <!-- Message start -->
                    <table>
                        <tr>
                            <td class="content footer" align="center">
                                <p>Desarrollado por Kinetik - Soluciones Móviles</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
    },

};