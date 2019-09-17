const auth = firebase.auth(),
    db = firebase.firestore(),
    divPagina = document.getElementById("divPagina");
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
            //carregar links da barra de menus
            let menuLinks = getMenuLinks(usuario.dados.categoria),
                navbarMenu = document.getElementById("navbarMenu").children[0];
            Object.keys(menuLinks).forEach(link=>{
                navbarMenu.innerHTML += `<a class="nav-link" href="#" subpage="${link}">${menuLinks[link]}</a>`;
            });
            $("#divPagina").load("subpages/pagina_inicial.html");
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

//carrega página de sucesso, com link para retorno
function paginaSucesso(mensagem, paginaRetorno){
    divPagina.innerHTML = `<p>${mensagem}</p><a href="" subpage="${paginaRetorno}">Voltar</a>`;
}

//valida se o usuário possui permissão para acessar uma subpágina
function validarCategoria(categoria){
    if (categoria != usuario.dados.categoria){
        $("#divPagina").load("subpages/pagina_inicial.html");
    }
}

//retorna os links a serem carregados na barra de menus, dependendo do tipo de usuário
function getMenuLinks(categoria){
    switch(categoria){
        case "admin": return {gerenciar_usuarios:"Gerenciar Usuários"};
    }
}

/*TODOs
    auth.createUserWithEmailAndPassword(email, senha);
*/