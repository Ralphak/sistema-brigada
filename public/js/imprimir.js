var imgFundo = new Image(),
    alunosEscolhidos = {},
    selectAlunos = divPagina.getElementsByTagName("select")[0],
    listaEscolhidos = document.getElementById("lista-escolhidos");
    botaoImprimir = divPagina.getElementsByTagName("button")[0];
imgFundo.src = "img/logo brigada claro.jpeg";

validarCategoria("admin").then(()=>{
    //criar lista de alunos
    selectAlunos.innerHTML = "<option disabled>- Escolha um ou mais alunos</option>";
    Object.keys(listaAlunos).forEach(id=>{
        selectAlunos.innerHTML += `<option value="${id}">${listaAlunos[id].nome}</option>`;
    });
    tinysort(selectAlunos);
    selectAlunos.selectedIndex = 0;
});

//adiciona itens à lista e cria um link para remoção
selectAlunos.addEventListener("change", ()=>{
    let id = selectAlunos.value;
    if(!alunosEscolhidos[id]){
        alunosEscolhidos[id] = listaAlunos[id];
        listaEscolhidos.innerHTML += `<li>${listaAlunos[id].nome} - <a href="" class="remover-li" id="${id}">Remover</a></li>`;
        tinysort("ul#lista-escolhidos>li");
        if(botaoImprimir.disabled) botaoImprimir.removeAttribute("disabled");
        //links para remover um aluno da lista
        divPagina.querySelectorAll(".remover-li").forEach(link => link.addEventListener("click", e=>{
            e.preventDefault();
            e.target.parentElement.remove();
            delete alunosEscolhidos[e.target.id];
            if(listaEscolhidos.innerHTML == "") botaoImprimir.setAttribute("disabled", "");
        }));
    }
    selectAlunos.selectedIndex = 0;
});

//botão para imprimir as carteiras
botaoImprimir.addEventListener("click", ()=>{
    let doc = new jsPDF(), espaco=59, contador=-1;
    Object.values(alunosEscolhidos).sort((a,b)=>{
        return a.nome.localeCompare(b.nome);
    }).forEach(aluno =>{
        //contagem para troca de página
        if(contador == 4){
            doc.addPage();
            contador=-1;
        }
        contador++;
        //criação do arquivo para impressão
        doc.addImage(imgFundo, 42.5, 8.5 + espaco*contador, 50, 44)
            .addImage(imgFundo, 108.5, 4 + espaco*contador)
            .setDrawColor(0, 0, 0)
            .setLineWidth(.25)
            .line(102, 42.75 + espaco*contador, 177, 42.75 + espaco*contador)
            .setDrawColor(200, 0, 0)
            .setLineWidth(1.5)
            .roundedRect(7.4, 2.5 + espaco*contador, 87, 56, 4, 4)
            .roundedRect(96.1, 2.5 + espaco*contador, 87, 56, 4, 4)
            .setLineWidth(.5)
            .rect(10.75, 16.5 + espaco*contador, 30, 39)
            .roundedRect(11, 8 + espaco*contador, 80, 6, 2, 2)
            .roundedRect(49.5, 23 + espaco*contador, 36, 6, 2, 2)
            .roundedRect(100, 19.5 + espaco*contador, 30, 5.25, 1, 1)
            .roundedRect(130, 19.5 + espaco*contador, 34, 5.25, 1, 1)
            .roundedRect(164, 19.5 + espaco*contador, 15, 5.25, 1, 1)
            .roundedRect(100, 30 + espaco*contador, 25, 5.25, 1, 1)
            .roundedRect(125, 30 + espaco*contador, 54, 5.25, 1, 1)
            .setFontStyle("normal")
            .setTextColor(0, 0, 0)
            .setFontSize(14)
            .text(moment().add(1, 'y').format("DD/MM/Y"), 67.5, 27.75 + espaco*contador, "center")
            .setFontSize(13)
            .text(aluno.nome, 51, 12.6 + espaco*contador, "center")
            .setFontSize(12)
            .text(aluno.rg, 115, 23.6 + espaco*contador, "center")
            .text(aluno.cpf, 147, 23.6 + espaco*contador, "center")
            .text(aluno.tipo_sanguineo, 171.6, 23.6 + espaco*contador, "center")
            .text(aluno.data_nascimento, 112.5, 34.1 + espaco*contador, "center")
            .setFontSize(11)
            .text(aluno.formacao, 152, 34 + espaco*contador, "center")
            .setFontSize(9)
            .text("comercialanjosdavida@gmail.com", 67.5, 47 + espaco*contador, "center")
            .setFontSize(8)
            .text("CENTRO DE ENSINO PROFISSIONAL", 67.5, 37.5 + espaco*contador, "center")
            .text("ANJOS DA VIDA", 67.5, 41 + espaco*contador, "center")
            .text("Assinatura do Diretor", 139.5, 45.5 + espaco*contador, "center")
            .setFontStyle("bold")
            .text("Carteira Estudantil", 139.5, 6.5 + espaco*contador, "center")
            .text("Decreto Nº 8537", 139.5, 9.5 + espaco*contador, "center")
            .text("Leis 12852 e 12933 Dezembro 2013", 139.5, 12.5 + espaco*contador, "center")
            .text("Centro de Ensino Anjos da Vida", 139.5, 50 + espaco*contador, "center")
            .text("CNJ: 17.951.092/0001-98", 139.5, 53 + espaco*contador, "center")
            .text("Mat Municipal / RJ 056958-2", 139.5, 56 + espaco*contador, "center")
            .setTextColor(200, 0, 0)
            .setFontSize(6)
            .text("Válido com apresentação de documento com foto", 67.5, 55 + espaco*contador, "center")
            .setFontSize(11)
            .text("Nome", 12, 7 + espaco*contador)
            .text("Validade", 50.5, 22 + espaco*contador)
            .text("FOTO", 25.75, 37 + espaco*contador, "center")
            .setFontSize(10)
            .text("RG", 101, 18.75 + espaco*contador)
            .text("CPF", 131, 18.75 + espaco*contador)
            .text("Data Nasc.", 101, 29.25 + espaco*contador)
            .text("Formação", 126, 29.25 + espaco*contador)
            .setFontSize(9)
            .text("Tipo Sang.", 163.5, 18.75 + espaco*contador);
    });
    //iniciar download do arquivo de impressão
    doc.save('carteiras.pdf');
});