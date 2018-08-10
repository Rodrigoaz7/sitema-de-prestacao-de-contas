var escola=null;

$.ajax({
	method:"GET",
	url: String(global_link) + "fornecedor/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	       document.getElementById("Nome-Fornececedor").innerHTML = data[0].Nome;
	       document.getElementById("CNPJ-Fornecedor").innerHTML = data[0].CNPJ;
	       document.getElementById("CPF-Fornecedor").innerHTML = data[0].Email;
	       document.getElementById("Telefone-Fornecedor").innerHTML = data[0].Telefone;
	       document.getElementById("Endereço-Fornecedor").innerHTML = data[0].Endereço;
	   },
	   error: function(data) {
	       console.log(data);
	   }
});

$.ajax({
	method:"GET",
	url: String(global_link) + "escola/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		console.log("ok")
	    	for(var i=0; i<data.length; i++){
	    		if(data[i].vigencia.pk == sessionStorage.vigencia_pk){
	    			escola = data[i];
	    		}
	    	}

	   },
	   error: function(data) {
	       console.log(data);
	   }
});

$("#botaoFornecedor").click(function(event){

	event.preventDefault();

	var form = document.querySelector("#Form-Fornecedor");

	var data = obtemForncedorDoFormulario(form);

	var Fornecedor = {
		"name": String(data.Nome),
		"cnpj": String(data.CNPJ),
		"email": String(data.EMAIL),
		"telefone": String(data.Telefone),
		"endereco": String(data.Endereço),
		"vigencia": parseInt(sessionStorage.vigencia_pk),
		"school": parseInt(escola.pk)
	}

	var erros = validaForncedor(data);

	if (erros.length > 0) {
		alert("Houve erro(s) no preenchimento do formulário")
		exibeMensagensDeErro(erros);
		return;
	}
	else 
	{
		$.ajax({
			method:"POST",
			url: String(global_link) + "fornecedor/criar/",
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(Fornecedor),
			dataType: "json",
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function() {
	        	alert("Dados enviados!");
	        	window.location.href="bFornecedores.html";
	        	form.reset();
	        	exibeMensagensDeErro(erros);
	    	},
	    	error: function(data) {
	        	alert("Dados não enviados - ERRO !");
	        	console.log(data);
				exibeMensagensDeErro(erros);
	    	}
		});
	}


})

function obtemForncedorDoFormulario(form) {
	
	var Fornecedor = {
		Nome: form.NomeForn.value,
		CNPJ: form.CNPJ.value,
		EMAIL: form.EMAIL.value,
		Telefone: form.Telefone.value,
		Endereço: form.Endereco.value, 
	}

	return Fornecedor;
}

function validaForncedor(fornecedor){
	
	var erros = [];

	if (fornecedor.Nome.length == 0) {
		erros.push("O Nome do Fornecedor não pode ser em branco");
	}
	if (fornecedor.CNPJ.length == 0) {
		erros.push("O CNPJ não pode ser em branco");
	}
	if (fornecedor.EMAIL.length == 0) {
		erros.push("O E-mail não pode ser em branco");
	}
	if (fornecedor.Telefone.length == 0) {
		erros.push("O Telefone não pode ser em branco");
	}
	if (fornecedor.Endereço.length == 0) {
		erros.push("O Endereço não pode ser em branco");
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