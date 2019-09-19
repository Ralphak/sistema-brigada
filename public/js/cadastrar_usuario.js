validarCategoria("admin");

//Para evitar que o firebase troque de conta, é criada uma nova instância do app, onde será feita o registro do novo usuário.
var auth2;
if(firebase.apps[1]){
    auth2 = firebase.apps[1].auth();
} else{
    auth2 = firebase.initializeApp({
        "projectId": "sistadv-realengo",
        "appId": "1:923395850717:web:ff27284df23d220cae3634",
        "databaseURL": "https://sistadv-realengo.firebaseio.com",
        "storageBucket": "sistadv-realengo.appspot.com",
        "locationId": "us-central",
        "apiKey": "AIzaSyA2K1X9rF5MgIBxUrMhKoqr1XJRBUi4oIs",
        "authDomain": "sistadv-realengo.firebaseapp.com",
        "messagingSenderId": "923395850717"
    }, 'appCadastro').auth();
}

//Exibe ou esconde os campos para alunos
var divCamposAluno = document.getElementById("camposAluno"),
    camposAluno = divCamposAluno.innerHTML;
divCamposAluno.innerHTML = "";
divCamposAluno.removeAttribute("hidden");
document.getElementsByName("categoria").forEach(radio=>{
    radio.addEventListener("click", e=>{
        if(e.target.value=="aluno") divCamposAluno.innerHTML = camposAluno;
        else divCamposAluno.innerHTML = "";
    });
});

//Envio do cadastro
document.getElementById("formCadastroUsuario").addEventListener("submit", e=>{
    e.preventDefault();
    let botao = e.target.querySelector(".btn"),
        msgErro = e.target.querySelector(".alert-danger");
    if(e.target[2].value != e.target[3].value){
        msgErro.innerHTML = "Os campos de nova senha estão diferentes!";
        return;
    }
    botao.setAttribute("disabled","");
    auth2.createUserWithEmailAndPassword(e.target[1].value, e.target[2].value).then(credential=>{
        let objCadastro = {
            nome: e.target[0].value,
            categoria: e.target.querySelector('input[name="categoria"]:checked').value
        };
        if(e.target[4].checked){
            objCadastro = Object.assign(objCadastro, {
                data_nascimento: moment(e.target[6].value).format("DD/MM/Y"),
                rg: e.target[7].value,
                cpf: e.target[8].value,
                tipo_sanguineo: e.target[9].value,
                formacao: e.target[10].value,
                validade: moment().add(1, 'y').format("DD/MM/Y")
            });
            storageRef.child(`fotos/${credential.user.uid}.${e.target[11].files[0].name.split(".").pop()}`).put(e.target[11].files[0]);
        }
        db.collection("usuarios").doc(credential.user.uid).set(objCadastro);
        paginaSucesso("Usuário cadastrado com sucesso!", "cadastrar_usuario");
    }).catch(erro=>{
        msgErro.innerHTML = erro.message;
        botao.removeAttribute("disabled");
    });
});