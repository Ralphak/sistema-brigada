var listaBoletos = divPagina.getElementsByTagName("ul")[0];

validarCategoria("aluno").then(()=>{
    storageRef.child(`boletos/${usuario.uid}`).listAll().then(lista=>{
        if(lista.items.length == 0){
            listaBoletos.innerHTML = "Nenhum boleto!";
        } else{
            listaBoletos.innerHTML = "";
            lista.items.forEach(boleto=>{
                if(boletosSalvos[boleto.name]) listaBoletos.innerHTML += boletosSalvos[boleto.name];
                else storageRef.child(boleto.fullPath).getDownloadURL().then(downloadURL =>{
                    boletosSalvos[boleto.name] = `<li class="list-group-item">
                        <a href="${downloadURL}" target="_blank">${boleto.name}</a>
                    </li>`;
                    listaBoletos.innerHTML += boletosSalvos[boleto.name];
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