import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
) => {
  const result = await transporter.sendMail({
    from: `"KekeGo" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text: message,
  });

  return result;
};

export default transporter;