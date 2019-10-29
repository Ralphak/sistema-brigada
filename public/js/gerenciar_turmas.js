var selectTurmas = divPagina.getElementsByTagName("select")[0],
    tabelaAlunos = document.getElementById("tabela-alunos");

validarCategoria("naoaluno").then(()=>{
    //criar lista de turmas
    selectTurmas.innerHTML = "<option disabled>- Escolha uma turma</option>";
    Object.keys(listaTurmas).forEach(turma=>{
        selectTurmas.innerHTML += `<option value="${turma}">${turma}</option>`;
    });
    tinysort(selectTurmas);
    selectTurmas.selectedIndex = 0;
});

//criar tabela de alunos, com campos para notas
selectTurmas.addEventListener("change", ()=>{
    tabelaAlunos.innerHTML == "";
    Object.entries(listaTurmas[selectTurmas.value].alunos).forEach(aluno=>{
        tabelaAlunos.innerHTML += `<tr>
            <td>${listaAlunos[aluno[0]].nome}</td>
            <td>${aluno[1].p1}</td>
            <td>${aluno[1].p2}</td>
            <td>${aluno[1].p3}</td>
            <td>-</td>
        </tr>`;
    });
});