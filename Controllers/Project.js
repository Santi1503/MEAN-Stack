const Project = require('../Models/Project');
const fs = require('fs');
const path = require('path');

const save = (req, res) => {
    let body = req.body;

    if (!body.name || !body.description || !body.state) {
        return res.status(400).send({
            status: "error",
            message: 'Faltan datos por enviar'
        });
    }

    let projectToSave = new Project(body);

    projectToSave.save().then(project => {
        if (!project) {
            return res.status(404).send({
                status: "error",
                message: 'Error al guardar el proyecto'
            });
        }
        
        return res.status(200).send({
            status: "success",
            message: 'Proyecto creado correctamente',
            project
        });
    }).catch(error => {
        return res.status(500).send({
            status: "error",
            message: 'Error al guardar el proyecto',
            error
        });
    })
}

const listProjects = (req, res) => {
    Project.find().then(projects => {
        if (!projects) {
            return res.status(404).send({
                status: "error",
                message: 'No hay proyectos'
            });
        }

        return res.status(200).send({
            status: "success",
            projects
        });

    }).catch(error => {
        return res.status(500).send({
            status: "error",
            message: 'Error al obtener los proyectos',
            error
        });
    })
}

const item = (req, res) => {
    let projectId = req.params.id;

    Project.findById(projectId).then(project => {
        if (!project) {
            return res.status(404).send({
                status: "error",
                message: 'No existe el proyecto'
            });
        }
        return res.status(200).send({
            status: "success",
            project
        });
    }).catch(error => {
        return res.status(500).send({
            status: "error",
            message: 'Error al obtener el proyecto',
            error
        });
    })
}

const deleteProject = (req, res) => {
    let projectId = req.params.id;

    Project.findByIdAndDelete(projectId).then(project => {
        if (!project) {
            return res.status(404).send({
                status: "error",
                message: 'No existe el proyecto'
            });
        }
        return res.status(200).send({
            status: "success",
            message: 'Proyecto eliminado correctamente',
        });
    }).catch(error => {
        return res.status(500).send({
            status: "error",
            message: 'Error al eliminar el proyecto',
            error
        });
    })
}

const updateProject = (req, res) => {
    let body = req.body;

    if (!body || !body.id) {
        return res.status(404).send({
            status: "error",
            message: 'No hay datos para actualizar'
        });
    }

    Project.findByIdAndUpdate(body.id, body, {new: true}).then(projectUpdate => {
        if (!projectUpdate) {
            return res.status(404).send({
                status: "error",
                message: 'No existe el proyecto'
            });
        }

        return res.status(200).send({
            status: "success",
            message: 'Proyecto actualizado correctamente',
            projectUpdate
        });
    }).catch(error => {
        return res.status(500).send({
            status: "error",
            message: 'Error al actualizar el proyecto',
            error
        });
    })
}

const uploadImage = (req, res) => {
    let id = req.params.id;

    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: 'No se ha subido ninguna imagen'
        });
    }

    const filePath = req.file.path;
    const extension = path.extname(req.file.originalname).toLocaleLowerCase().replace(".", "")

    const validExtensions = ["jpg", "jpeg", "png", "gif"];
    if (!validExtensions.includes(extension)) {
        fs.unlinkSync(filePath)
        return res.status(404).send({
            status: "error",
            message: 'Extensión no válida'
        });
    }

    Project.findByIdAndUpdate({_id: id}, {image: req.file.filename}, {new: false}).then(projectUpdate => {
        if (!projectUpdate) {
            fs.unlinkSync(filePath)

            return res.status(404).send({
                status: "error",
                message: 'No existe el proyecto'
            });
        }

        if (projectUpdate.image && projectUpdate.image != "default.png") {
            const oldImagePath = "./uploads/projects/" + projectUpdate.image;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        return res.status(200).send({
            status: "success",
            message: 'Proyecto actualizado correctamente',
            projectUpdate,
            newFile: req.file.filename
        });
    }).catch(error => {
        fs.unlinkSync(filePath)

        return res.status(500).send({
            status: "error",
            message: 'Error al actualizar el proyecto',
            error
        });
    })
}

const getImage = (req, res) => {
    let file = req.params.file;
    let pathFile = "./uploads/projects/" + file;

    fs.stat(pathFile, (error, exist) => {
        if (!error && exist) {
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).send({
                status: "error",
                message: 'No existe la imagen'
            })
        }
    })
}

module.exports = {
    save,
    listProjects,
    item,
    deleteProject,
    updateProject,
    uploadImage,
    getImage
}