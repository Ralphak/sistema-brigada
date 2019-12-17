var listaArquivos = divPagina.getElementsByTagName("ul")[0];

validarCategoria("aluno").then(()=>{
    storageRef.child(`arquivos/${usuario.uid}`).listAll().then(lista=>{
        if(lista.items.length == 0){
            listaArquivos.innerHTML = "Nenhum arquivo!";
        } else{
            listaArquivos.innerHTML = "";
            lista.items.forEach(arquivo=>{
                if(arquivosSalvos[arquivo.name]) listaArquivos.innerHTML += arquivosSalvos[arquivo.name];
                else storageRef.child(arquivo.fullPath).getDownloadURL().then(downloadURL =>{
                    arquivosSalvos[arquivo.name] = `<li class="list-group-item">
                        <a href="${downloadURL}" target="_blank">${arquivo.name}</a>
                    </li>`;
                    listaArquivos.innerHTML += arquivosSalvos[arquivo.name];
                });
            });
            divPagina.querySelector("button").removeAttribute("hidden");
        }
    });
});

//ordenar a lista de arquivos alfabeticamente
function Ordenar(){
    tinysort("ul>li>a");
}