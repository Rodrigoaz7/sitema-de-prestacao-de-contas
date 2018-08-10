//Tive que recriar esta função aqui para retirar um bug de atualizar dados filtrados
function Modal(){
	// =========================== REQUISIÇÕES PARA MODAIS =============================
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
			   		console.log("sucesso", data)
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
}

function FiltrarConta() {
	var nome_bank;
	var code_bank;

	if($("#select_name_bank").val() == "Nome do banco") nome_bank = "";
	else nome_bank = $("#select_name_bank").val();

	if($("#select_bank_code").val() == "Codigo do banco") code_bank = "";
	else code_bank = $("#select_bank_code").val();

	//deletar a tabela anterior para aparecer apenas os elementos filtrados
	while (document.getElementById("table_banco").firstChild) {
	    document.getElementById("table_banco").removeChild(document.getElementById("table_banco").firstChild);
	}

	$.ajax({
		method:"GET",
		url: String(global_link) + "conta/filter?bank_code="+code_bank+"&bank="+nome_bank,
		contentType: 'application/json; charset=utf-8',
		dataType: "json",
		async: false,
		headers: {
			"Authorization": "Token " + getCookie('MeuToken')
		},
		   success: function(data) {
		   	console.log("Contas recebidas", data)
				if(data.length > 0)
		       	{
		       		var tbody = document.getElementById('table_banco');
		       		for (var i = 0; i<data.length; i++)
		       		{
		       			//Não há necessidade de vigências em contas bancárias
		       			var tr = document.createElement('tr');

		       			var td = document.createElement('td');
		       			var td1 = document.createElement('td');
		       			var td2 = document.createElement('td');
		       			var td3 = document.createElement('td');
		       			var td4 = document.createElement('td');
		       			var td5 = document.createElement('td');
			       		var img2 = document.createElement('img');
			       		var img3 = document.createElement('img');

		       			td.appendChild(document.createTextNode(data[i].bank_code));
		       			td1.appendChild(document.createTextNode(data[i].bank));
		       			td2.appendChild(document.createTextNode(data[i].code));
		       			td3.appendChild(document.createTextNode(data[i].name));
		       			td4.appendChild(document.createTextNode(data[i].account_number + '-' + data[i].digito_account_number));
		       			
		       			img2.classList.add("btn", "icon_modal_banco");
			       		img2.setAttribute('type','button');
			       		img2.setAttribute('data-toggle','modal');
			       		img2.setAttribute('data-target','#Modal_Att_Banco');
			      		img2.setAttribute('src','icon/tool.png');
			      		img2.setAttribute('title', 'Atualizar');
                    	img2.setAttribute('data-placement', 'top');
			      		img2.style.cursor = "pointer";
			      		img2.id = data[i].pk;
			      		img2.name = "AtualizarConta";
			      		
			      		img3.classList.add("btn", "icon_modal_banco");
			       		img3.setAttribute('type','button');
			      		img3.setAttribute('src','icon/not.png');
			      		img3.style.cursor = "pointer";
			            img3.setAttribute('title', 'Deletar');
                    	img3.setAttribute('data-placement', 'top');
			      		img3.id = data[i].pk;
			      		img3.name = "DeletarConta";
			       		td5.appendChild(img2);
			       		td5.appendChild(img3);
		       			
		       			tr.appendChild(td);
		       			tr.appendChild(td1);
		       			tr.appendChild(td2);
		       			tr.appendChild(td3);
		       			tr.appendChild(td4);
		       			tr.appendChild(td5);

		       			tbody.appendChild(tr);

					}

					Modal();
		       	}
		   },
		   error: function() {
		       alert("ERRO - nenhum Banco foi cadastrado ainda");
		   }
	});
}
