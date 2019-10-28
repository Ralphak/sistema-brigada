var selectAlunos = divPagina.getElementsByTagName("select")[0],
    listaBoletos = divPagina.getElementsByTagName("ul")[0],
    formBoletos = divPagina.getElementsByTagName("form")[0],
    listaEnvio = divPagina.getElementsByTagName("ul")[1],
    botaoApagar = document.getElementById("botao-apagar");

validarCategoria("admin").then(()=>{
    //criar lista de alunos
    Object.keys(listaAlunos).forEach(id=>{
        selectAlunos.innerHTML += `<option value="${id}">${listaAlunos[id].nome}</option>`;
    });
    tinysort(selectAlunos);
    selectAlunos.selectedIndex = 0;
});

//Listar os boletos do aluno escolhido
selectAlunos.addEventListener("change", ()=>{
    formBoletos.setAttribute("hidden","");
    listaBoletos.innerHTML = "Por favor aguarde...";
    storageRef.child(`boletos/${selectAlunos.value}`).listAll().then(lista=>{
        if(lista.items.length == 0){
            listaBoletos.innerHTML = "Nenhum boleto!";
        } else{
            listaBoletos.innerHTML = "";
            lista.items.forEach(boleto=>{
                storageRef.child(boleto.fullPath).getDownloadURL().then(downloadURL =>{
                    listaBoletos.innerHTML += `<li>
                        <a href="${downloadURL}" target="_blank">${boleto.name}</a> - 
                        <a href="" class="apagar-boleto" id="${boleto.fullPath}">Apagar</a>
                    </li>`;
                    //mostra um modal ao clicar em apagar
                    document.querySelectorAll(".apagar-boleto").forEach(link=>{
                        link.addEventListener("click", e=>{
                            e.preventDefault();
                            divPagina.querySelector(".modal-body").innerHTML = `Apagar o arquivo ${e.target.id.split("/").pop()}?`;
                            botaoApagar.dataset.path = e.target.id;
                            $("#confirmar-remocao-boleto").modal()
                        });
                    });
                });
            });
        }
        formBoletos.removeAttribute("hidden");
    });
});

//Apagar o boleto após confirmação
botaoApagar.addEventListener("click", ()=>{
    storageRef.child(botaoApagar.dataset.path).delete();
    document.getElementById(botaoApagar.dataset.path).parentElement.remove();
    if(listaBoletos.innerHTML == ""){
        listaBoletos.innerHTML = "Nenhum boleto!";
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
formBoletos.addEventListener("submit", e=>{
    e.preventDefault();
    Object.values(e.target[0].files).forEach(arquivo=>{
        storageRef.child(`boletos/${selectAlunos.value}/${arquivo.name}`).put(arquivo);
    });
    paginaSucesso("Envio de boletos realizado!", "gerenciar_boletos");
});