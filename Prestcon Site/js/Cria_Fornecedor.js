function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);

    function checkReady() {
        if (document.getElementsByTagName('DivPai')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

function CalculoDias(datafinal)
{
	var date1 = new Date();
	date1 = new Date(date1.getFullYear(), date1.getMonth()+1, date1.getDate());

	datafinal = datafinal.split('/');
	datafinal = new Date(datafinal[2], datafinal[1], datafinal[0]);

	// We use the getTime() method and get the unixtime (in milliseconds, but we want seconds, therefore we divide it through 1000)
	date1_unixtime = parseInt(date1.getTime() / 1000);
	datafinal_unixtime = parseInt(datafinal.getTime() / 1000);

	// This is the calculated difference in seconds
	var timeDifference = datafinal_unixtime - date1_unixtime;

	// in Hours
	var timeDifferenceInHours = timeDifference / 60 / 60;

	// and finaly, in days :)
	var timeDifferenceInDays = timeDifferenceInHours / 24;

	return timeDifferenceInDays;
}

document.querySelector("#buttonSearchFornecedor").addEventListener("click",function(event){
	
	//Se pesquisarmos, temos de deletar todos os dados anteriores
	document.getElementById("DivPai").innerHTML = "";

	event.preventDefault()
	var form = document.querySelector("#formPesquisa");

	$.ajax({
	method:"GET",
	url: String(global_link) + "fornecedor/filter?search="+form.SearchFornecedor.value,
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
    success: function(data) 
    {
    	if(data.length == 0) {
    		show('DivPai', true);
			show('loading', false);
    	}
		else if(data.length > 0)
       	{
       		//Exibir tela de loading
			//$('#loadingmessage').show();

			for(var i = 0; i < data.length; i++){
			{
				//PARTE DE CIMA
				var DivdeFora = document.createElement("div");
				DivdeFora.setAttribute("id", "divPrincipal");
				DivdeFora.classList.add("col-md-6", "margin-div-pai");
				DivdeFora.style.float = "left";

				var DivdoFornecedor = document.createElement("div");
				DivdoFornecedor.classList.add("card-header", "fa","fa-industry","Tamanho-letra","margin_fornecedor");
				DivdoFornecedor.style.border = "none";
				DivdoFornecedor.style.height = "70px";
				DivdoFornecedor.style.width = "100%";
				DivdoFornecedor.style.display = "inline-block";
				
				var strF = "Fornecedor: ";
			    var resultF = strF.bold();
			    DivdoFornecedor.innerHTML = " " + resultF + " " + String(data[i].name);

				var DivdoCNPJ = document.createElement("div");
				DivdoCNPJ.classList.add("text-muted","fa","fa-id-card-o", "Tamanho-div", "Tamanho-letra","margin-cpf");
				DivdoCNPJ.style.margin = "5%";
				DivdoCNPJ.style.border = "none";

				var strC = "CNPJ: ";
			    var resultC = strC.bold();
			    var cnpj_html = String(data[i].cnpj);
			    DivdoCNPJ.innerHTML = " " + resultC + " " + cnpj_html;
			   

				DivdeFora.appendChild(DivdoFornecedor);
				DivdeFora.appendChild(DivdoCNPJ);

				$.ajax({
					method:"GET",
					url: String(global_link) + "certidao/",
					contentType: 'application/json; charset=utf-8',
					dataType: "json",
					async: false,
					headers: {
						"Authorization": "Token " + getCookie('MeuToken')
					},
					success: function(data)
					{
						console.log(data);
						for(var j=0; j<data.length; j++)
						{
							if(data[j].certidao_fornecedor == cnpj_html)
							{

								//alert("[" + j + "] = " + data[j].certidao_fornecedor);
								var DivdosCertificados = document.createElement("div");
								DivdosCertificados.classList.add("list-group","list-group-flush","small");								

								var ARF = document.createElement("a");
								if(data[j].final_validade != "")
								{
									var dias = CalculoDias(data[j].final_validade);
									//alert("faltam " + dias);
									if(dias > 15) ARF.classList.add("list-group-item","list-group-item-action","cert-ok");
									else if(dias <= 15 && dias>=0) ARF.classList.add("list-group-item","list-group-item-action","cert-warn");
									else ARF.classList.add("list-group-item","list-group-item-action","cert-not");
								}
								else
								{
									//alert("entrou no else");
									ARF.classList.add("list-group-item","list-group-item-action","cert-not");
								}

								ARF.setAttribute('id', String(data[j].pk));
								ARF.setAttribute('href','cCertificado.html');

								var divRF = document.createElement("div");
								divRF.classList.add("media");
								var imgRF = document.createElement("img");

								if(data[j].final_validade != "")
								{
									var dias = CalculoDias(data[j].final_validade);
									if(dias > 15) imgRF.setAttribute('src','icon/ok.png');
									else if(dias <= 15 && dias > 0) imgRF.setAttribute('src','icon/warning.png');
									else imgRF.setAttribute('src','icon/not.png');
								}
								else
								{
									imgRF.setAttribute('src','icon/not.png');
								}
								
								imgRF.setAttribute('alt',' ');
								imgRF.classList.add("d-flex", "mr-3", "rounded-circle");

								var DivRF = document.createElement("div");
								DivRF.classList.add("media-body");
								var H5RF = document.createElement("h5");
								var str = String(data[j].name) + " - " + String(data[j].tipo);
							    var result = str.bold();
							    H5RF.innerHTML = result;
							    var divRF2 = document.createElement("div");
							    divRF2.classList.add("text-muted", "smaller", "cert-val");
							    var pRF = document.createElement("p");
							    pRF.classList.add("cert-p");
							    pRF.innerHTML = "Validade: " + String(data[j].inicio_validade) + " a " + String(data[j].final_validade);

							    divRF2.appendChild(pRF);
							    DivRF.appendChild(H5RF);
							    DivRF.appendChild(divRF2);
							    divRF.appendChild(imgRF);
							    divRF.appendChild(DivRF);
							    ARF.appendChild(divRF);
								DivdosCertificados.appendChild(ARF);

								DivdeFora.appendChild(DivdosCertificados);
							}
						}
						document.getElementById('DivPai').appendChild(DivdeFora);

						jQuery('.list-group-item').click(function(){
						    sessionStorage.certidao_pk = jQuery(this).attr("id");
						});

					},
					error: function(data){
						alert("Erro");
					}
				});
						
			}
		} 
			show('DivPai', true);
			show('loading', false);
   	}
},
	error: function() {
	    alert("Erro");
	}
});
});

$.ajax({
	method:"GET",
	url: String(global_link) + "fornecedor/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
    success: function(data) 
    {
    	if(data.length == 0) {
    		show('DivPai', true);
			show('loading', false);
    	}
		else if(data.length > 0)
       	{
       		//Exibir tela de loading
			//$('#loadingmessage').show();

			for(var i = 0; i < data.length; i++){
			{
				//PARTE DE CIMA
				var DivdeFora = document.createElement("div");
				DivdeFora.setAttribute("id", "divPrincipal");
				DivdeFora.classList.add("col-md-6", "margin-div-pai");
				DivdeFora.style.float = "left";

				var DivdoFornecedor = document.createElement("div");
				DivdoFornecedor.classList.add("card-header", "fa","fa-industry","Tamanho-letra","margin_fornecedor");
				DivdoFornecedor.style.border = "none";
				DivdoFornecedor.style.height = "70px";
				DivdoFornecedor.style.width = "100%";
				DivdoFornecedor.style.display = "inline-block";
				
				var strF = "Fornecedor: ";
			    var resultF = strF.bold();
			    DivdoFornecedor.innerHTML = " " + resultF + " " + String(data[i].name);

				var DivdoCNPJ = document.createElement("div");
				DivdoCNPJ.classList.add("text-muted","fa","fa-id-card-o", "Tamanho-div", "Tamanho-letra","margin-cpf");
				DivdoCNPJ.style.margin = "5%";
				DivdoCNPJ.style.border = "none";

				var strC = "CNPJ: ";
			    var resultC = strC.bold();
			    var cnpj_html = String(data[i].cnpj);
			    DivdoCNPJ.innerHTML = " " + resultC + " " + cnpj_html;
			   

				DivdeFora.appendChild(DivdoFornecedor);
				DivdeFora.appendChild(DivdoCNPJ);

				$.ajax({
					method:"GET",
					url: String(global_link) + "certidao/",
					contentType: 'application/json; charset=utf-8',
					dataType: "json",
					async: false,
					headers: {
						"Authorization": "Token " + getCookie('MeuToken')
					},
					success: function(data)
					{
						console.log(data);
						for(var j=0; j<data.length; j++)
						{
							if(data[j].certidao_fornecedor == cnpj_html)
							{

								//alert("[" + j + "] = " + data[j].certidao_fornecedor);
								var DivdosCertificados = document.createElement("div");
								DivdosCertificados.classList.add("list-group","list-group-flush","small");								

								var ARF = document.createElement("a");
								if(data[j].final_validade != "")
								{
									var dias = CalculoDias(data[j].final_validade);
									//alert("faltam " + dias);
									if(dias > 15) ARF.classList.add("list-group-item","list-group-item-action","cert-ok");
									else if(dias <= 15 && dias>=0) ARF.classList.add("list-group-item","list-group-item-action","cert-warn");
									else ARF.classList.add("list-group-item","list-group-item-action","cert-not");
								}
								else
								{
									//alert("entrou no else");
									ARF.classList.add("list-group-item","list-group-item-action","cert-not");
								}

								ARF.setAttribute('id', String(data[j].pk));
								ARF.setAttribute('href','cCertificado.html');

								var divRF = document.createElement("div");
								divRF.classList.add("media");
								var imgRF = document.createElement("img");

								if(data[j].final_validade != "")
								{
									var dias = CalculoDias(data[j].final_validade);
									if(dias > 15) imgRF.setAttribute('src','icon/ok.png');
									else if(dias <= 15 && dias > 0) imgRF.setAttribute('src','icon/warning.png');
									else imgRF.setAttribute('src','icon/not.png');
								}
								else
								{
									imgRF.setAttribute('src','icon/not.png');
								}
								
								imgRF.setAttribute('alt',' ');
								imgRF.classList.add("d-flex", "mr-3", "rounded-circle");

								var DivRF = document.createElement("div");
								DivRF.classList.add("media-body");
								var H5RF = document.createElement("h5");
								var str = String(data[j].name) + " - " + String(data[j].tipo);
							    var result = str.bold();
							    H5RF.innerHTML = result;
							    var divRF2 = document.createElement("div");
							    divRF2.classList.add("text-muted", "smaller", "cert-val");
							    var pRF = document.createElement("p");
							    pRF.classList.add("cert-p");
							    pRF.innerHTML = "Validade: " + String(data[j].inicio_validade) + " a " + String(data[j].final_validade);

							    divRF2.appendChild(pRF);
							    DivRF.appendChild(H5RF);
							    DivRF.appendChild(divRF2);
							    divRF.appendChild(imgRF);
							    divRF.appendChild(DivRF);
							    ARF.appendChild(divRF);
								DivdosCertificados.appendChild(ARF);

								DivdeFora.appendChild(DivdosCertificados);
							}
						}
						document.getElementById('DivPai').appendChild(DivdeFora);

						jQuery('.list-group-item').click(function(){
						    sessionStorage.certidao_pk = jQuery(this).attr("id");
						});

					},
					error: function(data){
						alert("Erro");
					}
				});
							
			}
		} 
			show('DivPai', true);
			show('loading', false);
   	}
},
	error: function() {
	    alert("Erro");
	}
});