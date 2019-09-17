const auth = firebase.auth(),
    db = firebase.firestore();
var usuario;

//verifica se está autenticado antes de exibir a página
document.body.setAttribute("hidden","");
auth.onAuthStateChanged(user=>{
    let menuUsuario = document.querySelector(".dropdown-toggle");
    if (user) {
        usuario = user;
        db.collection("usuarios").doc(user.uid).get().then(doc=>{
            usuario.dados = doc.data();
            menuUsuario.innerHTML = usuario.dados.nome.split(" ")[0];
            //logout
            document.getElementById("linkLogout").addEventListener("click", e=>{
                e.preventDefault();
                auth.signOut();
            });
            $("#divPagina").load("subpages/pagina-inicial.html");
            document.body.removeAttribute("hidden");
        });
    } else{
        usuario = undefined;
        location.href = "login.html";
    }
});

//carrega subpáginas dentro do index
document.body.addEventListener("click", e=>{
    let subpagina = e.target.getAttribute("subpage");
    if(subpagina){
        e.preventDefault();
        $("#divPagina").load("subpages/" + subpagina + ".html");
    }
});

//carregar página de sucesso, com link para retorno
function paginaSucesso(mensagem, paginaRetorno){
    document.getElementById("divPagina").innerHTML = `<p>${mensagem}</p><a href="" subpage="${paginaRetorno}">Voltar</a>`;
}

/*TODOs
    auth.createUserWithEmailAndPassword(email, senha);
*/