const { request, response } = require('express')
const nodeMailer = require('nodemailer')


const envioCorreo = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'guilledev98@gmail.com',
            pass:'tfzo ujld qedw rukq'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labovedarestaurante.com>',
        subject: 'Reserva Restaurante La Bóveda',
        to: body.email,
        html: `
            <p>Estimado/a ${body.nombre} ${body.apellido},</p>
            <p>Gracias por elegir Restaurante La Bóveda para su próxima comida o cena.</p>
            <p>Su reserva está confirmada para el día ${body.fecha} a las ${body.hora}, para ${body.comensales} personas.</p>
            <p>Esperamos que disfrute de su experiencia con nosotros y quedamos a su disposición para cualquier consulta adicional.</p>
            <div class="footer">
                <p>Saludos cordiales,</p>
                <p>El equipo de Restaurante La Bóveda</p>
            </div>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}

const envioCorreoReservas = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'guilledev98@gmail.com',
            pass:'tfzo ujld qedw rukq'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labovedarestaurante.com>',
        subject: 'Reserva Restaurante La Bóveda',
        to: 'guilledev98@gmail.com',
        html: `
            <p>RESERVA:,</p>
            <p>Reserva realizada por ${body.nombre} ${body.apellido}.</p>
            <p>Su reserva esta programada para el día ${body.fecha} a las ${body.hora}, para ${body.comensales} personas.</p>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}


const envioCorreoAutomático = (req=request,resp=response) =>{
    let body = req.body

    let config = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:'guilledev98@gmail.com',
            pass:'tfzo ujld qedw rukq'
        }
    })

    const opciones = {
        from: '"LaBóveda" <reservas@labovedarestaurante.com>',
        subject: 'Reserva Restaurante La Bóveda',
        to:body.email,
        html: `
            <p>Estimado/a ${body.nombre} ${body.apellido},</p>
            <p>Solo queda un día para su reserva en nuestro restaurante</p>
            <p>Recuerde que su reserva es a las ${body.hora} para ${body.comensales} personas</p>
            <p>Si hay algún inconveniente, no dude en ponerse en contactacto con nosotros</p>
            <p>Saludos cordiales,</p>
            <p>La Bóveda</p>
        `
    };


    config.sendMail(opciones,function(error,result){
        if (error) return resp.json({ok:false,msg:error})
        return resp.json({
            ok:true,
            msg:result
        })
    })
}

const envioCorreoContacto = (req = request, resp = response) => {
    let body = req.body;

    let config = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'guilledev98@gmail.com',
            pass: 'tfzo ujld qedw rukq'
        }
    });

    const opciones = {
        from: '"LaBóveda" <reservas@labovedarestaurante.com>',
        subject: 'Contacto Restaurante La Bóveda',
        to: "guilledev98@gmail.com",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #444;">Contacto Restaurante La Bóveda</h2>
                <p style="font-size: 16px;">Pregunta de <strong>${body.nombre} ${body.apellido}</strong> con teléfono <strong>${body.tel}</strong>.</p>
                <p style="font-size: 14px; color: #555;">${body.contenido}</p>
                <p style="font-size: 14px; color: #777;">La Bóveda</p>
            </div>
        `
    };

    config.sendMail(opciones, function (error, result) {
        if (error) return resp.json({ ok: false, msg: error });
        return resp.json({
            ok: true,
            msg: result
        });
    });
}


const envioContactoCliente = (req = request, resp = response) => {
    let body = req.body;

    let config = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'guilledev98@gmail.com',
            pass: 'tfzo ujld qedw rukq'
        }
    });

    const opciones = {
        from: '"LaBóveda" <reservas@labovedarestaurante.com>',
        subject: 'Contacto Restaurante La Bóveda',
        to: body.gmail,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2 style="color: #444;">Gracias por ponerse en contacto con nosotros</h2>
                <p style="font-size: 16px; color: #555;">
                    Enseguida nos pondremos en contacto con usted.
                </p>
                <p style="font-size: 16px; color: #555;">
                    Saludos cordiales,
                </p>
                <p style="font-size: 16px; color: #777;">
                    La Bóveda
                </p>
            </div>
        `
    };

    config.sendMail(opciones, function (error, result) {
        if (error) return resp.json({ ok: false, msg: error });
        return resp.json({
            ok: true,
            msg: result
        });
    });
};

module.exports = {
    envioCorreo,
    envioCorreoAutomático,
    envioCorreoContacto,
    envioContactoCliente,
    envioCorreoReservas
}