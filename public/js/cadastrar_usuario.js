validarCategoria("admin");

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
        db.collection("usuarios").doc(credential.user.uid).set({
            nome: e.target[0].value,
            categoria: e.target.querySelector('input[name="categoria"]:checked').value
        });
        storageRef.child(`fotos/${credential.user.uid}.${e.target[6].files[0].name.split(".").pop()}`).put(e.target[6].files[0]);
        paginaSucesso("Usuário cadastrado com sucesso!", "cadastrar_usuario");
    }).catch(erro=>{
        msgErro.innerHTML = erro.message;
        botao.removeAttribute("disabled");
    });
});