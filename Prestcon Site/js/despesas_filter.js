$(document).on("change", "#fornecedor_sel, #conta_sel, #despesa_sel, #documento_sel", function(){
	var fornecedor = "";
	var conta = "";
	var despesa = "";
	var documento = "";

	fornecedor = fornecedor_sel.value;
	conta = conta_sel.value;
	despesa = despesa_sel.value;
	documento = documento_sel.value;

	if(fornecedor == "Fornecedor") fornecedor = "";
	if(despesa == "Tipo da despesa") despesa = "";
	if(documento == "Tipo do documento") documento = "";
	if(conta == "Conta bancária") conta = "";
	
	Filtrar(fornecedor, conta, despesa, documento);
});


function Filtrar(fornecedor, conta, despesa, documento){

	//deletar a tabela anterior para aparecer apenas os elementos filtrados
	while (document.getElementById("tbody").firstChild) {
	    document.getElementById("tbody").removeChild(document.getElementById("tbody").firstChild);
	}

	$.ajax({
		method:"GET",
		url: String(global_link) + "despesa/filter?fornecedor__name="+fornecedor+"&tipo_despesa="+despesa+"&tipo_documento="+documento+"&bank__name="+conta,
		contentType: 'application/json; charset=utf-8',
		dataType: "json",
		async: false,
		headers: {
			"Authorization": "Token " + getCookie('MeuToken')
		},
	    success: function(data) 
	    {
	    	console.log("Recebi os dados: ", data)
			if(data.length > 0)
	       	{

	       		var Tabela = document.getElementById("tabela_despesas");
				var TBody = document.getElementById("tbody");

				for(var i = 0; i < data.length; i++)
				{
					if(data[i].vigencia == sessionStorage.vigencia_pk)
					{
					
						var trB = document.createElement("tr");
						trB.setAttribute('id',data[i].pk);
						trB.style.cursor = "pointer";
						trB.onclick = function(){
							sessionStorage.despesa_pk = jQuery(this).attr("id");
							window.location.href = "cConsultaDespesas.html";
						}

						var tdF = document.createElement("td");
						tdF.innerHTML = data[i].fornecedor.name;

						 var tdE = document.createElement("td");
						 if(data[i].bank) {
						 	tdE.innerHTML = data[i].bank.name;
						 }
						 else {
						 	tdE.innerHTML = " ";
						 }

						var tdTD = document.createElement("td");
						tdTD.innerHTML = data[i].tipo_despesa
						
						var tdTE = document.createElement("td");
						tdTE.innerHTML = data[i].tipo_documento

						Tabela.appendChild(TBody);
						TBody.appendChild(trB);
						trB.appendChild(tdF);
						trB.appendChild(tdE);
						trB.appendChild(tdTD);
						trB.appendChild(tdTE);

						document.getElementById('divtable').appendChild(Tabela);
						//document.getElementById('divfora').appendChild(document.getElementById('divtable'));
						document.getElementById('DivPai').appendChild(document.getElementById('divtable'));
					
					}			
				}
				// show('DivPai', true);
				// show('loading', false);

			}
	   },
		error: function() {
		    alert("Nenhuma Despesa foi Cadastrada ainda");
		}
	});
}
