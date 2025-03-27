const express = require('express');
const router = express.Router();

const ProjectController = require('../Controllers/Project');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/projects/');
    },
    filename: (req, file, cb) => {
        cb(null, "project-" + Date.now() + "-" +file.originalname);
    }
});

const uploads = multer({storage});

router.post("/save", ProjectController.save);
router.get("/projects", ProjectController.listProjects);
router.get("/item/:id", ProjectController.item);
router.delete("/delete/:id", ProjectController.deleteProject);
router.put("/update", ProjectController.updateProject);
router.put("/upload/:id", [uploads.single('image')], ProjectController.uploadImage);
router.get("/image/:file", ProjectController.getImage);


module.exports = router;