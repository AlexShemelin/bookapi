"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function sendEmail(author, text, subject) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // from .env
            pass: process.env.EMAIL_PASS, // from .env
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: author,
        subject,
        text: text,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email: " + error);
    }
}
exports.sendEmail = sendEmail;
