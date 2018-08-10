document.querySelector("#ButtonRecovery").addEventListener("click",function(event){
	
	event.preventDefault()
	form = document.querySelector("#formEmail");

	$.ajax({
		method:"POST",
		url: String(global_link) + "diretor/recuperar-senha/",
    	data: JSON.stringify(form.InputEmail.value), //Função para transformar o objeto em JSON
    	contentType: 'application/json; charset=utf-8',
		dataType: "json",
    	success: function(data) {
        	alert("Um e-mail contendo uma nova senha foi enviado para você");
        	window.location.href = "gLogin.html";
    	},
    	error: function(data) {
    		alert("Não há nenhum diretor cadastrado com este e-mail")
    	}
	});

});