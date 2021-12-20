const nodemailer=require("nodemailer")
const SMTP_CONFIG= require("./smtp")

const transporter=nodemailer.createTransport({
    host:SMTP_CONFIG.host,
    port:SMTP_CONFIG.port,
    secure:false,
    auth:{
        user:SMTP_CONFIG.user,
        pass:SMTP_CONFIG.pass
    },
    tls:{
        rejectUnauthorized:false,
    },   
})

async function sendEmail(){
    const mailSend=await transporter.sendMail({
        attachments: [{
            filename: 'file.pdf',
            path: 'report.pdf',
            contentType: 'application/pdf'
        }],
        text:"Relatório FACEFACS",
        subject:"Assunto do e-mail",
        from:"Anderson Silva Teste",
        to:["silvaandersonpirenda@gmail.com","silvaandersonpirenda@gmail.com"],

    })
        

}

module.exports={sendEmail}