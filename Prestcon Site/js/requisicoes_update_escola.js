//exibir campos de estados e cidades, caso botão de radio for selecionado
$("#radEst").click(function(event){
	$("#divEstados").show();
	$("#divCidades").show();
});
$("#radMun").click(function(event){
	$("#divEstados").show();
	$("#divCidades").show();
});

$(document).ready(function () {
	$.getJSON('estados_cidades.json', function (data) {
		var items = [];
		var options = '<option value="">escolha um estado</option>';	
		$.each(data, function (key, val) {
			options += '<option value="' + val.nome + '">' + val.nome + '</option>';
		});					
		$("#estados").html(options);				
		
		$("#estados").click(function () {				
		
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

// =========================== REQUISIÇÕES PARA MODAIS =============================
$("img[name=AtualizarEscola]").click(function(){
	
	sessionStorage.escola_pk = this.id;
	
	$.ajax({
		method:"GET",
		url: String(global_link) + "escola/" + this.id + "/",
		contentType: 'application/json; charset=utf-8',
		dataType: "json",
		headers: {
			"Authorization": "Token " + getCookie('MeuToken')
		},
		   success: function(data) {
		   		console.log("sucesso", data);
		   		//sessionStorage.director = data.director.username;

		       document.getElementById("nomeEscola").value = data.name;
		       document.getElementById("cnpj").value = data.cnpj;
		       document.getElementById("code_exec").value = data.code;
		       document.getElementById('estados').value=data.state;
		       $("#estados").click();


		       if(data.classification_school == "estadual"){
		       	document.getElementById("radEst").checked = true;
		       	//document.getElementById("divCidades").style.display = "none";

		       }
		       else{
		       	document.getElementById("radMun").checked = true;
		       	document.getElementById('cidades').value=data.city;
		       	//document.getElementById("divCidades").style.display = "block";
		       	//document.getElementById("divEstados").style.display = "block";
		       }

		       if(data.type_school.search("Creche") !== -1){
		       	document.getElementById('c').checked = true;
		       } else document.getElementById('c').checked = false;
		       if(data.type_school.search("Pré-Escola") !== -1){
		       	document.getElementById('pe').checked = true;
		       } else document.getElementById('pe').checked = false;
		       if(data.type_school.search("Escola") !== -1){
		       	document.getElementById('e').checked = true;
		       } else document.getElementById('e').checked = false;

		   },
		   error: function(data) {
		       console.log(data);
		   }
	});
});


document.querySelector("#botao-att-escola").addEventListener("click",function(event){
	event.preventDefault();
	form = document.querySelector("#form-att-escola");

	var data = obtemEscolaDoFormulario(form);

	var escola = 
	{
	    "name": String(data.nomeEscola),
	    "cnpj": String(data.CNPJ),
	    "code": String(data.code_exec),
	    "state": String(data.state),
	    "city": String(data.city),
	    "type_school": String(data.escola),
	    "classification_school": String(data.tipo_escola),
	    "vigencia": parseInt(sessionStorage.vigencia_pk),
	    "director": String(sessionStorage.diretor_cpf)
	}

	var erros = validaEscola(data);

	if(erros.length > 0){
		alert("Houve erro(s) no preechimento do formulário");
		exibeMensagensDeErro(erros);
		return;
	}
	else
	{
		$.ajax({
			method:"PUT",
			url: String(global_link) + "escola/atualizar/"+sessionStorage.escola_pk+"/",
	    	data: JSON.stringify(escola), //Função para transformar o objeto em JSON
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
			async: false,
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function() {
	        	alert("Dados atualizados com sucesso!");
	        	window.location.href = "aPerfil.html";
	        	console.log(data);
	    	},
	    	error: function(data) {
	    		console.log(data)
	        	alert("erro");
	    	}
		});
	}
});

function obtemEscolaDoFormulario(form) {
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
		nomeEscola: form.nomeEscola.value,
		code_exec: form.code_exec.value,
		CNPJ: form.cnpj.value,
		tipo_escola: form.class.value,
		escola: type_school,
		state: form.estados.value,
		city: form.cidades.value,
	}

	return Diretor;
}

function validaEscola(diretor){
	
	var erros = [];

	if (diretor.nomeEscola.length == 0) {
		erros.push("O nome não pode ser em branco");
	}
	if (diretor.code_exec.length == 0) {
		erros.push("O código não pode ser em branco");
	}
	if (diretor.CNPJ.length == 0) {
		erros.push("O CNPJ não pode ser em branco");
	}
	if (diretor.escola.length == 0) {
		erros.push("Você precisa marcar um tipo de escola");
	}
	if (diretor.tipo_escola.length == 0) {
		erros.push("Você precisa marcar uma classificação da escola");
	}
	if(diretor.state.length==0){
		erros.push("Você precisa selecionar um estado");
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



