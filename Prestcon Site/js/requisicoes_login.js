//Se há um cookie cadastrado, devemos testar se ele ainda é válido ou não
if (getCookie('MeuToken') != "")
{
	$.ajax({
			method:"POST",
			url: String(global_link) + "diretor/test-token/",
	    	data: JSON.stringify(getCookie('MeuToken')),
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
	    	success: function(data) {
	        	window.location.href = "aPrincipal.html";
	        	console.log(data);
	    	},
	    	error: function(data) {
	        	console.log(data);
	    	}
	});
}

var botaoLogin= document.querySelector("#entrar");

botaoLogin.addEventListener("click",function(event){
	$("#loading").show();

	event.preventDefault()

	var form = document.querySelector("#form-login");
	var data_form = obtemContaDoFormulario(form);

	var conta = 
	{
	    "username": String(data_form.username),
	    "password": String(data_form.password)
	}

	var erros = validaConta(data_form);

	if(erros.length > 0){
		$("#loading").hide();
		alert("Houve erro(s) no preechimento do formulário")
		exibeMensagensDeErro(erros);
	}
	else
	{
		$.ajax({
			method:"POST",
			url: String(global_link) + "api-token-expired-auth/",
	    	data: JSON.stringify(conta), //Função para transformar o objeto em JSON
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
	    	success: function(data) {
	        	//document.cookie = data.token + expires;
	        	createCookie('MeuToken', data.token, 1);

	        	$.ajax({
					method:"GET",
					url: String(global_link) + "vigencia/",
					contentType: 'application/json; charset=utf-8',
					dataType: "json",
					async: false,
					headers: {
						"Authorization": "Token " + getCookie('MeuToken')
					},
				   	success: function(data) {
					   	if(data.length > 0)
					   	{
					   		SetVigencia(data[0]);
						}
				   },
				   	error: function(data) {
				   		console.log(data);
				   	}
				});

				$("#loading").hide();
	        	window.location.href = "aPrincipal.html";
	        	//console.log(data);
	    	},
	    	error: function(data) {
	    		$("#loading").hide();
	        	if(data.status == 0)
	        	{
	        		alert("Erro no servidor, tente novamente mais tarde");
	        	}
	        	else
	        	{
	        		alert("Usuário não existe");
	        	}
	        	console.log(data);
	    	}
		});
	}
});

function obtemContaDoFormulario(form) {
	
	var Conta = {
		username: form.inputUsername.value,
		password: form.inputPassword.value
	}

	return Conta;
}

function validaConta(conta){
	
	var erros = [];

	if (conta.username.length == 0 ) {
		erros.push("O username não pode ser em branco");
	}
	if (conta.password.length == 0) {
		erros.push("A senha não pode ser em branco");
	}
	if (conta.password.length > 0 && conta.password.length < 6) {
		erros.push("A senha é muito curta");
	}

	return erros;
}

function exibeMensagensDeErro(erros){
	var ul = document.querySelector("#mensagens-erro");
	//ul.innerHTML = "";

	erros.forEach(function(erro){
		var li = document.createElement("li");
		li.textContent = erro;
		ul.appendChild(li);	
	});
}