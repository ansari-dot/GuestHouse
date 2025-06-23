 import nodemailer from 'nodemailer';
 import path from 'path';
 import fs from 'fs'; // ✅ THIS WAS MISSING
 import PDFDocument from 'pdfkit';

 export const generateBookingPDF = (bookingData, fileName = "booking.pdf") => {
     return new Promise((resolve, reject) => {
         const doc = new PDFDocument();
         const filePath = path.join("pdfs", fileName);

         // Ensure folder exists
         if (!fs.existsSync("pdfs")) {
             fs.mkdirSync("pdfs");
         }

         const writeStream = fs.createWriteStream(filePath);
         doc.pipe(writeStream);

         // Booking content
         doc.fontSize(18).text("Sardar Guest House", { align: "center" });
         doc.moveDown();
         doc.fontSize(14).text(`Booking Confirmation for ${bookingData.name}`);
         doc.text(`Room: ${bookingData.room}`);
         doc.text(`Check-in: ${bookingData.checkin}`);
         doc.text(`Check-out: ${bookingData.checkout}`);
         doc.text(`Guests: ${bookingData.guests}`);
         doc.text(`Email: ${bookingData.email}`);
         doc.end();

         writeStream.on("finish", () => {
             resolve(filePath); // Send path back
         });

         writeStream.on("error", reject);
     });
 };