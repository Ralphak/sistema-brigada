var formNovaSenha = document.getElementById("formNovaSenha"),
    formNovoEmail = document.getElementById("formNovoEmail");

formNovaSenha.addEventListener("submit", e=>{
    e.preventDefault();
    if(e.target[1].value != e.target[2].value){
        formNovaSenha.querySelector(".alert-danger").innerHTML = "Os campos de nova senha estão diferentes!";
        return;
    }
    let botao = formNovaSenha.querySelector(".btn"),
        msgErro = formNovaSenha.querySelector(".alert-danger");
    botao.setAttribute("disabled","");
    usuario.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(usuario.email, e.target[0].value)).then(()=>{
        usuario.updatePassword(e.target[1].value).then(()=>{
            paginaSucesso("Senha alterada com sucesso!", "alterar_dados");
        }).catch(function(erro) {
            msgErro.innerHTML = erro.message;
            botao.removeAttribute("disabled");
        });
    }).catch(erro=>{
        msgErro.innerHTML = erro.message;
        botao.removeAttribute("disabled");
    });
});

formNovoEmail.addEventListener("submit", e=>{
    e.preventDefault();
    let botao = formNovoEmail.querySelector(".btn"),
        msgErro = formNovoEmail.querySelector(".alert-danger");
    botao.setAttribute("disabled","");
    usuario.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(usuario.email, e.target[1].value)).then(()=>{
        usuario.updateEmail(e.target[0].value).then(()=>{
            if(usuario.dados.categoria == "aluno"){
                db.collection("usuarios").doc(usuario.uid).update({email: usuario.email});
                usuario.dados.email = usuario.email;
            }
            paginaSucesso("Email alterado com sucesso!", "alterar_dados");
        }).catch(function(erro) {
            msgErro.innerHTML = erro.message;
            botao.removeAttribute("disabled");
        });
    }).catch(erro=>{
        msgErro.innerHTML = erro.message;
        botao.removeAttribute("disabled");
    });
});