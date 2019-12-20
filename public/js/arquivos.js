var listaArquivos = divPagina.getElementsByTagName("ul")[0],
    formArquivos = divPagina.getElementsByTagName("form")[0],
    listaEnvio = divPagina.getElementsByTagName("ul")[1],
    botaoApagar = document.getElementById("botao-apagar");

//Listar os arquivos dos administradores
validarCategoria("admin").then(()=>{
    listaArquivos.innerHTML = "Por favor aguarde...";
    storageRef.child(`arquivos`).listAll().then(lista=>{
        if(lista.items.length == 0){
            listaArquivos.innerHTML = "Nenhum arquivo!";
        } else{
            listaArquivos.innerHTML = "";
            lista.items.forEach(arquivo=>{
                storageRef.child(arquivo.fullPath).getDownloadURL().then(downloadURL =>{
                    //adiciona um arquivo à lista
                    listaArquivos.innerHTML += `<li>
                        <a href="${downloadURL}" target="_blank">${arquivo.name}</a> - 
                        <a href="" class="apagar-arquivo" id="${arquivo.fullPath}"><img src="img/x.svg" title="Apagar"></a>
                    </li>`;
                    tinysort("ul>li");
                    //mostra um modal ao clicar em apagar
                    document.querySelectorAll(".apagar-arquivo").forEach(link=>{
                        link.addEventListener("click", e=>{
                            e.preventDefault();
                            divPagina.querySelector(".modal-body").innerHTML = `Apagar o arquivo ${e.target.parentElement.id.split("/").pop()}?`;
                            botaoApagar.dataset.path = e.target.parentElement.id;
                            $("#confirmar-remocao-arquivo").modal();
                        });
                    });
                });
            });
        }
    });
});

//Apagar o arquivo após confirmação
botaoApagar.addEventListener("click", ()=>{
    storageRef.child(botaoApagar.dataset.path).delete();
    document.getElementById(botaoApagar.dataset.path).parentElement.remove();
    if(listaArquivos.innerHTML == ""){
        listaArquivos.innerHTML = "Nenhum arquivo!";
    }
});

//Exibe os nomes dos arquivos a serem enviados
divPagina.getElementsByTagName("input")[0].addEventListener("change", e=>{
    listaEnvio.innerHTML = "";
    if(e.target.files.length > 1){
        Object.values(e.target.files).forEach(arquivo=>{
            listaEnvio.innerHTML += `<li class="list-inline-item">${arquivo.name}</li>`;
        });
    }
});

//Envio dos arquivos ao armazenamento
formArquivos.addEventListener("submit", e=>{
    e.preventDefault();
    Object.values(e.target[0].files).forEach(arquivo=>{
        storageRef.child(`arquivos/${arquivo.name}`).put(arquivo);
    });
    paginaSucesso("Envio de arquivos realizado!", "arquivos");
});