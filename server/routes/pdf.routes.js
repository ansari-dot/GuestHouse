 // routes/pdf.routes.js
 import express from "express";
 import path from "path";

 const router = express.Router();

 router.get("/download/:filename", (req, res) => {
     const file = path.resolve("pdfs", req.params.filename);
     res.download(file, (err) => {
         if (err) {
             res.status(500).send("Failed to download file");
         }
     });
 });

 export default router;