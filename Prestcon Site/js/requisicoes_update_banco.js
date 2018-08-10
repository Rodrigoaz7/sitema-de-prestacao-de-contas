// =========================== REQUISIÇÕES PARA MODAIS =============================
$("img[name=AdicionarConta]").click(function(){
	var botaoAddContaBancaria = document.querySelector("#botao-add-conta_modal");

	// ********************** FUNÇÕES PARA CADASTRO DE CONTAS BANCÁRIAS ************************
	botaoAddContaBancaria.addEventListener("click",function(event){

		event.preventDefault()

		var form = document.querySelector("#form-conta_modal");
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
			bank: form.name_modal.value,
			name: form.yname_modal.value,
			agencia: form.agency_modal.value,
			code: form.code_modal.value,
			account_number: form.number_modal.value,
			digito_agencia: form.digito_agency_modal.value,
			digito_account_number: form.digito_number_modal.value,
			digito_bank: form.bank_code_modal.value
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

});

$("img[name=AtualizarConta]").click(function(){

	sessionStorage.bank_pk = this.id;
	$.ajax({
		method:"GET",
		url: String(global_link) + "conta/"+this.id+"/",
		contentType: 'application/json; charset=utf-8',
		dataType: "json",
		headers: {
			"Authorization": "Token " + getCookie('MeuToken')
		},
		   success: function(data) {
		   		sessionStorage.vigencia_bank = data.vigencia.pk;
		   		sessionStorage.diretor_bank = data.director.username;

		       document.getElementById("bank_code").value = data.bank_code;
		       document.getElementById("name").value = data.bank;
		       document.getElementById("yname").value = data.name;
		       document.getElementById("code").value = data.code;
		       document.getElementById("agency").value = data.agencia;
		       document.getElementById("digito_agency").value = data.digito_agencia;
		       document.getElementById("number").value = data.account_number;
		       document.getElementById("digito_number").value = data.digito_account_number;
		   },
		   error: function(data) {
		       console.log("Erro na exibição dos dados desta conta bancária", data);
		   }
	});
});

$("img[name=DeletarConta]").click(function(){
	var answer = confirm("Deseja deletar esta conta bancária?");

	if(answer){
		$.ajax({
			method:"DELETE",
			url: String(global_link) + "conta/deletar/"+this.id+"/",
			async: false,
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
		   	success: function(data) {
		   		location.reload();
		   	},
		   	error: function(data) {
		       alert("Não foi possível deletar esta conta bancária!");
			   console.log(data);
		   }
		});
	}
});

document.querySelector("#botao-att-conta").addEventListener("click",function(event){
	event.preventDefault();
	form = document.querySelector("#form-att-conta");
	var data = obtemContaDoFormulario(form);

	var conta = 
	{
	    "account_number": String(data.account_number),
	    "digito_account_number": String(data.digito_number),
	    "bank_code": String(data.digito_bank),
	    "agencia": String(data.agencia),
	    "digito_agencia": String(data.digito_agencia),
	    "code": String(data.code),
	    "director": String(sessionStorage.diretor_bank),
	    "name": String(data.name),
	    "bank": String(data.bank),
	    "vigencia": parseInt(sessionStorage.vigencia_bank)
	}

	var erros = validaConta(data);

	if(erros.length > 0){
		alert("Houve erro(s) no preechimento do formulário")
		exibeMensagensDeErro(erros);
	}
	else
	{
		$.ajax({
			method:"PUT",
			url: String(global_link) + "conta/atualizar/"+sessionStorage.bank_pk+"/",
	    	data: JSON.stringify(conta), //Função para transformar o objeto em JSON
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function(data) {
	        	alert("Dados atualizados com sucesso!");
	        	window.location.href = "aPerfil.html";
	        	console.log(data);
	    	},
	    	error: function(data) {
	        	console.log("erro na atualização do banco", data);
	    	}
		});
	}

	function obtemContaDoFormulario(form) {
	
	var Conta = {
		bank: form.name.value,
		name: form.yname.value,
		agencia: form.agency.value,
		code: form.code.value,
		account_number: form.number.value,
		digito_agencia: form.digito_agency.value,
		digito_number: form.digito_number.value,
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
		if (conta.digito_number.length == 0) {
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
		var ul = document.querySelector("#mensagens-erro-banco");
		ul.innerHTML = "";

		erros.forEach(function(erro){
			var li = document.createElement("li");
			li.textContent = erro;
			ul.appendChild(li);	
		});
	}
});

// document.querySelector("#botao-add-conta").addEventListener("click",function(event){
// 	event.preventDefault();
// 	form = document.querySelector("#form-add-conta");
// 	var data = obtemContaDoFormulario(form);

// 	var conta = 
// 	{
// 	    "account_number": String(data.account_number),
// 	    "digito_account_number": String(data.digito_number),
// 	    "bank_code": String(data.digito_bank),
// 	    "agencia": String(data.agencia),
// 	    "digito_agencia": String(data.digito_agencia),
// 	    "code": String(data.code),
// 	    "director": String(sessionStorage.diretor_bank),
// 	    "name": String(data.name),
// 	    "bank": String(data.bank),
// 	    "vigencia": parseInt(sessionStorage.vigencia_bank)
// 	}

// 	var erros = validaConta(data);

// 	if(erros.length > 0){
// 		alert("Houve erro(s) no preechimento do formulário")
// 		exibeMensagensDeErro(erros);
// 	}
// 	else
// 	{
// 		$.ajax({
// 			method:"POST",
// 			url: String(global_link) + "conta/criar/",
// 	    	data: JSON.stringify(conta), //Função para transformar o objeto em JSON
// 	    	contentType: 'application/json; charset=utf-8',
// 			dataType: "json",
// 			headers: {
// 				"Authorization": "Token " + getCookie('token')
// 			},
// 	    	success: function(data) {
// 	        	alert("Dados enviados!");
// 	        	window.location.href = "aPerfil.html";
// 	        	console.log(data);
// 	    	},
// 	    	error: function(data) {
// 	        	console.log("erro na atualização do banco", data);
// 	    	}
// 		});
// 	}
// });


