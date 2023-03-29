const express = require('express');
const multer = require('multer');
const ffmpeg = require("fluent-ffmpeg");
const {exec} = require('child_process');
const fs = require('fs');
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
      },
      filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        let originalname = file.originalname;
        originalname = (originalname.split(".")[0]).replace(/ /g, "-");
        cb(null, `files/${originalname}-${Date.now()}.${ext}`);
      },
})
const upload = multer({
    storage:storage
});
app.post("/upload-convert", upload.single("video"), (req, res) => {
    console.log(req.file);
    const filePath = req.file.path;
    const startTime = Date.now();
    let fileName = req.file.filename;
    fileName = fileName.split("/").pop().split(".")[0];
    // convert the file into gif

    ffmpeg(filePath)
    .outputOption("-vf", "scale=1280:-1:flags=lanczos,fps=20")
    .save(`public/files/${Date.now()}-aka.gif`);

    /*exec(`ffmpeg -i ${filePath} -qscale 0 public/files/${fileName}.gif`, (err, stdout, stderr) => {
        if(err) {
            console.log(err);
            res.send(err);
            return;
        }
        console.log(req.file.filename);
        fs.unlink('public/' + req.file.filename, (err) => {
            if(err) console.log(err);
        });
        console.log(Date.now() - startTime);
    });*/
    res.send("Works");
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(8585, () => {
    console.log("Listening on 8585");
})
