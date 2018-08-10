$.ajax({
	method:"GET",
	url: String(global_link) + "vigencia/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	//async: false,
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
   	success: function(data) {
   	if(data.length > 0)
   	{
		var link = document.getElementById('divVigencia');
		for(var i=0; i<data.length; i++)
		{
			var a = document.createElement('a');
			a.classList.add('dropdown-item');
			//a.setAttribute('href','#');

			a.innerHTML = String(data[i].initial_date) + " / " + String(data[i].final_date);
			var radio = document.createElement('input');
			radio.type = "radio";
			radio.name = "radio";
			radio.value = String(data[i].initial_date) + " / " + String(data[i].final_date);
			radio.id = data[i].pk;
			radio.style.margin = '5%';

			radio.onclick = function(){
				sessionStorage.vigencia = $('input[name="radio"]:checked').val();
				sessionStorage.vigencia_pk = $('input[name="radio"]:checked').attr('id');
				document.getElementById('VigenciaAtual').innerHTML = sessionStorage.vigencia;
				location.reload();
			};
			
			a.appendChild(radio);
			link.appendChild(a);
		}
	}
	
	//if(sessionStorage.vigencia) document.getElementById('VigenciaAtual').innerHTML = sessionStorage.vigencia;
	//else document.getElementById('VigenciaAtual').innerHTML = "Por favor, escolha uma vigência";
	
	if(sessionStorage.vigencia)
	{
		var radios = document.getElementsByName("radio");

		for(var i=0; i<radios.length; i++)
		{
			if(radios[i].value == sessionStorage.vigencia)
			{
				radios[i].checked = true;
				break;
			}
		}

		document.getElementById('VigenciaAtual').innerHTML = sessionStorage.vigencia;
	}
	else
	{
	  console.log("Setando vigência sem login");
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

		        var radios = document.getElementsByName("radio");

				for(var i=0; i<radios.length; i++)
				{
					if(radios[i].value == sessionStorage.vigencia)
					{
						radios[i].checked = true;
						break;
					}
				}

				document.getElementById('VigenciaAtual').innerHTML = sessionStorage.vigencia;
	        }
	     },
	      error: function(data) {
	        console.log('erro em set de vigencia', data);
	      }
	  });
	}
   },
   error: function(data) {
   		console.log(data);
   		if(data.responseJSON['detail'] == "Token has expired")
   		{
   			alert("Sua sessão expirou, logue novamente");
   			window.location.href="gLogin.html";
   		}
   }
});




// ============================== CADASTRO DE VIGÊNCIA ==================================
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
	error: function(data) {
    	console.log(data);
	}
});


document.querySelector("#botaoVigencia").addEventListener("click",function(event){
	event.preventDefault()

	var form = document.querySelector("#form-vigencia");
	var data = obtemContaDoFormulario(form);

	var vigencia = 
	{
	    "initial_date": String(data.final_date),
	    "final_date": String(data.initial_date),
	    "director": String(sessionStorage.diretor)
	}

	var erros = validaVigencia(data);

	if(erros.length > 0){
		alert("Houve erro(s) no preechimento do formulário")
		exibeMensagensDeErro(erros);
	}
	else
	{
		$.ajax({
			method:"POST",
			url: String(global_link) + "vigencia/criar/",
	    	data: JSON.stringify(vigencia), //Função para transformar o objeto em JSON
	    	contentType: 'application/json; charset=utf-8',
			dataType: "json",
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function(data) {
	        	alert("Dados enviados!");
	        	window.location.href = "aPrincipal.html";
	    	},
	    	error: function(data) {
	        	alert("Dados não enviados - ERRO !");
	        	console.log(data);
				var ul = document.querySelector("#mensagens-erro");
	        	ul.innerHTML = "";
	    	}
		});
	}
	
	function obtemContaDoFormulario(form) {
	
		var Conta = {
			initial_date: form.inputInit.value,
			final_date: form.inputFinal.value
		}

		return Conta;
	}

	function validaVigencia(vig){
		
		var erros = [];

		if (vig.initial_date.length == 0) {
			erros.push("Data não pode ser nula");
		}
		if (vig.final_date.length == 0) {
			erros.push("Data não pode ser nula");
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
