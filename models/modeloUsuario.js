var mongoose = require("mongoose");
exports = mongoose.model("Usuario", new mongoose.Schema({
    nome: String,
    data: Date,
    codigo: Number
}));