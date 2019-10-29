var dadosAlunos,
    selectTurmas = divPagina.getElementsByTagName("select")[0],
    tabelaAlunos = document.getElementById("tabela-alunos"),
    msgErro = divPagina.querySelector(".alert-danger");

validarCategoria("naoaluno").then(()=>{
    //criar lista de turmas
    selectTurmas.innerHTML = "<option disabled>- Escolha uma turma</option>";
    Object.entries(listaTurmas).forEach(turma=>{
        selectTurmas.innerHTML += `<option value="${turma[0]}">${turma[0]} (${turma[1].instrutor_nome})</option>`;
    });
    tinysort(selectTurmas);
    selectTurmas.selectedIndex = 0;
});

//criar tabela de alunos, com campos para notas e marcação de faltas
selectTurmas.addEventListener("change", ()=>{
    tabelaAlunos.parentElement.removeAttribute("hidden");
    divPagina.querySelectorAll("button").forEach(botao => botao.removeAttribute("hidden"));
    tabelaAlunos.innerHTML == "";
    dadosAlunos = listaTurmas[selectTurmas.value].alunos;
    Object.entries(dadosAlunos).forEach(aluno=>{
        let media = "-", p1 = aluno[1].p1, p2 = aluno[1].p2, p3 = aluno[1].p3, faltas = 0;
        //calcular média
        if(p1 && p2){
            if(p3) media = (p1+p2+p3)/3;
            else media = (p1+p2)/2;
            media = media.toFixed(2);
        }
        //tratamento de campos da linha
        if (aluno[1].faltas) faltas = `<a href="" class="ver-faltas" data-aluno="${aluno[0]}">${aluno[1].faltas.length}</a>`;
        if (!p1) p1 = `<input type="number" id="p1-${aluno[0]}" min=0 max=10>`;
        if (!p2) p2 = `<input type="number" id="p2-${aluno[0]}" min=0 max=10>`;
        if (!p3) p3 = `<input type="number" id="p3-${aluno[0]}" min=0 max=10>`;
        //inserir linha na tabela
        tabelaAlunos.innerHTML += `<tr>
            <td style="white-space: nowrap">${listaAlunos[aluno[0]].nome}</td>
            <td>${faltas}</td>
            <td><input type="checkbox" id="falta-${aluno[0]}"></td>
            <td>${p1}</td>
            <td>${p2}</td>
            <td>${p3}</td>
            <td>${media}</td>
        </tr>`;
    });
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
        if(p1 && p1.value != "") aluno[1].p1 = parseFloat(p1.value);
        if(p2 && p2.value != "") aluno[1].p2 = parseFloat(p2.value);
        if(p3 && p3.value != "") aluno[1].p3 = parseFloat(p3.value);
        if(document.getElementById(`falta-${aluno[0]}`).checked) {
            if(!aluno[1].faltas) aluno[1].faltas = [];
            aluno[1].faltas.push(firebase.firestore.Timestamp.now());
        }
    });
    if(JSON.stringify(dadosNovos.alunos) != JSON.stringify(dadosAlunos)){
        db.collection("turmas").doc(selectTurmas.value).update(dadosNovos).then(()=>{
            listaTurmas[selectTurmas.value].alunos = dadosNovos.alunos;
            paginaSucesso("Suas mudanças foram salvas!", "gerenciar_turmas");
        }).catch(erro=>{
            msgErro.innerHTML = erro;
            botao.removeAttribute("disabled");
        });
    } else{
        msgErro.innerHTML = "Nenhuma mudança feita!";
        botao.removeAttribute("disabled");
    }
}

//enviar emails para a turma
function EnviarEmails(){
    let mailto = "mailto:";
    Object.keys(dadosAlunos).forEach(id=>{ mailto += listaAlunos[id].email + "," });
    location.href = mailto.slice(0, -1);
}