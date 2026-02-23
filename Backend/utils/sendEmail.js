const nodemailer = require("nodemailer");
const { catchAsyncError } = require("./catchAsyncError");

exports.sendEmail = catchAsyncError(
    async({to, subject, html})=>{
    //create a transporter 
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        secure: false,
        auth:{
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from : `"From LMS Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    }

    await transporter.sendMail(mailOptions);
}
)