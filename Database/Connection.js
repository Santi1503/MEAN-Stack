const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mean-stack")
        console.log('Base de datos conectada');
    } catch (error) {
        console.log(error);

        throw new Error('Error al iniciar la base de datos');
    }
}

module.exports = connectDB;