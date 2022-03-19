const nodemailer=require("nodemailer")
const sendgridTransport=require("nodemailer-sendgrid-transport")

const transporter=nodemailer.createTransport(
    // {

      sendgridTransport({
        auth:{
                api_key:process.env.API_KEY_SENDGRID                
            }

      })
)

async function sendEmail(){
    const mailSend=await transporter.sendMail({
        attachments: [{
            filename: 'file.pdf',
            path: 'report.pdf',
            contentType: 'application/pdf'
        }],
        text:"Relatório FACEFACS",
        subject:"Assunto do e-mail",
        from:process.env.emailfrom,
        to:process.env.emailto,

    })  

}

module.exports={sendEmail}