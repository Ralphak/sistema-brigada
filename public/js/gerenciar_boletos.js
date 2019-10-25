var selectAlunos = divPagina.getElementsByTagName("select")[0],
    listaBoletos = divPagina.getElementsByTagName("ul")[0];

validarCategoria("admin").then(()=>{
    //criar lista de alunos
    Object.keys(listaAlunos).forEach(id=>{
        selectAlunos.innerHTML += `<option value="${id}">${listaAlunos[id].nome}</option>`;
    });
    tinysort(selectAlunos);
    selectAlunos.selectedIndex = 0;
});

selectAlunos.addEventListener("change", ()=>{
    listaBoletos.innerHTML = "Por favor aguarde...";
    storageRef.child(`boletos/${selectAlunos.value}`).listAll().then(lista=>{
        if(lista.items.length == 0){
            listaBoletos.innerHTML = "Nenhum boleto!"
        } else{
            let bufer = "";
            lista.items.forEach(boleto=>{
                storageRef.child(boleto.fullPath).getDownloadURL().then(downloadURL =>{
                    bufer += `<li><a href="${downloadURL}">${boleto.name}</a></li>`;
                });
            });
            listaBoletos.innerHTML = bufer;
        }
    });
});