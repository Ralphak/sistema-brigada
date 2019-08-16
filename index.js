var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    port = process.env.PORT || 2357;

//Inicializações
app.use(express.static(__dirname + "/public"));
app.use(require("body-parser").urlencoded({extended:false}));

//Conectar ao banco de dados
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/sistadv", { useNewUrlParser: true });
console.log(mongoose);

//Inicia o servidor
app.listen(port, ()=>{
    console.log(`Servidor iniciado na porta ${port}`);
})