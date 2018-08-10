var diretor;
$.ajax({
	method:"GET",
	url: String(global_link) + "diretor/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('token')
	},
	   success: function(data) {
	       diretor = data[0].name;
	   },
	   error: function() {
	       alert("Não há nenhum diretor logado");
	   }
});

$.ajax({
	method:"GET",
	url: String(global_link) + "conta/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('token')
	},
	   	success: function(data) {
	   		//Se houver um ou mais contas bancárias adicionadas, devemos mostra-las 
	   		// em uma caixa de seleção
	       	if(data.length > 0)
	       	{
	       		var select = document.getElementById('SelectBanco');
	       		for (var i = 0; i<data.length; i++){
				    var opt = document.createElement('option');
				    opt.value = data[i].name;
				    opt.innerHTML = data[i].name;
				    select.appendChild(opt);
				}
	       	}
	   	},
	   	error: function() {
	       alert("Não há contas bancárias cadastradas para este diretor");
	   	}
});


var BotaoAddCheque = document.querySelector("#botao-add-cheque");

BotaoAddCheque.addEventListener("click",function(event){

	event.preventDefault();

	var form = document.querySelector("#form-cheque");
	var data_ = obtemContaDoFormularioCheque(form);

	var cheque = 
	{
		"account": String(data_.number_of_account),
		"initial_numbers": String(data_.initial_numbers),
		"director": String(diretor),
		"last_numbers":String(data_.last_numbers),
		"vigencia": parseInt(sessionStorage.vigencia_pk)
	}

	var erros = validaCheque(data_);

	if (erros.length > 0) {
		alert("Houve erro(s) no preechimento do formulário");
		exibeMensagensDeErroCheque(erros);
	}
	else {
			$.ajax({
				method:"POST",
				url: String(global_link) + "bloco-cheques/criar/",
		    	data: JSON.stringify(cheque), //Função para transformar o objeto em JSON
		    	contentType: 'application/json; charset=utf-8',
				dataType: "json",
				headers: {
					"Authorization": "Token " + getCookie('token')
				},
		    	success: function(data) {
		        	console.log(data);
		        	alert("Dados enviados!");
		        	window.location.href = "aPerfil.html";
		        	form.retet();
		        	exibeMensagensDeErroCheque(erros);
		    	},
		    	error: function(data) {
		        	alert("Dados não enviados - ERRO !");
		        	console.log(data);
					exibeMensagensDeErroCheque(erros);
		    	}
		});
	}
})

function obtemContaDoFormularioCheque(form) {
	
	var j = 0

	var Cheque = {
		initial_numbers: form.FirstNumber.value,
		last_numbers: form.LastNumber.value,
		number_of_account: form.SelectBanco.value
	}

	return Cheque;
}

function validaCheque(cheque){
	
	var erros = [];

	if (cheque.initial_numbers.length == 0) {
		erros.push("a númeração inicial do cheque não pode ser em branco");
	}
	if (cheque.last_numbers.length == 0) {
		erros.push("a númeração final do cheque não pode ser em branco");
	}
	// Este  if está sendo sempre verdadeiro por algum motivo, então comentei.		
	// if (cheque.FNumber.value == cheque.LNumber.value) {
	// 	erros.push("O Valores inicial e final do cheque estão iguais");
	// }
	if (cheque.last_numbers.length < cheque.initial_numbers.length) {
		erros.push("a númeração final do cheque nao pode ser menor do que a numeração inicial");
	}
	if (cheque.number_of_account.length == 0) {
		erros.push("A agência não pode ser em branco, escolha uma opção");
	}

	return erros;
}

function exibeMensagensDeErroCheque(erros){
	var ul = document.querySelector("#mensagens-erro-cheque");
	ul.innerHTML = "";

	erros.forEach(function(erro){
		var li = document.createElement("li");
		li.textContent = erro;
		ul.appendChild(li);	
	});
}
