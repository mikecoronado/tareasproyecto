const nodemailer =  require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');



async function main() {
 
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
 
    let transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: emailConfig.user, // generated ethereal user
            pass: emailConfig.pass // generated ethereal password
        }
    });
 


    const generarHTML = (archivo, opciones = {}) =>{
        const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
        return juice(html);
    }


    exports.enviar = async(opciones) => {
    
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);         // send mail with defined transport object
    let opcionesEmail = await transporter.sendMail({
        from: '"Up Task" <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
    });

        const enviarEmail = util.promisify(transporter.sendMail, transporter);
        return enviarEmail.call(transporter, opcionesEmail)
    }
   
 
}
 
main().catch(console.error);


























