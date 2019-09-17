const auth = firebase.auth(),
    formLogin = document.getElementById("formLogin"),
    formReset = document.getElementById("formReset"),
    botao = formLogin.querySelector(".btn");

//redireciona usuários já logados
auth.onAuthStateChanged(user=>{
    if(user){
        location.href = "index.html";
    }
});

//autentica o usuário ao enviar os dados
formLogin.addEventListener("submit", e=>{
    e.preventDefault();
    botao.setAttribute("disabled","");
    auth.signInWithEmailAndPassword(e.target[0].value, e.target[1].value).then(()=>{
        location.href = "index.html";
    }).catch(erro=>{
        botao.removeAttribute("disabled");
        let msgErro = formLogin.querySelector(".alert-danger");
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

//comportamento dos links "Esqueci minha senha" e "Voltar"
document.getElementById("linkResetPwd").addEventListener("click", e=>{
    e.preventDefault();
    formLogin.setAttribute("hidden","");
    formReset.removeAttribute("hidden");
});
document.getElementById("linkBackLogin").addEventListener("click", e=>{
    e.preventDefault();
    formReset.setAttribute("hidden","");
    formLogin.removeAttribute("hidden");
});

//envia um link de redefinição de senha ao email digitado
formReset.addEventListener("submit", e=>{
    e.preventDefault();
    auth.sendPasswordResetEmail(e.target[0].value);
    formReset.querySelector(".alert-success").innerHTML = "Um link de redefinição de senha será enviado ao seu email, caso ele seja cadastrado.";
});
