//Carregando estados e cidades
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
// 	$("#divCidades").show();
// });
// $("#radMun").click(function(event){
// 	$("#divEstados").show();
// 	$("#divCidades").show();
// });

var botaoAddDiretor = document.querySelector("#botao-add-diretor");

botaoAddDiretor.addEventListener("click",function(event){
	event.preventDefault()

	form = document.querySelector("#form-diretor");
	var data = obtemDiretorDoFormulario(form);
	
	var diretor = 
	{
		"director": {
	        "name": String(data.nome), 
	        "username": String(data.CPF),
	        "password": String(data.Senha),
	        "cnpj": String(data.CPF),
	        "email": String(data.EMail),
	        "telefone": String(data.Telefone)
	    },
	    "initial_date": String(data.DInical),
	    "final_date": String(data.DFinal),
	    "school": {
		    "name": String(data.nomeEscola),
		    "cnpj": String(data.cnpj),
		    "code": String(data.code),
		    "classification_school": String(data.classification_school),
		    "type_school": String(data.escola),
		    "state": String(data.state),
		    "city": String(data.city)
		}
	}

	var erros = validaDiretor(data);

	if(erros.length > 0){
		alert("Houve erro(s) no preechimento do formulário");
		exibeMensagensDeErro(erros);
		return;
	}
	else
	{
		$.ajax({
			method:"POST",
			url: String(global_link) + "diretor/criar/",
	    	data: JSON.stringify(diretor), //Função para transformar o objeto em JSON
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
	    	success: function(data) {
	        	alert("Dados enviados!");
	        	form.reset();
	        	console.log(data);
	        	exibeMensagensDeErro(erros);
	        	window.location.href = "gLogin.html";

	    	},
	    	error: function(data) {
	    		// if(data.responseJSON.director['username']){
	    		// 	alert(data.responseJSON.director['username'])
	    		// }
	    		// else if(data.responseJSON.director['email']){
	      //   		alert(data.responseJSON.director['email'])
	      //   	}
	      //   	else {
	        		alert("Erro ao enviar os dados, tente novamente")
	        	//}
	        	console.log(data);
				//exibeMensagensDeErro(erros);
	    	}
		});
	}
});

function obtemDiretorDoFormulario(form,texto,textoEscola) {
	var checkbox = document.getElementsByName('escola');
	var type_school = "";
	for(var i=0; i<checkbox.length; i++){
		if(checkbox[i].checked){
			type_school = type_school + checkbox[i].value + '/';
		}
	}
	if(type_school != "") type_school = type_school.substring(0, type_school.length-1);

	var Diretor = {
		//username: form.username.value,
		nome: form.nome.value,
		cnpj: form.cnpj.value,
		EMail: form.EMail.value,
		CPF: form.CPF.value,
		Telefone: form.Telefone.value,
		Senha: form.Senha.value,
		ConfirmaSenha: form.ConfirmeSenha.value,
		DInical: form.datainicial.value,
		DFinal: form.datafinal.value,
		nomeEscola: form.nomeEscola.value,
		slugEscola: textoEscola,
		code: form.code_exec.value,
		classification_school: form.class.value,
		escola: type_school,
		city: form.cidades.value,
		state: form.estados.value,
		tipo_escola: form.class.value
	}

	return Diretor;
}

function validaDiretor(diretor){
	
	var erros = [];

	if (diretor.code.length == 0) {
		erros.push("O usarname não pode ser em branco");
	}
	if (diretor.nome.length == 0) {
		erros.push("O nome não pode ser em branco");
	}
	if (diretor.EMail.length == 0) {
		erros.push("O EMail não pode ser em branco");
	}
	if (diretor.CPF.length == 0) {
		erros.push("O CPF não pode ser em branco");
	}
	if (TestaCPF(diretor.CPF) == false) {
		erros.push("O CPF não é valido, por favor digite um CPF valido!");
	}
	if (diretor.Telefone.length == 0) {
		erros.push("O Telefone não pode ser em branco");
	}
	if (diretor.Senha.length < 6) {
		erros.push("Senha muito curta");
	}
	if (diretor.Senha.length > 50) {
		erros.push("Senha muito longa");
	}
	if (diretor.ConfirmaSenha.length < 6) {
		erros.push("Senha muito curta");
	}
	if (diretor.Senha.search(/\d/) == -1 || diretor.Senha.search(/[a-zA-Z]/) == -1){
		erros.push("Senha muito fraca. Você deve inserir uma senha com números e letras.")
	}
	if (diretor.DInical.length == 0) {
		erros.push("A Data Incial está em branco. Por favor, adicione alguma data")
	}
	if (diretor.DFinal.length == 0) {
		erros.push("A Data Final está em branco. Por favor, adicione alguma data")
	}
	if (diretor.DInicial == diretor.DFinal) {
		erros.push("A Data estão iguais. Por favor, altere alguma")
	}	
	if (diretor.nomeEscola.length == 0) {
		erros.push("O nome da escola não pode ser em branco");
	}
	if (diretor.cnpj.length == 0) {
		erros.push("O CNPJ da escola não pode ser em branco");
	}
	if (diretor.escola.length == 0) {
		erros.push("Você precisa marcar um tipo de escola");
	}
	if (diretor.tipo_escola.length == 0) {
		erros.push("Você precisa marcar uma classificação da escola");
	}
	if (diretor.Senha != diretor.ConfirmaSenha) {
		erros.push("Senhas não batem");
	}
	if(diretor.state.length==0){
		erros.push("Você precisa selecionar um estado");
	}
	else if(document.getElementById('radMun').checked){
		if(diretor.city.length == 0){
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

function TestaCPF(strCPF) {
  	var Soma;
    var Resto;
    Soma = 0;
	
    for(var i=0; i<strCPF.length; i++){
  		strCPF = strCPF.replace('.','');
   		strCPF = strCPF.replace('-','');
   	}
  	console.log(strCPF);

	if (strCPF == "00000000000") return false;
    
	for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
	Resto = (Soma * 10) % 11;
	
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
	
	Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
	
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

