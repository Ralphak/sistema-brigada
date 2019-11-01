var tabelaTurmas = document.getElementById("tabela-turmas");

validarCategoria("aluno").then(()=>{
    //criar tabela de turmas
    Object.entries(listaTurmas).forEach(turma=>{
        let media = "-", p1 = turma[1].p1 || "-", p2 = turma[1].p2 || "-", p3 = turma[1].p3 || "-", faltas = 0;
        if (turma[1].faltas) faltas = `<a href="" class="ver-faltas" data-turma="${turma[0]}">${turma[1].faltas.length}</a>`;
        //calcular média
        if(p1 != "-" && p2 != "-"){
            if(p3 != "-") media = (p1+p2+p3)/3;
            else media = (p1+p2)/2;
            media = media.toFixed(2);
        }
        //inserir linhas na tabela
        tabelaTurmas.innerHTML += `<tr>
            <td style="white-space: nowrap">${turma[0]}</td>
            <td>${faltas}</td>
            <td>${p1}</td>
            <td>${p2}</td>
            <td>${p3}</td>
            <td>${media}</td>
        </tr>`;
    });
    //mostrar tabela
    divPagina.querySelector("p").remove();
    tabelaTurmas.parentElement.parentElement.removeAttribute("hidden");
    //mostrar faltas ao clicar no link
    tabelaTurmas.querySelectorAll(".ver-faltas").forEach(link => link.addEventListener("click", e=>{
        e.preventDefault();
        let modalBody = divPagina.querySelector(".modal-body");
        modalBody.innerHTML = `<p>${e.target.dataset.turma}</p><ul>`;
        listaTurmas[e.target.dataset.turma].faltas.forEach(falta=>{
            modalBody.innerHTML += `<li>${moment(falta.toDate()).format("DD/MM/Y")}</li>`;
        });
        modalBody.innerHTML += "</ul>";
        $("#modal-faltas").modal();
    }));
})