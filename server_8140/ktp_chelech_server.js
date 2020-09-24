// console.log("hola mundo");
var express = require('express');
var app = express();
// tto asincrono para grabaciones
var async = require("async");
// configuracion
var _dbconex = require('./conexion_mssql.js');
var _configuracion = require('./configuracion_cliente.js');
var _correos = require('./k_sendmail.js');
var _elmail = require('./k_traemail.js');
var _lasEmpresas = require('./k_empresas.js');
var _funciones = require('./k_funciones.js');
var _Activity = require('./k_regactiv.js');
// exportar a excel
var fs = require('fs');
var path = require('path');
// var http      = require('http');
//
var fileExist = require('file-exists');
//
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(204);
    } else {
        next();
    }
});
// envio de _correos 
var nodemailer = require('nodemailer'); // email sender function 
exports.sendEmail = function(req, res) {
    console.log('enviando correo...');
};
//
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// servidor escuchando puerto 8140
app.set('port', 8140);
var ipAddress = '0.0.0.0';
var https = require('https');
var fileSystem = require('fs');
var https_options = {
    key: fileSystem.readFileSync('/etc/letsencrypt/live/kinetik.cl/privkey.pem'),
    cert: fileSystem.readFileSync('/etc/letsencrypt/live/kinetik.cl/fullchain.pem')
};
server = https.createServer(https_options, app).listen(app.get('port'), function() {
    console.log('Server started on localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
    console.log('Please connect to configured IP: ', ipAddress);
    console.log('Application worker ', process.pid, ' started...');
});

// carpeta de imagenes: desde donde se levanta el servidor es esta ruta -> /root/trial-server-001/public
app.use(express.static('./public'));

publicpath = path.resolve(__dirname, 'public');
CARPETA_IMGS = publicpath + '/images/';
CARPETA_XLSX = publicpath + '/xlsx/';
// console.log(CARPETA_IMGS, CARPETA_XLSX );

// dejare el server myssql siempre activo
var sql = require('mssql');
var conex = sql.connect(_dbconex);

app.get('/ping',
    function(req, res) {
        res.json({ resultado: 'PONG' });
    });

// http://server:port/ktp_variables/:usr/:dato1/:dato2....
app.get('ktp_variables_get/:cliente',
    function(req, res) {
        _lasEmpresas.variables(sql, req.params.cliente)
            .then(function(data) {
                res.json({ resultado: 'ok', variables: data });
            });
    });

// pruebas go2shop
app.post('/g2s_buscar',
    function(req, res) {
        _funciones.g2sGetBuscar(sql, req.body)
            .then(function(rs) {
                    res.json({ resultado: 'ok', data: rs });
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });


// pruebas go2shop
app.post('/g2s_buscarcategorias',
    function(req, res) {
        _funciones.g2sGetBuscarCateg(sql, req.body)
            .then(function(rs) {
                    res.json({ resultado: 'ok', data: rs });
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });

// pruebas go2shop
app.post('/g2s_usuario',
    function(req, res) {
        _funciones.g2sGetUsuario(sql, req.body)
            .then(function(rs) {
                    if (rs[0].resultado === 'ok') {
                        res.json({ resultado: 'ok', data: rs });
                    } else {
                        res.json({ resultado: 'error', data: rs[0].mensaje });
                    }
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxkxxixxn4xxeyxxtxxxixxxkxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// pruebas go2shop
app.post('/g2s_insUsuario',
    function(req, res) {
        var id_unico = generateUUID();
        _funciones.g2sPutUsuario(sql, req.body, id_unico)
            .then(function(rs) {
                    if (rs[0].resultado === true) {
                        sendValidationMail(res, req.body, id_unico);
                    } else {
                        res.status(500).json({ resultado: 'error', data: rs[0].mensaje });
                    }
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });
// pruebas go2shop
sendValidationMail = function(res, body, id_unico) {
    //
    sender = 'jogv66@gmail.com';
    psswrd = 'belenmurielamelia';
    //
    var go2_link = 'https://api.kinetik.cl/go2shop/validator?uuid=' + id_unico;
    var delBody = _correos.validarHTML();
    //
    delBody = delBody.replace('##usuario##', body.nombre);
    delBody = delBody.replace('##verificador##', go2_link);
    // 
    cTo = body.email;
    cSu = 'CHELECH: Validar creación de registro';
    // datos del enviador
    // datos del enviador
    var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: sender, pass: psswrd } });
    // var transporter = nodemailer.createTransport({
    //     pool: true,
    //     host: "mail.grupocaltex.cl",
    //     port: 465,
    //     secure: true, // use TLS
    //     auth: {
    //         user: sender,
    //         pass: psswrd
    //     }
    // });
    // opciones del correo
    var mailOptions = {
        from: { name: "Empresas Chelech", address: sender },
        to: cTo,
        subject: cSu,
        html: delBody
    };
    // enviar el correo
    transporter.sendMail(mailOptions, function(error) {
        if (error) {
            console.log('error en sendmail->', error);
            res.status(500).json({ resultado: 'error', mensaje: error });
        } else {
            console.log("Email de registro enviado a -> ", cTo);
            res.json({ resultado: 'ok' });
        }
    });
};

app.get('/validator',
    function(req, res) {
        _funciones.g2sValidator(sql, req.query)
            .then(function(rs) {
                    res.send('<p>Ud. ha completado correctamente su registro en CHELECH.</p>');
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });

// pruebas go2shop
app.post('/g2s_forgot',
    function(req, res) {
        _funciones.g2sGetClave(sql, req.body)
            .then(function(rs) {
                    if (rs.resultado === 'ok') {
                        res.json({ resultado: 'ok', data: rs });
                    } else {
                        res.json({ resultado: 'error', data: '' });
                    }
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });

// pruebas go2shop
app.post('/g2s_categorias',
    function(req, res) {
        _funciones.g2sGetCategorias(sql, req.body)
            .then(function(rs) {
                    res.json({ resultado: 'ok', data: rs });
                },
                function(err) {
                    res.status(500).json({ resultado: 'error', data: err });
                });
    });

app.post('/soloEnviarCorreo',
    function(req, res) {
        //
        var carro = req.body.carro || [];
        var xTo = req.body.cTo || '';
        var xCc = req.body.cCc || '';
        var xObs = req.body.cObs || '';
        //
        var lineas = '';
        var htmlBody = '';
        //
        var x2 = '';
        //
        _elmail.delVendedor(sql, carro[0].vendedor).then(function(data) { x2 = data; });
        // es obligatorio que el vendedor tenga correo
        var mailList = [];
        //
        _Activity.registra(sql, carro[0].vendedor, 'soloEnviarCorreo', xTo, xCc, x2);
        //
        carro.forEach(element => {
            lineas += '<tr>';
            lineas += '<td align="center">' + element.cantidad.toString() + '</td>';
            lineas += '<td align="center">' + element.codigo + '</td>';
            lineas += '<td align="center">' + element.descripcion + '</td>';
            lineas += '<td align="center">' + element.preciounit.toLocaleString() + '</td>';
            lineas += '<td align="center">' + element.descuentos.toString() + '</td>';
            lineas += '<td align="center">' + element.subtotal.toLocaleString() + '</td>';
            lineas += '</tr>';
        });
        htmlBody = _correos.primeraParte(xObs) + lineas + _correos.segundaParte();
        mailList.push({ cc: [xCc, x2], to: xTo });
        //console.log('soloEnviarCorreo->',xCc, x2, xTo );
        _correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
        //
    });

app.post('/enviarcorrreo',
    function(req, res) {
        //
        var carro = req.body.itemes || [];
        var xTo = req.body.cTo || '';
        var xCc = req.body.cCc || '';
        var xEmailVend = req.body.emailvend || '';
        var xnombre = req.body.nombre || '';
        //
        var lineas = '';
        var htmlBody = '';
        //
        var mailList = [{ cc: [xCc, xEmailVend], to: xTo }];
        //
        carro.forEach(function(element) {
            lineas += '<tr>';
            lineas += '<td align="center"><img src="http://www.grupocaltex.cl/imagenes/fotos18/' + element.codigoimagen + '.jpg" width="150px" height="150px"/></td>';
            lineas += '<td align="center">' + element.codigo + '</td>';
            lineas += '<td align="center">' + element.codigotec + '</td>';
            lineas += '<td align="center">' + element.descrip + '</td>';
            lineas += '<td align="center">' + element.precio.toLocaleString() + '</td>';
            lineas += '<td align="center">' + element.rtu.toString() + '</td>';
            lineas += '</tr>';
        });
        //
        htmlBody = _correos.cotizcuerpo(xnombre) + lineas + _correos.cotizfin();
        _correos.enviarCotizacion(res, nodemailer, mailList, htmlBody, '');
        //
        res.json({ resultado: 'ok', numero: 'ENVIADO' });
        //
    });

app.post('/encorr2',
    function(req, res) {
        //
        var carro = req.body.itemes || [];
        var xTo = req.body.cTo || '';
        var xCc = req.body.cCc || '';
        var xEmailVend = req.body.emailvend || '';
        var xnombre = req.body.nombre || '';
        var empresa = req.body.empresa || '';
        var xnombrecli = req.body.cNombreCli || '(no indicado)';
        var xemailobs = req.body.cEmailObs || '';
        //
        var lineas = '';
        var htmlBody = '';
        //
        var mailList = [{ cc: [xCc, xEmailVend], to: xTo }];
        //
        var xhoy = new Date();
        var anno = xhoy.getFullYear();
        var mes = xhoy.getMonth() + 1;
        var dia = xhoy.getDate();
        var rnd = (Math.random() * (100 - 1) + 1).toString();
        //
        var cfile = 'cotiz' + anno.toString() + mes.toString() + dia.toString() + rnd.replace(".", "") + '.csv';
        var pathfile = __dirname + '/public';
        //
        var header = '';
        var rows = '';
        var xpre = '';
        var xcan = 0;
        var xuni = '';
        // si es la textil los datos on otros 
        if (empresa === '04') {
            header += "Codigo Interno" + ";";
            header += "Cod.Tecnico" + ";";
            header += "Descripcion" + ";";
            header += "Precio x Mt." + ";";
            header += "Cantidad" + ";";
            header += "Unidad" + ";";
            //
            carro.forEach(function(element) {
                // excel
                xpre = element.precioxmetro.toLocaleString();
                xcan = (element.metros > 0) ? element.metros.toLocaleString() : element.rollos.toLocaleString();
                xuni = (element.metros > 0) ? 'MT' : 'ROLLO';
                //
                lineas += '<tr>';
                // lineas += '<td align="center"><img src="http://www.grupocaltex.cl/imagenes/fotos18/'+element.codigoimagen+'.jpg" width="150px" height="150px"/></td>';
                lineas += '<td align="center">' + element.codigo + '</td>';
                lineas += '<td align="center">' + element.codigotec + '</td>';
                lineas += '<td align="center">' + element.descrip + '</td>';
                lineas += '<td align="center">' + xpre + '</td>';
                lineas += '<td align="center">' + xcan + '</td>';
                lineas += '<td align="center">' + xuni + '</td>';
                lineas += '</tr>';
                //
                rows += '"' + element.codigo + '"' + ";";
                rows += '"' + element.codigotec + '"' + ";";
                rows += '"' + element.descrip + '"' + ";";
                rows += xpre.replace(',', '') + ";";
                rows += xcan.replace(',', '') + ";";
                rows += '"' + xuni + '"' + ";";
                //
            });
            // todoas las demas empresas
        } else {
            header += "Codigo Interno" + ";";
            header += "Cod.Tecnico" + ";";
            header += "Descripcion" + ";";
            header += "Precio" + ";";
            header += "Curva" + ";";
            header += "Imagen" + "\n";
            //
            carro.forEach(function(element) {
                lineas += '<tr>';
                lineas += '<td align="center"><img src="http://www.grupocaltex.cl/imagenes/fotos18/' + element.codigoimagen + '.jpg" width="150px" height="150px"/></td>';
                lineas += '<td align="center">' + element.codigo + '</td>';
                lineas += '<td align="center">' + element.codigotec + '</td>';
                lineas += '<td align="center">' + element.descrip + '</td>';
                lineas += '<td align="center">' + element.precio.toLocaleString() + '</td>';
                lineas += '<td align="center">' + element.rtu.toString() + '</td>';
                lineas += '</tr>';
                // excel
                xpre = element.precio.toLocaleString();
                //
                rows += '"' + element.codigo + '"' + ";";
                rows += '"' + element.codigotec + '"' + ";";
                rows += '"' + element.descrip + '"' + ";";
                rows += xpre.replace(',', '') + ";";
                rows += element.rtu.toString() + ";";
                rows += '"http://www.grupocaltex.cl/imagenes/fotos18/' + element.codigoimagen + '.jpg"' + "\n";
                //
            });
        }
        //
        fs.writeFileSync(pathfile + '/' + cfile, header + rows);
        var xxxx = fs.readFileSync(pathfile + '/' + cfile);
        data_txt = new Buffer(xxxx).toString();
        // console.log(data_txt);
        htmlBody = _correos.cotizcuerpo(xnombre, xnombrecli, empresa, xemailobs) + lineas + _correos.cotizfin();
        console.log(htmlBody);
        // 
        _correos.enCo2(res, nodemailer, mailList, htmlBody, cfile, pathfile, fs, empresa);
        //
        res.json({ resultado: 'ok', numero: 'ENVIADO' });
        //
    });

// agregado el 29/11/2018
app.post('/grabadocumentos_mejorado_para_trabajarlo',
    function(req, res) {
        // los parametros
        var carro = req.body.carro;
        var modalidad = req.body.modalidad;
        var tipodoc = req.body.tipodoc || 'PRE'; /* PRE, NVV, COV */
        var xObs = req.body.cObs || '';
        var xOcc = req.body.cOcc || ''; // incorporada 27/07/2018, se modifica ktp_encabezado -> occ varchar(40)
        // variables
        var bodega_wms = '';
        //
        var query = '';
        var xhoy = new Date();
        var hora = xhoy.getTime();
        //
        var lineas = '';
        var htmlBody = '';
        var mailList = [];
        var x1 = '';
        var x2 = '',
            rsocial = '',
            copiasadic = '',
            nombreVend = '',
            i = 0,
            monto = 0,
            neto = 0,
            iva = 0,
            bruto = 0,
            NoB = carro[0].metodolista;

        // 
        //console.log( carro );  
        _Activity.registra(sql, carro[0].vendedor, 'grabadocumentos', tipodoc);
        //
        query = "declare @id     int      = 0 ; ";
        query += "declare @nrodoc char(10) = ''; ";
        query += "declare @Error nvarchar(250) ; ";
        query += "begin transaction ;";
        query += "insert into ktp_encabezado (empresa,cliente,suc_cliente,vendedor,fechaemision,";
        query += "monto,observacion,occ,modalidad,valido,fechaentrega,horainicio,horafinal) ";
        query += "values ('" + carro[0].empresa + "','" + carro[0].cliente + "','" + carro[0].suc_cliente + "','" + carro[0].vendedor + "',getdate(),";
        query += "0,'" + xObs.trim() + "','" + xOcc.trim() + "','" + modalidad + "','',getdate(),'" + hora + "','" + hora + "') ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        query += "select @id = @@IDENTITY ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        //
        for (i = 0; i < carro.length; i++) {
            //
            bodega_wms = carro[i].bodega;
            //
            query += "insert into ktp_detalle (id_preventa,linea,sucursal,bodega,codigo,unidad_tr,unidad1,unidad2,cantidad1,cantidad2,";
            query += "listaprecio,metodolista,precio,";
            query += "porcedes,descuentos,porcerec,recargos,observacion,valido)";
            query += " values ";
            query += "(@id," + (i + 1).toString() + ",'" + carro[i].sucursal + "','" + carro[i].bodega + "','" + carro[i].codigo + "',";
            query += "1,'',''," + carro[i].cantidad.toString() + ", 0,'" + carro[i].listapre + "','" + carro[i].metodolista + "'," + carro[i].precio.toString() + ",";
            query += carro[i].dsctovend.toString() + "," + ((carro[i].precio - carro[i].preciomayor) * carro[i].cantidad).toString() + ",0,0,'', '' ) ; ";
            query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
            //
        }
        //    
        query += "update ktp_encabezado set monto=( select sum((d.cantidad1*d.precio)-d.descuentos) from ktp_detalle as d where d.id_preventa=ktp_encabezado.id_preventa ) ";
        query += " where id_preventa=@id ;";
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        //
        if (tipodoc == 'PRE') { query += "exec ksp_grabaDocumentoPre_v1 'Pendiente', 'NVV', @id, @nrodoc output ;"; } else if (tipodoc == 'NVV' || tipodoc == 'COV') { query += "exec ksp_grabaDocumentoDef_v1 '" + tipodoc + "', @id, @nrodoc output ;"; }
        //
        query += "set @Error = @@ERROR ; if (@Error<>0) goto TratarError ; ";
        query += "commit transaction ;";
        query += "select @nrodoc as numero, @id as id ;";
        query += "TratarError: ";
        query += "if @@Error<>0 ";
        query += "    BEGIN ";
        query += "    ROLLBACK TRANSACTION ";
        query += "    END ;";
        //
        //console.log( query );
        //
        conex
            .then(function() {
                //
                lineas = '';
                var request = new sql.Request();
                // 
                request.query(query)
                    .then(function(rs) {
                        console.log("documento (" + tipodoc + ") grabado ", rs.recordset);
                        res.json({ resultado: 'ok', numero: rs.recordset[0].numero });
                        // es obligatorio que el vendedor tenga correo
                        elmail.delVendedor(sql, carro[0].vendedor)
                            .then(function(data) {
                                x2 = data[0].correo;
                                nombreVend = data[0].nombre;
                                copiasadic = data[0].copiasadic || '';
                                //
                                elmail.delCliente(sql, carro[0].cliente, carro[0].suc_cliente)
                                    .then(function(data) {
                                        x1 = data[0].correo;
                                        rsocial = data[0].rs;
                                        //
                                        correos.componeBody(sql, rs.recordset[0].id)
                                            .then(data => {
                                                data.recordset.forEach(element => {
                                                    lineas += '<tr>';
                                                    lineas += '<td align="center">' + element.cantidad.toString() + '</td>';
                                                    lineas += '<td align="center">' + element.codigo + '</td>';
                                                    lineas += '<td align="center">' + element.descripcion + '</td>';
                                                    lineas += '<td align="center">' + element.preciounit.toLocaleString() + '</td>';
                                                    lineas += '<td align="center">' + element.porcentaje.toString() + '%</td>';
                                                    lineas += '<td align="center">' + element.subtotal.toLocaleString() + '</td>';
                                                    lineas += '</tr>';
                                                    monto += element.subtotal;
                                                    if (++i == data.recordset.length) {
                                                        if (NoB == 'N') {
                                                            neto = monto;
                                                            iva = Math.round(monto * 0.19);
                                                            bruto = neto + iva;
                                                        } else {
                                                            bruto = monto;
                                                            neto = Math.round(monto / (1 + 19));
                                                            iva = bruto - neto;
                                                        }
                                                        lineas += '<tr>';
                                                        lineas += '<td colspan="5" align="right"><strong>TOTAL NETO :</strong></td>';
                                                        lineas += '<td align="center">' + neto.toLocaleString() + '</td>';
                                                        lineas += '</tr>';
                                                        lineas += '<tr>';
                                                        lineas += '<td colspan="5" align="right"><strong>IVA :</strong></td>';
                                                        lineas += '<td align="center">' + iva.toLocaleString() + '</td>';
                                                        lineas += '</tr>';
                                                        lineas += '<tr>';
                                                        lineas += '<td colspan="5" align="right"><strong>TOTAL BRUTO :</strong></td>';
                                                        lineas += '<td align="center">' + bruto.toLocaleString() + '</td>';
                                                        lineas += '</tr>';
                                                        //            
                                                    }
                                                });
                                                // 
                                                htmlBody = correos.primeraParte(xObs, nombreVend, rsocial, carro[0].cliente, carro[0].suc_cliente, rs.recordset[0].numero, tipodoc, xOcc) + lineas + correos.segundaParte();
                                                //
                                                mailList.push({ cc: [x2, copiasadic], to: x1 });
                                                correos.enviarCorreo(null, nodemailer, mailList, htmlBody);
                                            });
                                    });
                            });
                    })
                    .catch(function(er) {
                        console.log('error al grabar', er);
                        res.send(er);
                    });
            });
    });

// agregado el 23/05/2018
app.post('/grabadocumentos',
    function(req, res) {
        // los parametros
        var carro = req.body.carro;
        var modalidad = req.body.modalidad;
        var tipodoc = req.body.tipodoc || 'PRE'; /* PRE, NVV, COV */
        var xObs = req.body.cObs || '';
        var xOcc = req.body.cOcc || ''; // incorporada 27/07/2018, se modifica ktp_encabezado -> occ varchar(40)
        var xFechaDesp = req.body.fechaDespacho || ''; // incorporrado el 30/110/2018
        //
        var error;
        var xhoy = new Date();
        var hora = xhoy.getTime();
        //
        var htmlBody = '';
        var mailList = [];
        var xDatosVendedor = '',
            xDatosCliente = '',
            monto = 0,
            neto = 0,
            iva = 0,
            bruto = 0,
            NoB = carro[0].metodolista;

        var carroConCompras = [],
            nrocon, ok_con = 0;
        var carroSinCompras = [],
            nrosin, ok_sin = 0;
        // 
        _elmail.delVendedorMas(sql, carro[0].vendedor).then(data => { xDatosVendedor = data; });
        _elmail.delClienteMas(sql, carro[0].cliente, carro[0].suc_cliente).then(data => { xDatosCliente = data; });
        // 
        _Activity.registra(sql, carro[0].vendedor, 'grabadocumentos', tipodoc);
        //
        carroConCompras = carro;
        //
        async.series([
            function(callback) {
                // carroConCompras
                if (carroConCompras.length > 0) {
                    //
                    query = _funciones.generaQuery(carroConCompras, modalidad, hora, tipodoc, xObs, xOcc, xFechaDesp);
                    console.log("generaQuery( CON ) " + query);
                    //
                    conex
                        .then(function() {
                            //
                            var lineas = '';
                            var request = new sql.Request();
                            // 
                            request.query(query)
                                .then(function(rs) {
                                    console.log("documento (" + tipodoc + ") grabado ", rs.recordset);
                                    nrocon = rs.recordset[0].numero;
                                    ok_con = 1;
                                    //if (carroSinCompras.length == 0) { res.json( { resultado: 'ok', numero: rs.recordset[0].numero } ); };
                                    _correos.componeBody(sql, rs.recordset[0].id)
                                        .then(data => {
                                            data.recordset.forEach(element => {
                                                lineas += '<tr>';
                                                lineas += '<td align="center">' + element.cantidad.toString() + '</td>';
                                                lineas += '<td align="center">' + element.codigo + '</td>';
                                                lineas += '<td align="center">' + element.descripcion + '</td>';
                                                lineas += '<td align="center">' + element.preciounit.toLocaleString() + '</td>';
                                                lineas += '<td align="center">' + element.descuentos.toString() + '</td>';
                                                lineas += '<td align="center">' + element.subtotal.toLocaleString() + '</td>';
                                                lineas += '</tr>';
                                                monto += element.subtotal;
                                                if (++i == data.recordset.length) {
                                                    if (NoB == 'N') {
                                                        neto = monto;
                                                        iva = Math.round(monto * 0.19);
                                                        bruto = neto + iva;
                                                    } else {
                                                        bruto = monto;
                                                        neto = Math.round(monto / (1 + 19));
                                                        iva = bruto - neto;
                                                    }
                                                    lineas += '<tr>';
                                                    lineas += '<td colspan="5" align="right"><strong>TOTAL NETO :</strong></td>';
                                                    lineas += '<td align="center">' + neto.toLocaleString() + '</td>';
                                                    lineas += '</tr>';
                                                    lineas += '<tr>';
                                                    lineas += '<td colspan="5" align="right"><strong>IVA :</strong></td>';
                                                    lineas += '<td align="center">' + iva.toLocaleString() + '</td>';
                                                    lineas += '</tr>';
                                                    lineas += '<tr>';
                                                    lineas += '<td colspan="5" align="right"><strong>TOTAL BRUTO :</strong></td>';
                                                    lineas += '<td align="center">' + bruto.toLocaleString() + '</td>';
                                                    lineas += '</tr>';
                                                    //            
                                                }
                                            });
                                            htmlBody = _correos.primeraParte(xObs, rs.recordset[0].numero, xOcc, xDatosVendedor, xDatosCliente) + lineas + _correos.segundaParte();
                                            mailList.push({ cc: xDatosVendedor.correo, to: xDatosCliente.correo });
                                            _correos.enviarCorreo(res, nodemailer, mailList, htmlBody);
                                        });
                                    callback();
                                })
                                .catch(function(er) {
                                    console.log('error al grabar', er);
                                    error = er;
                                    //res.send(er); 
                                    callback();
                                });
                        })
                        .catch(function(er) {
                            console.log(er);
                            error = er;
                            //res.send('error en conexion POST ->'+er); 
                            callback();
                        });
                } else {
                    callback();
                }
            },
            function(callback) {
                if (error == undefined) {
                    console.log("fin y devolviendo");
                    if (nrosin == undefined) {
                        res.json({ resultado: 'ok', numero: nrocon });
                        callback();
                    } else if (nrocon == undefined) {
                        res.json({ resultado: 'ok', numero: nrosin });
                        callback();
                    } else {
                        res.json({ resultado: 'ok', numero: nrocon + ' y ' + nrosin });
                        callback();
                    }
                } else {
                    console.log("error e informando", error);
                    res.send('error en grabacion: ' + error);
                    callback();
                }
            }
        ]);
    });

app.post('/proalma',
    function(req, res) {
        //
        // console.log(req.body);;
        // la tabla a leer
        var xsp = req.body.sp || '';
        var xdatos = req.body.datos || {};
        var xusuario = req.body.user || [];
        var listap = '';
        var query = '';
        var solorec = false;
        //
        var fechaHoy = new Date();
        console.log(fechaHoy);
        console.log(xusuario.codigo, xusuario.nombre, 'xsp -->>', xsp);
        //
        if (xsp == 'ksp_buscarClientes') {
            //
            if (xdatos.codcliente == undefined) { xdatos.codcliente = ''; } else { xdatos.codcliente = xdatos.codcliente.trim(); }
            if (xdatos.razonsocial == undefined) { xdatos.razonsocial = ''; } else { xdatos.razonsocial = xdatos.razonsocial.trim(); }
            if (xdatos.inilista == undefined) { xdatos.inilista = ''; } else { xdatos.inilista = xdatos.inilista.trim(); }
            if (xdatos.finlista == undefined) { xdatos.finlista = ''; } else { xdatos.finlista = xdatos.finlista.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codcliente + "','" + xdatos.razonsocial + "','" + xusuario.codigo + "','" + xdatos.inilista + "','" + xdatos.finlista + "', 'b' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codcliente, xdatos.razonsocial);
            solorec = true;
            //
        } else if (xsp == 'ksp_buscarProductos_v2_caltex') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.descripcion == undefined) { xdatos.descripcion = ''; } else { xdatos.descripcion = xdatos.descripcion.trim(); }
            // datos de seleccion
            if (xdatos.superfamilias == undefined) xdatos.superfamilias = '';
            if (xdatos.familias == undefined) xdatos.familias = '';
            if (xdatos.rubros == undefined) xdatos.rubros = '';
            if (xdatos.marcas == undefined) xdatos.marcas = '';
            // datos de configuracion
            if (xdatos.filtros.soloconstock == undefined) { xdatos.soloconstock = 'false'; } else { xdatos.soloconstock = xdatos.filtros.soloconstock; }
            if (xdatos.filtros.soloconprecio == undefined) { xdatos.soloconprecio = 'false'; } else { xdatos.soloconprecio = xdatos.filtros.soloconprecio; }
            if (xdatos.filtros.soloconocc == undefined) { xdatos.soloconocc = 'false'; } else { xdatos.soloconocc = xdatos.filtros.soloconocc; }
            // ordenar por ...
            if (xdatos.ordenar == undefined) { xdatos.ordenar = ''; } else { xdatos.ordenar = xdatos.ordenar.trim(); }
            // lista de precios a trabajar
            if (xdatos.usuario.LISTACLIENTE != '' && xdatos.usuario.LISTACLIENTE != xdatos.usuario.LISTAMODALIDAD) {
                listap = xdatos.usuario.LISTACLIENTE;
            } else {
                listap = xdatos.usuario.LISTAMODALIDAD;
            }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.descripcion + "','";
            query += xdatos.bodega + "','" + listap + "','";
            query += xdatos.superfamilias + "','" + xdatos.familias + "','" + xdatos.rubros + "','" + xdatos.marcas + "','";
            query += xdatos.ordenar + "'," + xdatos.offset + ",";
            query += xdatos.soloconstock + "," + xdatos.soloconprecio + "," + xdatos.soloconocc + ",'";
            query += xusuario.empresa + "','" + xusuario.codigo + "','" + xdatos.cliente + "' ;";
            //
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codproducto, xdatos.descripcion, xdatos.bodega);
            solorec = true;
            //

        } else if (xsp == 'ksp_buscarUsuario') {
            //
            if (xdatos.rutocorreo == undefined) { xdatos.rutocorreo = ''; } else { xdatos.rutocorreo = xdatos.rutocorreo.trim(); }
            if (xdatos.clave == undefined) { xdatos.clave = ''; } else { xdatos.clave = xdatos.clave.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.rutocorreo + "','" + xdatos.clave + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xdatos.uuid, xdatos.sistema, xdatos.rutocorreo, xdatos.clave, xdatos.empresa);
            //
        } else if (xsp == 'ksp_traeInfoProductos') {
            //
            if (xdatos.codigo == undefined) { xdatos.codigo = ''; } else { xdatos.codigo = xdatos.codigo.trim(); }
            if (xdatos.cliente == undefined) { xdatos.cliente = ''; } else { xdatos.cliente = xdatos.cliente.trim(); }
            if (xdatos.sucursal == undefined) { xdatos.sucursal = ''; } else { xdatos.sucursal = xdatos.sucursal.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            if (xdatos.tipocon == undefined) { xdatos.tipocon = ''; } else { xdatos.tipocon = xdatos.tipocon.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codigo + "','" + xdatos.tipocon + "','" + xdatos.cliente + "','" + xdatos.sucursal + "','" + xusuario.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codigo, xdatos.tipocon, xdatos.cliente);
            //
        } else if (xsp == 'ksp_BodegaProducto' || xsp == 'ksp_ListasProducto') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.usuario == undefined) { xdatos.usuario.KOFU = ''; } else { xdatos.usuario.KOFU = xdatos.usuario.KOFU.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.usuario.KOFU + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codproducto, xdatos.usuario.KOFU, xdatos.empresa);
            //
        } else if (xsp == 'ksp_traeImpagos') {
            //
            if (xdatos.codigo == undefined) { xdatos.codigo = ''; } else { xdatos.codigo = xdatos.codigo.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.codigo, xdatos.empresa);
            //
        } else if (xsp == 'ksp_traeDocumento') {
            //
            query = "exec " + xsp + " " + xdatos.id.toString() + " ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.id.toString());

            //
        } else if (xsp == 'ksp_BodegaMias') {
            //
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            if (xusuario.codigo == undefined) { xusuario.codigo = ''; } else { xusuario.codigo = xusuario.codigo.trim(); }
            //
            query = "exec " + xsp + " '" + xusuario.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            // 
        } else if (xsp == 'ksp_ListasMias') {
            //
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            if (xusuario.codigo == undefined) { xusuario.codigo = ''; } else { xusuario.codigo = xusuario.codigo.trim(); }
            //
            query = "exec " + xsp + " '" + xusuario.codigo + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            //
        } else if (xsp == 'ksp_EnImportaciones') {
            //
            if (xdatos.codproducto == undefined) { xdatos.codproducto = ''; } else { xdatos.codproducto = xdatos.codproducto.trim(); }
            if (xdatos.empresa == undefined) { xdatos.empresa = ''; } else { xdatos.empresa = xdatos.empresa.trim(); }
            //
            query = "exec " + xsp + " '" + xdatos.codproducto + "','" + xdatos.empresa + "' ;";
            _Activity.registra(sql, xusuario.codigo, xsp, xdatos.empresa);
            //
        }

        conex
            .then(function() {
                //
                console.log(query);
                var request = new sql.Request();
                // 
                request.query(query)
                    .then(function(rs) {
                        if (solorec) { res.json(rs.recordset); } else { res.json(rs); }
                    })
                    .catch(function(er) { res.send(er); });
            })
            .catch(function(er) {
                console.log(er);
                res.send('error en conexion POST ->' + er);
            });

    });

enviarCorreo = function(res, mailList, filename) {
    //
    xhoy = new Date();
    anno = xhoy.getFullYear().toString();
    mes = (xhoy.getMonth() + 1).toString();
    dia = xhoy.getDate().toString();
    hora = xhoy.getHours().toString();
    minu = xhoy.getMinutes().toString();
    //
    sender = 'jogv66@gmail.com';
    psswrd = 'belenmurielamelia';
    //
    cTo = mailList.emailTo;
    cCc = mailList.emailCc;
    cSu = 'Planillas de Stock al ' + dia + '-' + mes + '-' + anno;
    // si no tiene correo se envia al vendedor
    if (cTo === '' || cTo == undefined) {
        cTo = cCc;
    }
    // datos del enviador
    var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: sender, pass: psswrd } });
    // var transporter = nodemailer.createTransport({
    //     pool: true,
    //     host: "mail.grupocaltex.cl",
    //     port: 465,
    //     secure: true, // use TLS
    //     auth: {
    //         user: sender,
    //         pass: psswrd
    //     }
    // });
    // opciones del correo
    var mailOptions = {
        from: { name: "Empresas Chelech", address: sender },
        to: cTo,
        cc: cCc,
        subject: cSu,
        // text:       "Adjunto Planilla de Stock al "+dia+"-"+mes+"-"+anno, // plain text body
        html: 'Adjunto Planilla de Stock al <b>' + dia + '-' + mes + '-' + anno + ' - ' + hora + ':' + minu + ' horas</b><br>Comentarios: ' + mailList.nombreCli,
        attachments: [{
            filename: 'stock_al_' + anno + mes + dia + '_' + hora + '_' + minu + '.xlsx',
            path: filename,
            content: 'application/octet-stream'
        }]
    };
    console.log(filename);

    // enviar el correo
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('error en sendmail->', error);
            res.json({ resultado: 'error', mensaje: error.message });
        } else {
            console.log("Email enviado a -> ", cTo, "Adjuntos : ", filename);
            res.json({ resultado: 'ok' });
            eliminar(filename);
        }
    });
};
eliminar = function(filename) {
    console.log('eliminando: ', filename);
    fs.unlink(filename, function(err) {
        if (err) throw err;
        console.log('File deleted!', filename);
    });
};