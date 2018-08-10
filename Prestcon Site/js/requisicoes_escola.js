$.ajax({
		method:"GET",
		url: String(global_link) + "escola/",
    	contentType: 'application/json; charset=utf-8',
		dataType: "json",
		headers: {
			"Authorization": "Token " + getCookie('MeuToken')
		},
    	success: function(data) {
    		for(var i=0; i<data.length; i++){
    			if(data[i].vigencia.pk == sessionStorage.vigencia_pk){
    				alert("Você já possui uma unidade executora cadastrada nesta vigência.")
    				window.location.href = "aPrincipal.html";
    			}
    		}
    	},
    	error: function(data) {
        	console.log(data);
    	}
});

$(document).ready(function () {
	$.getJSON('estados_cidades.json', function (data) {
		var items = [];
		var options = '<option value="">escolha um estado</option>';	
		$.each(data, function (key, val) {
			options += '<option value="' + val.nome + '">' + val.nome + '</option>';
		});					
		$("#estados").html(options);				
		
		$("#estados").change(function () {				
		
			var options_cidades = '';
			var str = "";					
			
			$("#estados option:selected").each(function () {
				str += $(this).text();
			});
			
			$.each(data, function (key, val) {
				if(val.nome == str) {							
					$.each(val.cidades, function (key_city, val_city) {
						options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
					});							
				}
			});
			$("#cidades").html(options_cidades);
			
		}).change();		
	});
});

//exibir campos de estados e cidades, caso botão de radio for selecionado
// $("#radEst").click(function(event){
// 	$("#divEstados").show();
// 	$("#divCidades").hide();
// });
// $("#radMun").click(function(event){
// 	$("#divEstados").show();
// 	$("#divCidades").show();
// });

$("#botao-add-escola").click(function(event){
	
	event.preventDefault()

	form = document.querySelector("#Cria_escola");
	console.log(form);

	var data = ObtemEscoladoForm(form);	
	alert(data.classification_school)
	alert(data.tipo_escola)
	var Escola = {
		"name":String(data.NomeUniExe),
		"cnpj":String(data.CNPJ),
		"code":String(data.CodUniExe),
		"classification_school":String(data.classification_school),
		"city":String(data.city),
		"state":String(data.state),
		"type_school":String(data.tipo_escola),
		"director": sessionStorage.diretor_cpf,
		"vigencia": sessionStorage.vigencia_pk
	}

	var erros = ValidaEscola(data);

	if (erros.length > 0) {
		alert("Houve erro(s) no preenchimento do formulário")
		exibeMensagensDeErro(erros);
		return;
	}
	else 
	{
		$.ajax({
			method:"POST",
			url: String(global_link) + "escola/criar/",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(Escola),
			dataType: "json",
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function() {
	        	alert("Dados enviados!");
	        	form.reset();
	        	exibeMensagensDeErro(erros);
	        	window.location.replace("aPerfil.html");
	    	},
	    	error: function(data) {
	        	alert("Dados não enviados - ERRO !");
	        	console.log(data);
				exibeMensagensDeErro(erros);
	    	}
		});
	}
})


function ObtemEscoladoForm(form){

	var checkbox = document.getElementsByName('escola');
	var type_school = "";
	for(var i=0; i<checkbox.length; i++){
		if(checkbox[i].checked){
			type_school = type_school + checkbox[i].value + '/';
		}
	}
	if(type_school != "") type_school = type_school.substring(0, type_school.length-1);

	var Escola = {
		NomeUniExe: form.nomeEscola.value,
		CNPJ: form.cnpj.value,
		CodUniExe: form.code_exec.value,
		classification_school: form.class.value,
		city: form.cidades.value,
		state: form.estados.value,
		tipo_escola: type_school
	}

	return Escola;
}


function ValidaEscola(escola){
	var erros = [];

		if (escola.NomeUniExe.length == 0) {
			erros.push("Nome da Unidade Execultora nao pode ser em branco.");
		}
		if (escola.CNPJ.length == 0) {
			erros.push("CNPJ nao pode ser em branco.");
		}
		if (escola.CodUniExe.length == 0) {
			erros.push("Codigo da Unidade Execultora nao pode ser em branco");
		}
		if(escola.classification_school.length == 0){
			erros.push("Classificação da Escola nao pode ser em branco. Por favor, marque alguma!");
		}	
		if(escola.tipo_escola.length == 0){
			erros.push("Tipo da Escola nao pode ser em branco, Por Favor, marque alguma!");
		}
		if(escola.state.length==0){
			erros.push("Você precisa selecionar um estado");
		}
		else if(document.getElementById('radMun').checked){
			if(escola.city.length == 0){
				erros.push("Você precisa selecionar uma cidade");
			}
		}

	return erros;
}

function exibeMensagensDeErro(erros){
	var ul = document.querySelector("#mensagens-erro");
	ul.innerHTML = "";

	erros.forEach(function(erro){
		var li = document.createElement("li");
		li.textContent = erro;
		ul.appendChild(li);	
	});
}
