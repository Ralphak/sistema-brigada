validarCategoria("admin").then(()=>{
    document.getElementById("limite-avisos").value = listaAvisos.limite;
});

var botao = divPagina.querySelector("button"),
    msgErro = divPagina.querySelector(".alert-danger");

divPagina.querySelector("form").addEventListener("submit", e=>{
    e.preventDefault();
    botao.setAttribute("disabled", "");
    msgErro.innerHTML = "";
    let listaNova = JSON.parse(JSON.stringify(listaAvisos));
    listaNova.limite = parseInt(e.target[2].value);
    listaNova.lista.forEach(aviso=>{
        aviso.data = new firebase.firestore.Timestamp(
            aviso.data.seconds,
            aviso.data.nanoseconds
        );
    });
    listaNova.lista.push({
        data: firebase.firestore.Timestamp.now(),
        texto: e.target[1].value,
        titulo: e.target[0].value
    });
    listaNova.lista.sort((a, b) => b.data.seconds - a.data.seconds);
    while(listaNova.lista.length > listaNova.limite) listaNova.lista.pop();
    db.collection("outros").doc("avisos").set(listaNova).then(()=>{
        listaAvisos = listaNova;
        paginaSucesso("Novo aviso adicionado ao quadro!", "pagina_inicial");
    }).catch(erro=>{
        msgErro.innerHTML = erro;
        botao.removeAttribute("disabled");
    });
});