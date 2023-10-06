const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
   // 1) Create a transporter
   const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    // auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    // }
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    logger: true,
    
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  // 2) Define the email option
//   console.log(options.email,options.subject,options.message)
  const mailOptions = {
    from: 'Biswarup Jana <biswaruprx21@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
