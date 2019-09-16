const auth = firebase.auth();

//redireciona usuários já logados
auth.onAuthStateChanged(user=>{
    if(user){
        location.href = "index.html";
    }
});

//autentica ao enviar o formulário
document.getElementById("formLogin").addEventListener("submit", e=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(e.target[0].value, e.target[1].value).then(sucesso=>{
        console.log(sucesso);
        location.href = "index.html";
    }).catch(erro=>{
        console.log(erro);
        let msgErro = document.getElementById("loginErro");
        switch(erro.code){
            case "auth/user-not-found":
            case "auth/wrong-password":
                msgErro.innerHTML = "Usuário ou senha inválidos.";
                break;
            default:
                msgErro.innerHTML = erro.message;
                break;
        }
    });
});