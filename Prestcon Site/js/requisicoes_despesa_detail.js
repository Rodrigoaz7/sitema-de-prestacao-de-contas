$.ajax({
	method:"GET",
	url: String(global_link) + "despesa/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	async: false,
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
   	success: function(data) {
   		console.log(data);
		if(data.length > 0)
		{
			for(var i=0; i<data.length; i++)
			{
				if(data[i].pk == sessionStorage.despesa_pk)
				{
					sessionStorage.escola = data[i].school;
					sessionStorage.fornecedor = data[i].fornecedor.cnpj;

					if(data[i].bank) sessionStorage.bank = data[i].bank.pk;
					else sessionStorage.bank = " ";

					sessionStorage.tipo_despesa = data[i].tipo_despesa;
					sessionStorage.tipo_documento = data[i].tipo_documento;
					sessionStorage.tipo_nota_fiscal = data[i].tipo_nota_fiscal;

					document.getElementById("TipoDespesa").innerHTML = data[i].tipo_despesa;
					document.getElementById("TipoDocumento").innerHTML = data[i].tipo_documento;
					document.getElementById("TipoNotaFiscal").innerHTML = data[i].tipo_nota_fiscal;
					document.getElementById("num_pag").value = data[i].num_comprovante_pag;
					document.getElementById("data_pag").value = data[i].data_comprovante_pag;
					document.getElementById('nomeDoc').innerHTML = data[i].tipo_documento;
					document.getElementById('SelectFornecedor').value = data[i].fornecedor.name + " [" + data[i].fornecedor.cnpj + "]";
					document.getElementById('SelectEscola').value = data[i].school;

					if(data[i].bank) document.getElementById('SelectConta').value = data[i].bank.name;
					else document.getElementById('SelectConta').value = " ";
					if(data[i].tipo_documento == "Recibo") $("#inputrec").hide();
					if(data[i].tipo_nota_fiscal == "Eletrônica") document.getElementById('BotaoAttDespesa').disabled = true;
					var short_file_documento;
					//var file_type;
					//var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
					//file_type = short_file_documento["type"];
   					//if ($.inArray(file_type, ValidImageTypes) < 0) {
   					// }

					if(data[i].file_tipo_documento != null){
						var a = data[i].file_tipo_documento.slice(1);
						short_file_documento = data[i].file_tipo_documento.split(/(\\|\/)/g).pop()
						document.getElementById('inputdoc').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputDoc').attr('src', 'icon/desp/check.png');
   						$("#inputdoc").click(function(event){
						    window.open(String(global_link) + a);
						});
					}
					if(data[i].file_recibo != null){
						var g = data[i].file_recibo.slice(1);
						short_file_documento = data[i].file_recibo.split(/(\\|\/)/g).pop()
						document.getElementById('inputrec').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputRec').attr('src', 'icon/desp/check.png');
   						$("#inputrec").click(function(event){
						    window.open(String(global_link) + g);
						});
					}
					if(data[i].file_comprovante != null){
						var b = data[i].file_comprovante.slice(1);
						short_file_documento = data[i].file_comprovante.split(/(\\|\/)/g).pop()
						document.getElementById('inputcomp').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputComprovante').attr('src', 'icon/desp/check.png');
   						$("#inputcomp").click(function(event){
						    window.open(String(global_link)+b);
						});
					}
					if(data[i].file_proposta1 != null){
						var c = data[i].file_proposta1.slice(1);
						short_file_documento = data[i].file_proposta1.split(/(\\|\/)/g).pop()
						document.getElementById('inputp1').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputP1').attr('src', 'icon/desp/check.png');
   						$("#inputp1").click(function(event){
						    window.open(String(global_link)+c);
						});
					}
					if(data[i].file_proposta2 != null){
						var d = data[i].file_proposta2.slice(1);
						short_file_documento = data[i].file_proposta2.split(/(\\|\/)/g).pop()
						document.getElementById('inputp2').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputP2').attr('src', 'icon/desp/check.png');
   						$("#inputp2").click(function(event){
						    window.open(String(global_link)+d);
						});
					} 
					if(data[i].file_proposta3 != null){
						var e = data[i].file_proposta3.slice(1);
						short_file_documento = data[i].file_proposta3.split(/(\\|\/)/g).pop()
						document.getElementById('inputp3').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputP3').attr('src', 'icon/desp/check.png');
   						$("#inputp3").click(function(event){
						    window.open(String(global_link)+e);
						});
   					}
   					if(data[i].file_outros != null){
						var f = data[i].file_outros.slice(1);
						short_file_documento = data[i].file_outros.split(/(\\|\/)/g).pop()
						document.getElementById('inputoutros').setAttribute("data-balloon", short_file_documento);
   						$('#imgInputOutros').attr('src', 'icon/desp/check.png');
   						$("#inputoutros").click(function(event){
						    window.open(String(global_link)+f);
						});
   					}
				}
			}
		}	   
   },
   error: function(data) {
       console.log(data);
   }
});

//Cria novas linhas para a tabela de produtos (cadastro manual)
$('#plus').click(function(){
	$('#tableProduto').find('tbody')
		.append($('<tr>')
			.append($('<td>')
				.append('<input name="inputNomeProduto" type="text" class="form-control">'))
			.append($('<td>')
				.append('<input name="inputUnidadeProduto" type="text" class="form-control" onkeypress="return isNumberKey(event)">'))
			.append($('<td>')
				.append('<input name="inputValorUnitarioProduto" type="text" class="form-control" onkeypress="return isNumberKeyOrDot(event)">'))
			.append($('<td>')
				.append('<input name="inputValorTotalProduto" type="text" class="form-control" onkeypress="return isNumberKeyOrDot(event)">'))
			.append($('<td>')
				.append('<input name="inputTipoUnidadeProduto" type="text" class="form-control">'))
			.append($('<td>')
				.append('<img name="DeletarProduto" src="icon/not.png" style="cursor: pointer;">'))
		);
});

//Deleta linha para a tabela de produtos (cadastro manual)
// $('#not').click(function(){
// 	var table = document.getElementById('tableProduto');
// 	var num_linhas = table.rows.length;
// 	if(num_linhas-1 > 0) table.deleteRow(num_linhas-1);
// });

//Ao clicar em alguma linha da tabela, essa função é disparada
// $("#tableProduto").on("change", "tr", function(e) {
// 	//Pego o index da linha clicada
// 	var idx = $(e.currentTarget).index();
// 	sessionStorage.row_index = idx;
// 	//Pego a linha clicada
// 	var row = document.getElementById('tableProduto').getElementsByTagName('tr')[idx+1];
// 	var cells = row.getElementsByTagName('td');
// 	//Testo se todos os campos necessários foram preenchidos
// 	if(cells[2].children[0].value != "" && cells[1].children[0].value != ""){
// 		cells[3].children[0].value = parseInt(cells[1].children[0].value) * parseFloat(cells[2].children[0].value);
// 	}
// });

//Funções para hover de inputs
$("#InputDoc").change(function(){
   document.getElementById('inputdoc').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputDoc').attr('src', 'icon/desp/check.png');
});
$("#InputRec").change(function(){
   document.getElementById('inputrec').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputRec').attr('src', 'icon/desp/check.png');
});
$("#InputComprovante").change(function(){
   document.getElementById('inputcomp').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputComprovante').attr('src', 'icon/desp/check.png');
});
$("#InputP1").change(function(){
   document.getElementById('inputp1').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputP1').attr('src', 'icon/desp/check.png');
});
$("#InputP2").change(function(){
   document.getElementById('inputp2').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputP2').attr('src', 'icon/desp/check.png');
});
$("#InputP3").change(function(){
   document.getElementById('inputp3').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputP3').attr('src', 'icon/desp/check.png');
});
$("#InputOutros").change(function(){
   document.getElementById('inputoutros').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputOutros').attr('src', 'icon/desp/check.png');
});

//Função para validar link correto
function LinkValidoProduto(tipo){
	if(tipo == "Nota Fiscal")
	{
		if(sessionStorage.tipo_nota_fiscal == "Manual") return "produtonf";
		else return "produtonfelet";
	}
	else if(tipo == "Fatura")
	{
		return "produtofat";
	}
	else
	{
		return "produtorec";
	}
}


$.ajax({
	method:"GET",
	url: String(global_link) + "despesa/" + LinkValidoProduto(sessionStorage.tipo_documento) + "/"+sessionStorage.despesa_pk+"/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	async: false,
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
   	success: function(data) {
   		console.log(data);
		if(data.length > 0)
		{
			// Simulando um click para criar uma nova linha
			for(var k=1; k<data.length;k++){
				$("#plus").click();
			}

			var table = document.getElementById('tableProduto');

			for(var j=1; j<table.rows.length;j++){

				var row = table.getElementsByTagName('tr')[j];
				var cells = row.getElementsByTagName('td');
				cells[0].children[0].value = data[j-1].name;
				cells[1].children[0].value = data[j-1].unidades;
				cells[2].children[0].value = data[j-1].valor_unitario;
				cells[3].children[0].value = data[j-1].valor_total;
				cells[4].children[0].value = data[j-1].tipo_unidade;
				cells[5].children[0].id = data[j-1].pk;
			}	
		}	   
   },
   error: function(data) {
       console.log(data);
   }
});


document.querySelector("#BotaoExcluiDespesa").addEventListener("click",function(event){
	var answer = confirm("Deseja deletar esta despesa?");
	if(answer){
		$.ajax({
			type: 'DELETE',
			url: String(global_link) + "despesa/deletar/"+ sessionStorage.despesa_pk + "/",
			async: false,
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
			success: function(data) {
				console.log(data);
				window.location.assign("bDespesaCadastradas.html");
				alert("Despesa deletada com sucesso !");
			},
			error: function(data) {
				alert("Não foi possível deletar esta despesa!");
			   	console.log(data);
			}
		});
	}

});

document.querySelector("#BotaoAttDespesa").addEventListener("click",function(event){

	event.preventDefault();
	form = document.querySelector("#form-DPS");
	var formdata = new FormData();

	// Adicionando os dados para atualização
	// Char Fields first
	formdata.append("despesa", sessionStorage.despesa_pk);
	formdata.append("vigencia", sessionStorage.vigencia_pk);
	formdata.append("tipo_despesa", sessionStorage.tipo_despesa);
	formdata.append("tipo_nota_fiscal", sessionStorage.tipo_nota_fiscal);
	formdata.append("num_comprovante_pag", form.num_pag.value);
	formdata.append("data_comprovante_pag", form.data_pag.value);
	
	if(sessionStorage.tipo_documento == "nfmanual" || sessionStorage.tipo_documento == "nfe"){ 
		formdata.append("tipo_documento", "Nota Fiscal");
	}
	else
	{
		formdata.append("tipo_documento", sessionStorage.tipo_documento);
	}

	//Foreign Keys
	formdata.append("fornecedor", sessionStorage.fornecedor);
	formdata.append("school", form.SelectEscola.value);
	formdata.append("bank", sessionStorage.bank);

	var numero_de_produtos = document.getElementById('tableProduto').rows.length-1;
	var name_produto = [];
	var valor_produto_unitario = [];
	var valor_produto_total = [];
	var unidades_produto = [];
	var tipo_unidade = [];


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

	if(document.getElementById("InputDoc").value != ""){
		formdata.append('file_tipo_documento', $("#InputDoc").get(0).files[0]);
	}
	if(sessionStorage.tipo_documento == "Recibo"){
		if(document.getElementById("InputDoc").value != ""){
			formdata.append('file_recibo', $("#InputDoc").get(0).files[0]);
		}
	}
	else
	{
		if(document.getElementById("InputRec").value != ""){
			formdata.append('file_recibo', $("#InputRec").get(0).files[0]);
		}
	}
	if(document.getElementById("InputComprovante").value != ""){
		formdata.append('file_comprovante', $("#InputComprovante").get(0).files[0]);
	}
	if(document.getElementById("InputP1").value != ""){
		formdata.append('file_proposta1', $('#InputP1').get(0).files[0]);
	}
	if(document.getElementById("InputP2").value != ""){
		formdata.append('file_proposta2', $('#InputP2').get(0).files[0]);
	}
	if(document.getElementById("InputP3").value != ""){
		formdata.append('file_proposta3', $('#InputP3').get(0).files[0]);
	}
	if(document.getElementById("InputOutros").value != ""){
		formdata.append('file_outros', $('#InputOutros').get(0).files[0]);
	}

	$.ajax({
		method:"PUT",
		url: String(global_link) + "despesa/atualizar/"+ sessionStorage.despesa_pk + "/",
    	data: formdata,
    	processData: false,
		contentType: false,
		headers: {
			"Authorization": "Token " + getCookie('MeuToken')
		},
    	success: function(data) {
        	alert("Dados atualizados com sucesso!");
        	console.log(data);
        	window.location.href="bDespesaCadastradas.html";
    	},
    	error: function(data) {
        	alert("erro");
        	console.log(data);
    	}
	});
});

$("img[name=DeletarProduto]").click(function(){
	var answer = confirm("Deseja deletar este produto?");
	if(answer){
		$.ajax({
			type: 'DELETE',
			url: String(global_link) + "despesa/"+ LinkValidoProduto(sessionStorage.tipo_documento) + "/deletar/" + this.id + "/",
			async: false,
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
			success: function(data) {
				console.log('produto deletado');
				window.location.reload();
			},
			error: function(data) {
				alert("Não foi possível deletar este produto!");
			   	console.log(data);
			}
		});
	}
});