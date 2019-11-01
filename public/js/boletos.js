var listaBoletos = divPagina.getElementsByTagName("ul")[0];

validarCategoria("aluno").then(()=>{
    storageRef.child(`boletos/${usuario.uid}`).listAll().then(lista=>{
        if(lista.items.length == 0){
            listaBoletos.innerHTML = "Nenhum boleto!";
        } else{
            listaBoletos.innerHTML = "";
            lista.items.forEach(boleto=>{
                storageRef.child(boleto.fullPath).getDownloadURL().then(downloadURL =>{
                    listaBoletos.innerHTML += `<li class="list-group-item">
                        <a href="${downloadURL}" target="_blank">${boleto.name}</a>
                    </li>`;
                });
            });
            divPagina.querySelector("button").removeAttribute("hidden");
        }
    });
});

//ordenar a lista de boletos alfabeticamente
function Ordenar(){
    tinysort("ul>li>a");
}