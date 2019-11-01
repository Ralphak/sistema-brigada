var dadosAlunos, alunosEscolhidos = {}, botaoEnviar,
    selectTurmas = divPagina.getElementsByTagName("select")[0],
    tabelaAlunos = document.getElementById("tabela-alunos"),
    msgErro = divPagina.querySelectorAll(".alert-danger"),
    formTurma = document.getElementById("criar-turma");

validarCategoria("naoaluno").then(()=>{
    //criar lista de turmas
    selectTurmas.innerHTML = "<option disabled>- Escolha uma turma</option>";
    Object.keys(listaTurmas).forEach(turma=>{
        let nomeInstrutor = "";
        if(usuario.dados.categoria == "admin") nomeInstrutor = ` (${listaInstrutores[listaTurmas[turma].instrutor].nome})`;
        selectTurmas.innerHTML += `<option value="${turma}">${turma}${nomeInstrutor}</option>`;
    });
    tinysort(selectTurmas);
    selectTurmas.selectedIndex = 0;
    //formulário de nova turma, para administradores
    if(usuario.dados.categoria == "admin"){
        formTurma.innerHTML = `<hr><h3>Criar nova turma</h3>
            <div class="mb-3"><input placeholder="Nome ou Código" required>
            <small class="text-muted"><b>CUIDADO:</b> Turmas com o mesmo nome serão sobrescritas!</small></div>
            <div class="mb-3"><b>Instrutor: </b>
            <select required><option disabled selected>Carregando...</option></select>
            <small class="text-muted">Inclui também contas de administradores</small></div>
            <b>Alunos: </b>
            <select class="mb-1"><option disabled selected>Carregando...</option></select>
            <ul id="lista-escolhidos"></ul>
            <button type="submit" class="btn btn-danger" disabled>Enviar</button>
            <br><p class="alert-danger mt-2"></p>`;
        //importar nomes para o formulário
        let inputSelect = formTurma.getElementsByTagName("select");
        inputSelect[0].innerHTML = `<option disabled value="">- Escolha o instrutor</option>`;
        inputSelect[1].innerHTML = `<option disabled>- Escolha um ou mais alunos</option>`;
        Object.keys(listaInstrutores).forEach(id=>
            inputSelect[0].innerHTML += `<option value="${id}">${listaInstrutores[id].nome}</option>`
        ); tinysort(inputSelect[0]);
        Object.keys(listaAlunos).forEach(id=>
            inputSelect[1].innerHTML += `<option value="${id}">${listaAlunos[id].nome}</option>`
        ); tinysort(inputSelect[1]);
        inputSelect[0].selectedIndex = 0; inputSelect[1].selectedIndex = 0;
        //atualizar lista de alunos
        inputSelect[1].addEventListener("change", e=>{
            let id = e.target.value,
                listaEscolhidos = document.getElementById("lista-escolhidos");
            botaoEnviar = formTurma.getElementsByTagName("button")[0];
            if(!alunosEscolhidos[id]){
                alunosEscolhidos[id] = {};
                listaEscolhidos.innerHTML += `<li>${listaAlunos[id].nome} - <a href="" class="remover-li" id="${id}">Remover</a></li>`;
                tinysort("ul#lista-escolhidos>li");
                if(botaoEnviar.disabled) botaoEnviar.removeAttribute("disabled");
                //links para remover um aluno da lista
                divPagina.querySelectorAll(".remover-li").forEach(link=>{
                    link.addEventListener("click", e2=>{
                        e2.preventDefault();
                        e2.target.parentElement.remove();
                        delete alunosEscolhidos[e2.target.id];
                        if(listaEscolhidos.innerHTML == "") botaoEnviar.setAttribute("disabled", "");
                    });
                });
            }
            inputSelect[1].selectedIndex = 0;
        });
    }
    
});

//criar tabela de alunos, com campos para notas e marcação de faltas
selectTurmas.addEventListener("change", ()=>{
    tabelaAlunos.innerHTML = "";
    dadosAlunos = listaTurmas[selectTurmas.value].alunos;
    Object.entries(dadosAlunos).forEach(aluno=>{
        let media = "-", p1 = aluno[1].p1 || "", p2 = aluno[1].p2 || "", p3 = aluno[1].p3 || "", faltas = 0;
        if (aluno[1].faltas) faltas = `<a href="" class="ver-faltas" data-aluno="${aluno[0]}">${aluno[1].faltas.length}</a>`;
        //calcular média
        if(p1 && p2){
            if(p3) media = (p1+p2+p3)/3;
            else media = (p1+p2)/2;
            media = media.toFixed(2);
        }
        //inserir linha na tabela
        tabelaAlunos.innerHTML += `<tr>
            <td style="white-space: nowrap">${listaAlunos[aluno[0]].nome}</td>
            <td>${faltas}</td>
            <td><input type="checkbox" id="falta-${aluno[0]}"></td>
            <td><input type="number" id="p1-${aluno[0]}" min=0 max=10 value=${p1}></td>
            <td><input type="number" id="p2-${aluno[0]}" min=0 max=10 value=${p2}></td>
            <td><input type="number" id="p3-${aluno[0]}" min=0 max=10 value=${p3}></td>
            <td>${media}</td>
        </tr>`;
    });
    tabelaAlunos.parentElement.removeAttribute("hidden");
    divPagina.querySelectorAll("button").forEach(botao => botao.removeAttribute("hidden"));
    //links para mostrar faltas
    document.querySelectorAll(".ver-faltas").forEach(link => link.addEventListener("click", e=>{
        e.preventDefault();
        let modalBody = divPagina.querySelector(".modal-body"),
            aluno = dadosAlunos[e.target.dataset.aluno];
        modalBody.innerHTML = `<p>${listaAlunos[e.target.dataset.aluno].nome}</p><ul>`;
        aluno.faltas.forEach(falta => {
            modalBody.innerHTML += `<li>${moment(falta.toDate()).format("DD/MM/Y")}</li>`
        });
        modalBody.innerHTML += "</ul>";
        $("#modal-faltas").modal();
    }));
});

//salvar mudanças
function SalvarMudancas(botao){
    botao.setAttribute("disabled","");
    let dadosNovos = {alunos: JSON.parse(JSON.stringify(dadosAlunos))};
    Object.entries(dadosNovos.alunos).forEach(aluno=>{
        let p1 = document.getElementById(`p1-${aluno[0]}`),
            p2 = document.getElementById(`p2-${aluno[0]}`),
            p3 = document.getElementById(`p3-${aluno[0]}`);
        if(p1.value != "") aluno[1].p1 = parseFloat(p1.value);
        if(p2.value != "") aluno[1].p2 = parseFloat(p2.value);
        if(p3.value != "") aluno[1].p3 = parseFloat(p3.value);
        if(document.getElementById(`falta-${aluno[0]}`).checked) {
            if(!aluno[1].faltas) aluno[1].faltas = [];
            aluno[1].faltas.push(firebase.firestore.Timestamp.now());
        }
        //correção das datas já gravadas
        if(aluno[1].faltas){
            for(let i=0; i<aluno[1].faltas.length; i++){
                aluno[1].faltas[i] = new firebase.firestore.Timestamp(
                    aluno[1].faltas[i].seconds,
                    aluno[1].faltas[i].nanoseconds
                );
            }
        }
    });
    if(JSON.stringify(dadosNovos.alunos) != JSON.stringify(dadosAlunos)){
        db.collection("turmas").doc(selectTurmas.value).update(dadosNovos).then(()=>{
            listaTurmas[selectTurmas.value].alunos = dadosNovos.alunos;
            paginaSucesso("Suas mudanças foram salvas!", "gerenciar_turmas");
        }).catch(erro=>{
            msgErro[0].innerHTML = erro;
            botao.removeAttribute("disabled");
        });
    } else{
        msgErro[0].innerHTML = "Nenhuma mudança feita!";
        botao.removeAttribute("disabled");
    }
}

//enviar emails para a turma
function EnviarEmails(){
    let mailto = "mailto:";
    Object.keys(dadosAlunos).forEach(id=>{ mailto += listaAlunos[id].email + "," });
    location.href = mailto.slice(0, -1);
}

//criar nova turma
formTurma.addEventListener("submit", e=>{
    e.preventDefault();
    let novaTurma = {
        instrutor: e.target[1].value,
        alunos: alunosEscolhidos
    }
    botaoEnviar.setAttribute("disabled","");
    db.collection("turmas").doc(e.target[0].value).set(novaTurma).then(()=>{
        listaTurmas[e.target[0].value] = novaTurma;
        paginaSucesso("Turma criada com sucesso!", "gerenciar_turmas");
    }).catch(erro=>{
        msgErro[1].innerHTML = erro;
        botaoEnviar.removeAttribute("disabled");
    });
});