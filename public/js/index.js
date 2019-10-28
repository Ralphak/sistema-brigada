const auth = firebase.auth(),
    db = firebase.firestore(),
    storageRef = firebase.storage().ref(),
    divPagina = document.getElementById("divPagina");
var usuario, listaAlunos, linkAtivo;

//verifica se está autenticado antes de exibir a página
auth.onAuthStateChanged(user=>{
    let menuUsuario = document.querySelector(".dropdown-toggle");
    if (user) {
        usuario = user;
        db.collection("usuarios").doc(usuario.uid).get().then(doc=>{
            usuario.dados = doc.data();
            menuUsuario.innerHTML = usuario.dados.nome.split(" ")[0];
            //criar evento de logout
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
            //exibe a página
            $("#divPagina").load("subpages/pagina_inicial.html");
            document.querySelector(".spinner-border").parentElement.remove();
            document.querySelector(".navbar").classList.add("sticky-top");
            divPagina.removeAttribute("hidden");
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
        //marca o link clicado como ativo
        if(linkAtivo) linkAtivo.classList.remove("active");
        linkAtivo = e.target;
        linkAtivo.classList.add("active");
        //carrega a subpágina
        $("#divPagina").load("subpages/" + subpagina + ".html");
    }
});

//carrega página de sucesso, com link para retorno
function paginaSucesso(mensagem, paginaRetorno){
    divPagina.innerHTML = `<p>${mensagem}</p><a href="" subpage="${paginaRetorno}">Voltar</a>`;
}

//valida se o usuário possui permissão para acessar uma subpágina
//também importa os dados necessários ao usuário, de acordo com sua categoria
async function validarCategoria(categoria){
    if (categoria != usuario.dados.categoria){
        $("#divPagina").load("subpages/pagina_inicial.html");
    } else if(categoria == "admin"){
        if(!listaAlunos) await db.collection("usuarios").where("categoria","==","aluno").get().then(docs=>{
            listaAlunos = {};
            docs.forEach(doc=>{
                listaAlunos[doc.id] = doc.data();
            });
        });
    }
}

//retorna os links a serem carregados na barra de menus, dependendo do tipo de usuário
function getMenuLinks(categoria){
    switch(categoria){
        case "admin": return {
            cadastrar_usuario:"Cadastrar Usuário",
            gerenciar_boletos:"Gerenciar Boletos",
            carteiras:"Imprimir Carteiras"
        };
        case "aluno": return {
            boletos:"Boletos"
        };
        case "instrutor": return {};
    }
}
