var USERNAME = "PRESTCON";
var PASSWORD = "senha123";


//***************************CADASTRO DE DIMENCIONAMENTO******************************//


$("#botao-add-dimencio").click(function(event){

	event.preventDefault();

	var form = document.querySelector("#form-dimenc");
	
	var data = ObtemDimencionamentodoForm(form);

	var dimencionamento =
	{
		"TipoProgAção": String(data.TipoProgAção),
		"CodFonte": String(data.CodFonte),
		"OriRecurso": String(data.OriRecurso),
		"NameFonte": String(data.NameFonte),
		"Exercicio": String(data.Exercicio),
		"DataInicial": String(data.DataInicial),
		"DataFinal": String(data.DataFinal),
		"NatDesp": String(data.NatDesp),
		"Objeto": String(data.Objeto),
		"Valor": String(data.Valor),
	}

	var erros = ValidaDimenc(data);

	if (erros.length > 0){
		alert("Houve erro(s) no preenchimento do formulário");
		exibeMensagensDeErro(erros);
		return;
	}
	else {
		$.ajax({
			method:"POST",
			url:String(global_link) + "dimencionamento/criar/",
		    data: JSON.stringify(dimencionamento), //Função para transformar o objeto em JSON
		    contentType: 'application/json; charset=utf-8',
			dataType: "json",
			headers: {
				"Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
			},
		    success: function() {
		        alert("Dados enviados!");
		        form.reset();
		        exibeMensagensDeErro(erros);
		    },
		    error: function() {
		        alert("Dados não enviados - ERRO !");
				exibeMensagensDeErro(erros);
		    }
		});
	}
})

function ObtemDimencionamentodoForm(form){
	
	var auxiliar = form.Objeto.value;
	if (auxiliar == "Outro") {
		auxiliar = form.Outro.value;
	}

	var Dimencionamento = {
		TipoProgAção: form.IProgAç.value,
		CodFonte: form.CodFonte.value,
		OriRecurso: form.OriRecurso.value,
		NameFonte: form.NFonte.value,
		Exercicio: form.Exercicio.value,
		DataInicial: form.data1.value,
		DataFinal: form.data2.value,
		NatDesp: form.NatDesp.value,
		Objeto: auxiliar,
		Valor: form.Valor.value,
	}

	return Dimencionamento;
}

function ValidaDimenc(dimencionamento){
	var erros = [];
		if (dimencionamento.TipoProgAção.length == 0) {
			erros.push("Tipo de Programação/Ação nao pode está em branco, Por favor adicione um tipo.");
		}
		if (dimencionamento.CodFonte.length == 0) {
			erros.push("Codigo Fonte nao pode está em branco, Por favor adicione o numero do Codigo.");
		}
		if (dimencionamento.OriRecurso.length == 0) {
			erros.push("Origem do Recurso nao pode está em branco, Por favor marque alguma.");
		}
		if (dimencionamento.NameFonte.length == 0) {
			erros.push("Nome da Fonte nao pode está em branco, Por favor adicione um nome.");
		}
		if (dimencionamento.DataInicial.length == 0) {
			erros.push("Data Inicial não pode ser em branco, Por favor adicione uma data.");
		}
		if (dimencionamento.DataFinal.length == 0) {
			erros.push("Data Final não pode ser em branco, Por favor adicione uma data.");
		}
		if ( dimencionamento.DataInicial == dimencionamento.DataFinal) {
			erros.push("Data Inicial e Final estão iguais. Por favor, altere alguma.");
		}
		if ( dimencionamento.DataFinal < dimencionamento.DataInicial) {
			erros.push("Data Final e menor que a Data Inicial. Por favor, altere alguma.");
		}
		if (dimencionamento.NatDesp.length == 0) {
			erros.push("Natureza da Despesa está em branco, Por favor marque alguma.");
		}
		if (dimencionamento.Objeto.length == 0) {
			erros.push("O tipo Objeto está em branco, Por favor marque alguma ou espeficique caso outro.");
		}
		if (dimencionamento.Valor.length == 0) {
			erros.push("O Valor está em branco, Por favor adicione algum valor.");
		}					
	return erros;
}

function exibeMensagensDeErro(erros){
	var ul = document.querySelector("#mensagens-erro-dimencionamento");
	ul.innerHTML = "";

	erros.forEach(function(erro){
		var li = document.createElement("li");
		li.textContent = erro;
		ul.appendChild(li);	
	});
}