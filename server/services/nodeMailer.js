 import dotenv from "dotenv";
 dotenv.config();

 import nodemailer from "nodemailer";
 import { generateBookingPDF } from "./pdfService.js";

 export const sendBookingConfirmation = async(toEmail, userName, bookingDetails) => {
     try {
         const filename = `booking-${Date.now()}.pdf`;
         const filePath = await generateBookingPDF({...bookingDetails, name: userName, email: toEmail },
             filename
         );

         const downloadLink = `http://localhost:3000/pdf/download/${filename}`;

         const transporter = nodemailer.createTransport({
             service: "gmail",
             auth: {
                 user: process.env.EMAIL,
                 pass: process.env.EMAIL_PASS,
             },
         });

         // Optional debug check
         await transporter.verify();
         console.log("✅ Gmail transporter is ready");

         const mailOptions = {
             from: `"Sardar Guest House" <${process.env.EMAIL}>`,
             to: toEmail,
             subject: "Your Booking Confirmation",
             html: `
        <p>Hello ${userName},</p>
        <p>Thank you for booking with Sardar Guest House!</p>
        <p>You can download your booking confirmation here:</p>
        <a href="${downloadLink}" target="_blank">Download Your Ticket (PDF)</a>
        <br/><br/>
        <p>We look forward to hosting you!</p>
      `,
         };

         await transporter.sendMail(mailOptions);
         console.log("✅ Email sent to:", toEmail);
     } catch (error) {
         console.error("❌ Email send error:", error);
     }
 };

 export const sendOTP = async(toEmail, userName, otpCode) => {
     try {
         const transporter = nodemailer.createTransport({
             service: "gmail",
             auth: {
                 user: process.env.EMAIL,
                 pass: process.env.EMAIL_PASS,
             },
         });

         await transporter.verify();
         console.log("✅ Gmail transporter is ready for OTP");

         const mailOptions = {
             from: `"Sardar Guest House" <${process.env.EMAIL}>`,
             to: toEmail,
             subject: "Your OTP Code",
             html: `
                <p>Hello ${userName},</p>
                <p>Your One-Time Password (OTP) is:</p>
                <h2>${otpCode}</h2>
                <p>Please enter this code to continue. It will expire in 5 minutes.</p>
                <br/>
                <p>Thank you for using Sardar Guest House!</p>
            `,
         };

         await transporter.sendMail(mailOptions);
         console.log("✅ OTP email sent to:", toEmail);
     } catch (error) {
         console.error("❌ OTP email send error:", error);
     }
 };