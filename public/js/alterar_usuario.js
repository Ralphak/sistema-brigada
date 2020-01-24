var selectUsuarios = divPagina.getElementsByTagName("select")[0],
    listaUsuarios = {};
    formAlterarUsuario = document.getElementById("formAlterarUsuario"),
    msgErro = divPagina.querySelector(".alert-danger"),
    botao = divPagina.querySelector(".btn");

validarCategoria("admin").then(()=>{
    //criar lista de usuários
    selectUsuarios.innerHTML = "<option disabled>- Escolha um usuário</option>";
    Object.assign(listaUsuarios, listaAlunos);
    Object.assign(listaUsuarios, listaInstrutores);
    Object.keys(listaUsuarios).forEach(id=>{
        selectUsuarios.innerHTML += `<option value="${id}">${listaUsuarios[id].categoria} - ${listaUsuarios[id].nome}</option>`;
    });
    tinysort(selectUsuarios);
    selectUsuarios.selectedIndex = 0;
});

//Exibe ou esconde os campos para alunos
var divCamposAluno = document.getElementById("camposAluno"),
    camposAluno = divCamposAluno.innerHTML;
divCamposAluno.innerHTML = "";
divCamposAluno.removeAttribute("hidden");
document.getElementsByName("categoria").forEach(radio=>{
    radio.addEventListener("click", e=>{
        if(e.target.value=="aluno") divCamposAluno.innerHTML = camposAluno;
        else divCamposAluno.innerHTML = "";
    });
});

//Criar o formulário
selectUsuarios.addEventListener("change", ()=>{
    formAlterarUsuario[0].value = listaUsuarios[selectUsuarios.value].nome;
    switch(listaUsuarios[selectUsuarios.value].categoria){
        case "aluno":
            divCamposAluno.innerHTML = camposAluno;
            formAlterarUsuario[1].checked = true;
            formAlterarUsuario[4].value = listaUsuarios[selectUsuarios.value].data_nascimento;
            formAlterarUsuario[5].value = listaUsuarios[selectUsuarios.value].rg;
            formAlterarUsuario[6].value = listaUsuarios[selectUsuarios.value].cpf;
            formAlterarUsuario[7].value = listaUsuarios[selectUsuarios.value].tipo_sanguineo;
            formAlterarUsuario[8].value = listaUsuarios[selectUsuarios.value].formacao;
            break;
        case "instrutor":
            divCamposAluno.innerHTML = "";
            formAlterarUsuario[2].checked = true;
            break;
        case "admin":
            divCamposAluno.innerHTML = "";
            formAlterarUsuario[3].checked = true;
            break;
    }
    formAlterarUsuario.removeAttribute("hidden");
});

//Envio do formulário
formAlterarUsuario.addEventListener("submit", e=>{
    e.preventDefault();
    botao.setAttribute("disabled","");
    let objCadastro = {
        nome: e.target[0].value,
        categoria: e.target.querySelector('input[name="categoria"]:checked').value
    };
    if(e.target[1].checked){
        objCadastro = Object.assign(objCadastro, {
            data_nascimento: e.target[4].value,
            rg: e.target[5].value,
            cpf: e.target[6].value,
            tipo_sanguineo: e.target[7].value,
            formacao: e.target[8].value
        });
        listaAlunos[selectUsuarios.value] = objCadastro;
    } else listaInstrutores[selectUsuarios.value] = objCadastro;
    db.collection("usuarios").doc(selectUsuarios.value).set(objCadastro).then(()=>{
        paginaSucesso("Usuário atualizado com sucesso!", "alterar_usuario");
    }).catch(erro=>{
        msgErro.innerHTML = erro.message;
        botao.removeAttribute("disabled");
    });
});