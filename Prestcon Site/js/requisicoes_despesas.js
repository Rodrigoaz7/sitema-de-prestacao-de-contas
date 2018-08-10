var lista_fornecedores = []; //Lista de teste para fornecedores via API externa
var escola_da_despesa;

$.ajax({
	method:"GET",
	url: String(global_link) + "escola/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		if(data.length > 0)
	       	{
	       		var select = document.getElementById('SelectSchool');
	       		for (var i = 0; i<data.length; i++){
	       			if(data[i].vigencia.pk == sessionStorage.vigencia_pk){
	       				escola_da_despesa = data[i].pk;
					    var opt = document.createElement('option');
					    opt.value = data[i].name;
					    opt.innerHTML = data[i].name;
					    select.appendChild(opt);
					}
				}
	       	}
	   },
	   error: function() {
	       alert("Não foi possível receber escolas cadastradas do servidor ! ");
	   }
});

$.ajax({
	method:"GET",
	url: String(global_link) + "conta/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		if(data.length > 0)
	       	{
	       		var select = document.getElementById('SelectBanco');
	       		for (var i = 0; i<data.length; i++){
				    var opt = document.createElement('option');
				    opt.value = data[i].pk;
				    opt.innerHTML = data[i].name;
				    select.appendChild(opt);
				}
	       	}
	   },
	   error: function() {
	       alert("Não foi possível receber bancos cadastrados do servidor ! ");
	   }
});

$.ajax({
	method:"GET",
	url: String(global_link) + "fornecedor/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		if(data.length > 0)
	       	{
	       		console.log(data);
	       		var select = document.getElementById('SelectFornecedor');
	       		for (var i = 0; i<data.length; i++){
	       			if(data[i].vigencia == sessionStorage.vigencia_pk)
	       			{
	       				lista_fornecedores.push(data[i].cnpj);
					    var opt = document.createElement('option');
					    opt.value = data[i].cnpj;
					    opt.innerHTML = data[i].name + " [" + data[i].cnpj + "]";
					    select.appendChild(opt);
					}
				}
	       	}
	   },
	   error: function(data) {
	   		console.log(data);
	   }
});


$("#botaoDespesa").click(function(event){
	
	event.preventDefault()

	form = document.querySelector("#Form-Despesa");
	console.log(form);

	var data = ObtemDespesasdoForm(form);
	var formdata = new FormData();

	if(form.TNFiscal.value == "Manual"){
		var numero_de_produtos = document.getElementById('tableProduto').rows.length-1;
		var name_produto = [];
		var valor_produto_unitario = [];
		var valor_produto_total = [];
		var unidades_produto = [];
		var tipo_unidade = [];

		//Envio de nota fiscal manual
		$("input[name='inputNomeProduto']").each(function() {
		    name_produto.push($(this).val());
		});
		formdata.append("name", JSON.stringify(name_produto));
		$("input[name='inputValorUnitarioProduto']").each(function() {
		    valor_produto_unitario.push($(this).val().replace(",","."));
		});
		formdata.append("valor_unitario", JSON.stringify(valor_produto_unitario));
		$("input[name='inputValorTotalProduto']").each(function() {
		    valor_produto_total.push($(this).val().replace(",","."));
		});
		formdata.append("valor_total", JSON.stringify(valor_produto_total));
		$("input[name='inputUnidadeProduto']").each(function() {
		    unidades_produto.push($(this).val());
		});
		formdata.append("unidades", JSON.stringify(unidades_produto));
		$("input[name='inputTipoUnidadeProduto']").each(function() {
		    tipo_unidade.push($(this).val());
		});
		formdata.append("tipo_unidade", JSON.stringify(tipo_unidade));
		formdata.append("num_produtos", numero_de_produtos);
		//fim do envio de nota fiscal manual
	}
	else if(form.TDoc.value == "Nota Fiscal" && form.TNFiscal.value == "Eletrônica"){
		var name_produto = [];
		var valor_produto_unitario = [];
		var valor_produto_total = [];
		var unidades_produto = [];
		var tipo_unidade = [];
		var cst = [];
		var ncm = [];
		var cfop = [];
		
		$.ajax({
			method:"POST",
			url: String(global_link) + "despesa/nfeio/",
			contentType: 'application/json; charset=utf-8',
			dataType: "json",
			beforeSend: function() {
				$('#loadingmessage').show();
				$('#botaoDespesa').prop("disabled", true);
			},
			async: false,
			data: JSON.stringify(form.CodigodeBarra.value),
			//data: JSON.stringify('35110943708379006485550020002812481000000017'),
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
			   success: function(data) {
			   	//Envio de nota fiscal eletrônica
			   	for(var i=0; i<data['items'].length; i++){
					name_produto.push(data['items'][i].description.substr(0, data['items'][i].description.indexOf('|')));
					valor_produto_unitario.push(data['items'][i].unitAmount);
					valor_produto_total.push(data['items'][i].totalAmount);
					unidades_produto.push(data['items'][i].quantity);
					tipo_unidade.push(data['items'][i].unitTax);
					ncm.push(data['items'][i].ncm);
					cst.push(data['items'][i].tax.icms.origin+data['items'][i].tax.icms.cst);
					cfop.push(data['items'][i].cfop);
			   	}

			   	formdata.append("name", JSON.stringify(name_produto));
				formdata.append("valor_unitario", JSON.stringify(valor_produto_unitario));
				formdata.append("valor_total", JSON.stringify(valor_produto_total));
				formdata.append("unidades", JSON.stringify(unidades_produto));
				formdata.append("tipo_unidade", JSON.stringify(tipo_unidade));
				formdata.append("ncm", JSON.stringify(ncm));
				formdata.append("cst", JSON.stringify(cst));
				formdata.append("cfop", JSON.stringify(cfop));
				formdata.append("num_produtos", data['items'].length);

				if(lista_fornecedores.indexOf(data['transport'].transportGroup.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")) > -1){
					formdata.append("fornecedor", data['transport'].transportGroup.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"));
				}
				else{

					//Pegando fornecedor da API externa
					var new_fornecedor = 
					{
						"name": String(data['transport'].transportGroup.name),
						"cnpj": String(data['transport'].transportGroup.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")),
						"email": "",
						"telefone": "",
						"endereco": String(data['transport'].transportGroup.fullAddress),
						"vigencia": parseInt(sessionStorage.vigencia_pk),
						"school": parseInt(escola_da_despesa)
					}

					$.ajax({
						method:"POST",
						url: String(global_link) + "fornecedor/criar/",
				    	data: new_fornecedor,
				    	async: false,
						headers: {
							"Authorization": "Token " + getCookie('MeuToken')
						},
				    	success: function(data) {
				        	console.log(data);
				        	formdata.append("fornecedor", data.cnpj);
					   	},
					   error: function(data) {
					   		console.log(data);
					   }
					});
				}
			},
			error: function(data){
				alert("Erro na requisição ao código DANFE")
				$('#loadingmessage').hide();
				$('#botaoDespesa').prop("disabled", false);
			}
		});
	}
	
	formdata.append("num_comprovante_pag", data.num_pag);
	formdata.append("tipo_despesa", data.tipo_despesa);
	formdata.append("tipo_documento", data.tipo_documento);
	formdata.append("tipo_nota_fiscal", data.tipo_nota_fiscal);
	formdata.append("school", data.school);
	formdata.append("num_pag", data.num_pag);
	formdata.append("data_comprovante_pag", data.data_pag);
	formdata.append("bank", data.bank);
	formdata.append("vigencia", sessionStorage.vigencia_pk);

	// Trabalhando com envio de arquivos
	if(document.getElementById('radioNf').checked && data.file_nf.value != ""){
		formdata.append('file_tipo_documento', $('#InputNf').get(0).files[0]);
	}
	else if(document.getElementById('radioRec').checked && data.file_recibo.value != ""){
		formdata.append('file_tipo_documento', $('#InputRec').get(0).files[0]);
	}
	else if(document.getElementById('radioFat').checked && data.file_fatura.value != ""){
		formdata.append('file_tipo_documento', $('#InputNf').get(0).files[0]);
	}
	else
	{
		formdata.append('file_tipo_documento', "");	
	}

	if(data.file_recibo.value != ""){
		formdata.append('file_recibo', $("#InputRec").get(0).files[0]);
	} else formdata.append('file_recibo', "");	
	if(form.InputComprovante.value != ""){
		formdata.append('file_comprovante', $('#InputComprovante').get(0).files[0]);
	} else formdata.append('file_comprovante', "");
	if(form.InputP1.value != ""){
		formdata.append('file_proposta1', $('#InputP1').get(0).files[0]);
	} else formdata.append('file_proposta1', "");
	if(form.InputP2.value != ""){
		formdata.append('file_proposta2', $('#InputP2').get(0).files[0]);
	} else formdata.append('file_proposta2', "");
	if(form.InputP3.value != ""){
		formdata.append('file_proposta3', $('#InputP3').get(0).files[0]);
	} else formdata.append('file_proposta3', "");
	if(form.InputOutros.value != ""){
		// var list_files = [];
		// for(var f=0; f<$('#InputOutros')[0].files.length; f++){
		// 	list_files.push($('#InputOutros')[0].files.item(f))
		// }
		formdata.append('file_outros', $('#InputOutros').get(0).files[0]);
	} else formdata.append('file_outros', "");
	// Fim de envio de arquivos

	//alert(formdata.name_produto)
	var erros = ValidaDespesas(data);
	if (erros.length > 0) {
		alert("Houve erro(s) no preenchimento do formulário");
		exibeMensagensDeErro(erros);
		return;
	}
	else {
		//Se um fornecedor for cadastrado, tenho que passar seus dados a API
		if($("#cnpj_fornecedor").val().length > 0 && data.tipo_nota_fiscal == "Manual"){
			var formdata_fornecedor = new FormData();
			formdata_fornecedor.append('name', form.nome_fornecedor.value);
			formdata_fornecedor.append('cnpj', form.cnpj_fornecedor.value);
			formdata_fornecedor.append('endereco', form.endereco_fornecedor.value);
			formdata_fornecedor.append('email', form.email_fornecedor.value);
			formdata_fornecedor.append('telefone', form.telefone_fornecedor.value);
			formdata_fornecedor.append('vigencia', sessionStorage.vigencia_pk);

			$.ajax({
				method:"POST",
				url: String(global_link) + "fornecedor/criar/",
		    	data: formdata_fornecedor,
		    	async: false,
		    	processData: false,
    			contentType: false,
				headers: {
					"Authorization": "Token " + getCookie('MeuToken')
				},
		    	success: function(data) {
		        	console.log(data);
		        	formdata.append("fornecedor", data.cnpj);

		        	$.ajax({
						method:"POST",
						url: String(global_link) + "despesa/criar/",
				    	data: formdata,
				    	async: false,
				    	processData: false,
						contentType: false,
						complete: function() { 
							$('#loadingmessage').hide();
							$('#botaoDespesa').prop("disabled", false);},
						headers: {
							"Authorization": "Token " + getCookie('MeuToken')
						},
				    	success: function(data) {
				        	alert("Dados enviados!");
				        	console.log(data);
				        	document.getElementById("Form-Despesa").reset();
				        	window.location.href = "bDespesaCadastradas.html";
				        	exibeMensagensDeErro(erros);

				    	},
				    	error: function(data) {
				        	alert("Dados não enviados - ERRO !");
				        	console.log(data);
							exibeMensagensDeErro(erros);
							$('#loadingmessage').hide();
					   		$('#botaoDespesa').prop("disabled", false);
				    	}
					});
		    	},
		    	error: function(data) {
		        	console.log("ERRO NA CRIAÇÃO DO FORNECEDOR", data)
		    	}
			});
		}
		else{
			if(data.tipo_nota_fiscal == "Manual"){
				formdata.append("fornecedor", data.fornecedor);
			}
			console.log("dados enviados", formdata)
			$.ajax({
				method:"POST",
				url: String(global_link) + "despesa/criar/",
		    	data: formdata,
		    	async: false,
		    	processData: false,
				contentType: false,
				complete: function() { 
					$('#botaoDespesa').prop("disabled", false);},
				headers: {
					"Authorization": "Token " + getCookie('MeuToken')
				},
		    	success: function(data) {
		        	alert("Dados enviados!");
		        	console.log(data);
		        	document.getElementById("Form-Despesa").reset();
		        	window.location.href = "bDespesaCadastradas.html";
		        	exibeMensagensDeErro(erros);

		    	},
		    	error: function(data) {
		        	alert("Dados não enviados - ERRO !");
		        	console.log(data);
					exibeMensagensDeErro(erros);

			   		$('#botaoDespesa').prop("disabled", false);
		    	}
			});
		}
	}
})


function ObtemDespesasdoForm(form){

	var Despesas = {
		tipo_despesa: form.TDespesa.value,
		tipo_documento: form.TDoc.value,
		tipo_nota_fiscal: form.TNFiscal.value,
		school: form.SelectSchool.value,
		code: form.CodigodeBarra.value,
		fornecedor: form.SelectFornecedor.value,
		bank: form.SelectBanco.value,
		//TalaoCheque: form.SelectTalaoChequeDespesa.value,
		//cheque: form.SelectChequeDespesa.value,
		file_nf: form.InputNf,
		file_comprovante: form.InputComprovante,
		file_recibo:form.InputRec,
		file_fatura:form.InputNf,
		file_proposta1: form.InputP1,
		file_proposta2: form.InputP2,
		file_proposta3: form.InputP3,
		num_pag: form.num_pag.value,
		data_pag: form.data_pag.value
	}

	return Despesas;
}


function ValidaDespesas(despesa){
	var erros = [];

		if (despesa.tipo_despesa.length == 0) {
			erros.push("Tipo de Despesa nao pode ser em branco, Por favor marque alguma.");
		}
		if (despesa.tipo_documento.length == 0) {
			erros.push("Tipo do Documento nao pode ser em branco, Por favor marque alguma.");
		}
		if (despesa.tipo_nota_fiscal.length == 0) {
			erros.push("Tipo da Nota Fiscal nao pode ser em branco, Por favor marque alguma.");
		}
		if(despesa.num_pag.length == 0){
			erros.push("Digite o número do comprovante de pagamento");
		}
		if (despesa.data_pag.length == 0) {
			erros.push("Escolha uma data de pagamento");
		}
		if (despesa.tipo_documento == "Nota Fiscal" && despesa.tipo_nota_fiscal == "Eletrônica"){
			if(despesa.code.length == 0){
				erros.push("Código DANFE não pode ser nulo para esta opção!");
			}
		}
		
		if(document.querySelector("#Form-Despesa").TNFiscal.value == "Manual"){
			//Teste da tabela (se tem campos vazios)
			var table = document.getElementById('tableProduto');
			for(var t=1; t<table.rows.length; t++){
				var row = table.getElementsByTagName('tr')[t];
				var cells = row.getElementsByTagName('td');

				if((cells[2].children[0].value.match(/,/g)||[]).length > 1 || (cells[3].children[0].value.match(/,/g)||[]).length > 1){
					erros.push("Formato de número inválido!");
					break;
				}

				if(cells[0].children[0].value == "" || cells[0].children[0].value == null || 
					cells[1].children[0].value == "" || cells[1].children[0].value == null ||
					cells[2].children[0].value == "" || cells[2].children[0].value == null ||
					cells[3].children[0].value == "" || cells[3].children[0].value == null ){
					
					erros.push("Preencha todos os dados da tabela!");
					break;
				}

			}
		}

		//Teste se o usuário quis adicionar um fornecedor
		if ($("#nome_fornecedor,#email_fornecedor,#cnpj_fornecedor,#telefone_fornecedor,#endereco_fornecedor").filter(function() { return $(this).val(); }).length > 0) {
	  		if($("#nome_fornecedor").val().length===0 || $("#email_fornecedor").val().length===0
	  			|| $("#cnpj_fornecedor").val().length===0 || $("#telefone_fornecedor").val().length===0 
	  			|| $("#endereco_fornecedor").val().length===0){
	  			
	  			erros.push("Preencha todos os dados do fornecedor!");
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
