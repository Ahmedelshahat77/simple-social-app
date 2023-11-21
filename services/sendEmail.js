import nodemailer from "nodemailer";
export const sendEmail = async ({ to = "", message = "", subject = "" }) => {
  let transporter = nodemailer.createTransport({
    host: "she7ta.me", // stmp.gmail.com
    port: 465, //465
    secure: true, // true for 465, false for other ports
    service: "namecheap",
    auth: {
      user: "test@she7ta.me", // generated ethereal user
      pass: "test@2025", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let info = await transporter.sendMail({
    from: "test@she7ta.me", // sender address
    to: `${to},mrheta77@gmail.com`, // list of receivers
    // cc: ["pfu11108@yuoia.com"],

    subject, // Subject line
    html: message, // html body
  });
  if (info.accepted.length) {
    return true;
  }
  return false;
};
