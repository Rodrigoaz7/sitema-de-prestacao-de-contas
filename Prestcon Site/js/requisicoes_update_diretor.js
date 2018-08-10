//ID do diretor
var id=0;
//alert(document.cookie)
$.ajax({
	method:"GET",
	url: String(global_link) + "diretor/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		id = data.user.pk;
	       document.getElementById("nome").value = data.user.name;
	       document.getElementById("EMail").value = data.user.email;
	       document.getElementById("CPF").value = data.user.username;
	       document.getElementById("Telefone").value = data.user.telefone;
	   },
	   error: function() {
	       alert("Não há nenhum diretor logado");
	   }
});

var botaoAddDiretor = document.querySelector("#botao-update-diretor");

botaoAddDiretor.addEventListener("click",function(event){
	event.preventDefault();
	form = document.querySelector("#form-update-diretor");
	var texto_para_slug = "diretor"

	var data = obtemDiretorDoFormulario(form);

	var diretor = 
	{
	    "name": String(data.nome), //"name": data.nome, ...
	    "username": String(data.CPF),
	    "password": String(data.Senha),
	    "slug": String(data.slug),
	    "email": String(data.EMail),
	    "telefone": String(data.Telefone)
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
			method:"PUT",
			url: String(global_link) + "diretor/atualizar/"+id+"/",
	    	data: JSON.stringify(diretor), //Função para transformar o objeto em JSON
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

function obtemDiretorDoFormulario(form) {
	var texto = "diretor_qualquer";
	var Diretor = {
		//username: form.username.value,
		nome: form.nome.value,
		slug: texto,
		EMail: form.EMail.value,
		CPF: form.CPF.value,
		Telefone: form.Telefone.value,
		Senha: form.Senha.value,
		ConfirmaSenha: form.ConfirmeSenha.value,
	}

	return Diretor;
}

function validaDiretor(diretor){
	
	var erros = [];

	if (diretor.nome.length == 0) {
		erros.push("O nome não pode ser em branco");
	}
	if (diretor.EMail.length == 0) {
		erros.push("O EMail não pode ser em branco");
	}
	if (diretor.CPF.length == 0) {
		erros.push("O CPF não pode ser em branco");
	}
	if (diretor.Telefone.length == 0) {
		erros.push("O Telefone não pode ser em branco");
	}
	if (diretor.Senha != diretor.ConfirmaSenha) {
		erros.push("Senhas não batem");
	}
	if (diretor.Senha.length == 0) {
		erros.push("O Senha não pode ser em branco");
	}
	if (diretor.ConfirmaSenha.length == 0) {
		erros.push("O Confirma Senha não pode ser em branco");
	}

	return erros;
}

function exibeMensagensDeErro(erros){
	var ul = document.querySelector("#mensagens-erro-diretor");
	ul.innerHTML = "";

	erros.forEach(function(erro){
		var li = document.createElement("li");
		li.textContent = erro;
		ul.appendChild(li);	
	});
}
