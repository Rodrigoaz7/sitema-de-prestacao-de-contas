function CalculoDias(datafinal)
{
	var date1 = new Date();
	date1 = new Date(date1.getFullYear(), date1.getMonth()+1, date1.getDate());
	//alert(date1)
	datafinal = datafinal.split('/');
	datafinal = new Date(datafinal[2], datafinal[1], datafinal[0]);

	//alert(date1 + ' ' + datafinal)
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

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

$('#imgInput').on("change", function(){ 
	document.getElementById('descricao_file').style.display = "block";
	document.getElementById('descricao_file').innerHTML = document.getElementById('imgInput').value;
});

var name;
var tipo;

$.ajax({
	method:"GET",
	url: String(global_link) + "certidao/atualizar/"+sessionStorage.certidao_pk+"/",
	contentType: 'application/json; charset=utf-8',
	dataType: "json",
	//async: false,
	headers: {
		"Authorization": "Token " + getCookie('MeuToken')
	},
	   success: function(data) {
	   		console.log(data);
	   		name = data.name;
	   		tipo = data.tipo;
	       document.getElementById("txtFornecedor").value = data.certidao_fornecedor;
	       document.getElementById("dataIni").value = data.inicio_validade;
	       document.getElementById("dataFim").value = data.final_validade;
	       document.getElementById("txtTitleCertidao").innerHTML = data.name + " - " + data.tipo;
	       
	       if(data.inicio_validade == "" || data.final_validade == "")
	       {
	       		document.getElementById("txtDataValidade").innerHTML = "Sem validade cadastrada";
	       }
	       else
	       {
	       		document.getElementById("txtDataValidade").innerHTML = "Validade: " + data.inicio_validade + " a " + data.final_validade;
	  	   }

	  	   if(data.file != null)
	  	   {
		  	   	if(checkURL(data.file)){
			  	   document.getElementById("divImagem").style.width = "auto";
			  	   document.getElementById("divImagem").style.height = "35%";

			  	   document.getElementById("imgupload").src = String(global_link) + data.file.slice(1);
			  	   document.getElementById("imgupload").style.width = "50%";
			  	   document.getElementById("imgupload").style.height = "auto";
			  	   document.getElementById("imgupload").style.display = "block";
			  	   document.getElementById("imgupload").style.marginLeft = "auto";
			  	   document.getElementById("imgupload").style.marginRight = "auto";

			  	   document.getElementById("linkImg").setAttribute('href', String(global_link) + data.file.slice(1));
			  	}
			  	else{
			  		document.getElementById("linkDoc").innerHTML = "Baixar Arquivo";
			  		document.getElementById("linkDoc").setAttribute('href', String(global_link) + data.file.slice(1));
			  		document.getElementById('linkDoc').setAttribute("data-balloon", String(global_link) + data.file.slice(1));
			  	}
	  	   }
	  	   // Apenas para front-end
			if(data.final_validade != "")
			{
				var dias = CalculoDias(data.final_validade);
				if(dias > 15) {
					document.getElementById('divCertidao').style.backgroundColor = "rgb(137, 250, 137)";
					document.getElementById('iconeField').setAttribute('src','icon/ok.png');
				}
				else if(dias <= 15 && dias>=0) {
					document.getElementById('divCertidao').style.backgroundColor = "rgb(250, 214, 137)";
					document.getElementById('iconeField').setAttribute('src','icon/warning.png');
				}
				else {
					document.getElementById('divCertidao').style.backgroundColor = "rgb(250, 137, 137)";
					document.getElementById('iconeField').setAttribute('src','icon/not.png');
				}
			}
			else
			{
				document.getElementById('divCertidao').style.backgroundColor = "rgb(250, 137, 137)";
				document.getElementById('iconeField').setAttribute('src','icon/not.png');
			}
	  	   
	   },
	   error: function(data) {
	       console.log(data);
	   }
});

document.querySelector("#ButtonPutCertidao").addEventListener("click",function(event){
	event.preventDefault();
	form = document.querySelector("#form-CDT");
	var formdata = new FormData();
	formdata.append("name", name);
	formdata.append("tipo", tipo);
	formdata.append("certidao_fornecedor", form.txtFornecedor.value);
	formdata.append("inicio_validade", form.dataIni.value);
	formdata.append("final_validade", form.dataFim.value);

	if(form.imgInput.value != ""){
		formdata.append('file', $('#imgInput').get(0).files[0]);
	}
	
	if(form.dataIni.value.length != 10 || form.dataFim.value.length != 10)
	{
		alert("Erro no preenchimento das datas de validade, datas precisam ser dd/mm/YYYY");
	}
	else if(form.imgInput.value.length == 0 && document.getElementById("linkDoc").innerHTML.length == 0){
		alert("Você precisa cadastrar uma arquivo para esta certidão");
	}
	else
	{
		$.ajax({
			method:"PUT",
			url: String(global_link) + "certidao/atualizar/"+sessionStorage.certidao_pk+"/",
	    	data: formdata,
	    	processData: false,
			contentType: false,
			headers: {
				"Authorization": "Token " + getCookie('MeuToken')
			},
	    	success: function(data) {
	        	alert("Dados atualizados com sucesso!");
	        	window.location.href="bFornecedores.html";
	        	console.log(data);
	    	},
	    	error: function(data) {
	        	alert("erro");
	        	console.log(data);
	    	}
		});
	}
});