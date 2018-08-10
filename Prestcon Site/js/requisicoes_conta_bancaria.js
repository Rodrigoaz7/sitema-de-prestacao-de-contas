$.ajax({
	method:"GET",
	url: String(global_link) + "diretor/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		sessionStorage.diretor = data.user.username;
	   },
	   error: function() {
	       alert("Não foi possível receber dados do servidor ! ");
	   }
});

var botaoAddContaBancaria = document.querySelector("#botao-add-conta");

// ********************** FUNÇÕES PARA CADASTRO DE CONTAS BANCÁRIAS ************************
botaoAddContaBancaria.addEventListener("click",function(event){

	event.preventDefault()

	var form = document.querySelector("#form-conta");
	var data = obtemContaDoFormulario(form);

	var conta = 
	{
	    "account_number": String(data.account_number),
	    "digito_account_number": String(data.digito_account_number),
	    "bank_code": String(data.digito_bank),
	    "agencia": String(data.agencia),
	    "digito_agencia": String(data.digito_agencia),
	    "code": String(data.code),
	    "director": String(sessionStorage.diretor),
	    "name": String(data.name),
	    "bank": String(data.bank),
	    "vigencia": parseInt(sessionStorage.vigencia_pk)
	}

	var erros = validaConta(data);

	if(erros.length > 0){
		alert("Houve erro(s) no preechimento do formulário")
		exibeMensagensDeErro(erros);
	}
	else
	{
		$.ajax({
			method:"POST",
			url: String(global_link) + "conta/criar/",
	    	data: JSON.stringify(conta), //Função para transformar o objeto em JSON
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function(data) {
	        	alert("Dados enviados!");
	        	window.location.href="aPerfil.html";
	        	document.getElementById("form-conta").reset();
	        	var ul = document.querySelector("mensagens-erro");
	        	ul.innerHTML = "";
	        	console.log(data);
	    	},
	    	error: function(data) {
	        	alert("Dados não enviados - ERRO !");
	        	console.log(data);
				var ul = document.querySelector("#mensagens-erro");
	        	ul.innerHTML = "";
	    	}
		});
	}
});

function obtemContaDoFormulario(form) {
	
	var Conta = {
		bank: form.name.value,
		name: form.yname.value,
		agencia: form.agency.value,
		code: form.code.value,
		account_number: form.number.value,
		digito_agencia: form.digito_agency.value,
		digito_account_number: form.digito_number.value,
		digito_bank: form.bank_code.value
	}

	return Conta;
}

function validaConta(conta){
	
	var erros = [];

	if (conta.account_number.length == 0) {
		erros.push("O número da conta não pode ser em branco");
	}
	if (conta.digito_bank.length == 0) {
		erros.push("O nome do banco não pode ser em branco");
	}
	if (conta.digito_account_number.length == 0) {
		erros.push("O nome do banco não pode ser em branco");
	}
	if (conta.digito_agencia.length == 0) {
		erros.push("O nome do banco não pode ser em branco");
	}
	if (conta.bank.length == 0) {
		erros.push("O nome do banco não pode ser em branco");
	}
	if (conta.name.length == 0) {
		erros.push("O seu nome não pode ser em branco");
	}
	if (conta.agencia.length == 0) {
		erros.push("A agência não pode ser em branco");
	}
	if (conta.code.length == 0) {
		erros.push("O código não pode ser em branco");
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

// ======================= AUTO-COMPLETE DOS BANCOS ===================================
//Função disparada quando usuário digitar algo no campo de código do banco
function GetBanco() {
	$.getJSON('bancos-array.json', function (data) {
		$.each(data, function( key, val ) {
			//Prevenindo de exibir bancos não válidos (códigos nulos)
			if($("#bank_code").val() == "") {
				$("#name").val("");
				return true;
			}
			//Se o código existir, então exiba o nome do banco e finalize a consulta
			else if($("#bank_code").val() == val.codigo){
				$("#name").val(val.nome);
				return false;
			}
			//Se o código dessa iteração não bater, então esvazie a exibição e pule a iteração
			else
			{
				$("#name").val("");
				return true;
			}
		});
	});
}

//Função disparada quando usuário digitar algo no campo de código do banco
function GetCodigo() {
	$.getJSON('bancos-array.json', function (data) {
		$.each(data, function( key, val ) {
			//Se o nome existir, então exiba o código do banco e finalize a consulta
			if($("#name").val().toLowerCase() == val.nome.toLowerCase()){
				$("#bank_code").val(val.codigo);
				return false;
			}
			//Se o nome dessa iteração não bater, então esvazie a exibição e pule a iteração
			else
			{
				$("#bank_code").val("");
				return true;
			}
		});
	});
}

//Função disparada quando usuário digitar algo no campo de código do banco
function GetBancoModal() {
	$.getJSON('bancos-array.json', function (data) {
		$.each(data, function( key, val ) {
			//Prevenindo de exibir bancos não válidos (códigos nulos)
			if($("#bank_code_modal").val() == "") {
				$("#name_modal").val("");
				return true;
			}
			//Se o código existir, então exiba o nome do banco e finalize a consulta
			else if($("#bank_code_modal").val() == val.codigo){
				$("#name_modal").val(val.nome);
				return false;
			}
			//Se o código dessa iteração não bater, então esvazie a exibição e pule a iteração
			else
			{
				$("#name_modal").val("");
				return true;
			}
		});
	});
}

//Função disparada quando usuário digitar algo no campo de código do banco
function GetCodigoModal() {
	$.getJSON('bancos-array.json', function (data) {
		$.each(data, function( key, val ) {
			//Se o nome existir, então exiba o código do banco e finalize a consulta
			if($("#name_modal").val().toLowerCase() == val.nome.toLowerCase()){
				$("#bank_code_modal").val(val.codigo);
				return false;
			}
			//Se o nome dessa iteração não bater, então esvazie a exibição e pule a iteração
			else
			{
				$("#bank_code_modal").val("");
				return true;
			}
		});
	});
}