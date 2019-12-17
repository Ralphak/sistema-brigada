//Variáveis globais
const auth = firebase.auth(),
    db = firebase.firestore(),
    storageRef = firebase.storage().ref(),
    divPagina = document.getElementById("divPagina");
var usuario, listaAlunos, listaTurmas, listaInstrutores = {}, linkAtivo, boletosSalvos = {}, listaAvisos;

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
            let navbarMenu = document.getElementById("navbarMenu").children[0];
            Object.entries(getMenuLinks(usuario.dados.categoria)).forEach(link=>{
                navbarMenu.innerHTML += `<a class="nav-link" href="#" subpage="${link[0]}" data-toggle="collapse" data-target=".navbar-collapse.show">${link[1]}</a>`;
            });
            //importar avisos do banco de dados
            db.collection("outros").doc("avisos").get().then(doc=>{
                listaAvisos = doc.data();
                //exibe a página
                $("#divPagina").load("subpages/pagina_inicial.html");
                document.querySelector(".spinner-border").parentElement.remove();
                document.querySelector(".navbar").classList.add("sticky-top");
                divPagina.removeAttribute("hidden");
            });
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
    divPagina.innerHTML = `<p class="alert alert-success">${mensagem}</p>
        <a href="" subpage="${paginaRetorno}">Voltar</a>`;
}

//valida se o usuário possui permissão para acessar uma subpágina
//também importa os dados necessários ao usuário, de acordo com sua categoria
async function validarCategoria(categoria){
    let naoAluno = Boolean(categoria == "naoaluno" && usuario.dados.categoria != "aluno");
    if (categoria != usuario.dados.categoria && !naoAluno){
        $("#divPagina").load("subpages/pagina_inicial.html");
    } else if(categoria == "aluno"){
        //importar lista de turmas que o aluno faz parte
        if(!listaTurmas){
            listaTurmas = {};
            await db.collection("turmas").get().then(docs=>{
                docs.forEach(doc=>{
                    let docData = doc.data();
                    if(docData.alunos[usuario.uid]) listaTurmas[doc.id] = docData.alunos[usuario.uid];
                });
            });
        }
    } else{
        //importar lista de alunos e instrutores
        if(!listaAlunos){
            listaAlunos = {};
            if(usuario.dados.categoria == "admin") await db.collection("usuarios").get().then(docs=>{
                docs.forEach(doc=>{
                    let docData = doc.data();
                    if(docData.categoria == "aluno") listaAlunos[doc.id] = docData;
                    else listaInstrutores[doc.id] = docData;
                });
            });
            else await db.collection("usuarios").where("categoria","==","aluno").get().then(docs=>{
                docs.forEach(doc=>{
                    listaAlunos[doc.id] = doc.data();
                });
            });
        }
        //importar lista de turmas
        if(!listaTurmas){
            listaTurmas = {};
            if(usuario.dados.categoria == "admin") await db.collection("turmas").get().then(docs=>{
                docs.forEach(doc=>{
                    listaTurmas[doc.id] = doc.data();
                });
            });
            else await db.collection("turmas").where("instrutor","==",usuario.uid).get().then(docs=>{
                docs.forEach(doc=>{
                    listaTurmas[doc.id] = doc.data();
                });
            });
        }
    }
}

//retorna os links a serem carregados na barra de menus, dependendo do tipo de usuário
function getMenuLinks(categoria){
    switch(categoria){
        case "admin": return {
            cadastrar_usuario:"Cadastrar Usuário",
            gerenciar_turmas:"Turmas",
            gerenciar_boletos:"Boletos",
            gerenciar_arquivos:"Arquivos",
            imprimir:"Imprimir Carteiras"
        };
        case "aluno": return {
            turmas:"Turmas",
            boletos:"Boletos",
            arquivos:"Arquivos"
        };
        case "instrutor": return {
            gerenciar_turmas:"Gerenciar Turmas"
        };
    }
}