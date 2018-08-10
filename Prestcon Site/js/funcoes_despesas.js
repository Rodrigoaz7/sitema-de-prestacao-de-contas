$("#radioFat").click(function(event){
	document.getElementById('nfe').disabled = true;
	document.getElementById('nfm').checked = true;
	document.getElementById('divOcultaDespesas').style.display = "block";
	document.getElementById('InputNf').disabled = false;
	document.getElementById('CodigodeBarra').readOnly = true;
});

$("#radioRec").click(function(event){
	document.getElementById('nfe').disabled = true;
	document.getElementById('nfm').checked = true;
	document.getElementById('divOcultaDespesas').style.display = "block";
	document.getElementById('InputNf').disabled = true;
	document.getElementById('CodigodeBarra').readOnly = true;
});

$("#radioNf").click(function(event){
	document.getElementById('nfe').disabled = false;
	document.getElementById('InputNf').disabled = false;
});

$("#nfm").click(function(event){
	document.getElementById('divOcultaDespesas').style.display = "block";
	document.getElementById('divPaiFornecedor').style.display = "block";
	$('#divFornecedor').find('input:text').val('');
	document.getElementById('CodigodeBarra').readOnly = true;
	document.getElementById('radioRec').disabled = false;
	document.getElementById('radioFat').disabled = false;
	document.getElementById('radioServ').disabled = false;
});

$("#nfe").click(function(event){
	document.getElementById('divOcultaDespesas').style.display = "none";
	document.getElementById('divPaiFornecedor').style.display = "none";
	document.getElementById('CodigodeBarra').readOnly = false;
	document.getElementById('radioNf').checked = true;
	document.getElementById('radioRec').disabled = true;
	document.getElementById('radioFat').disabled = true;
	document.getElementById('radioServ').disabled = true;
	document.getElementById('radioMat').checked = true;
});

$("#radioServ").click(function(event){
	document.getElementById('nfe').disabled = true;
});

$("#radioMat").click(function(event){
	document.getElementById('nfe').disabled = false;
});

//Ao clicar em alguma linha da tabela, essa função é disparada
$("#tableProduto").on("change", "tr", function(e) {
	//Pego o index da linha clicada
	var idx = $(e.currentTarget).index();
	sessionStorage.row_index = idx;
	//Pego a linha clicada
	var row = document.getElementById('tableProduto').getElementsByTagName('tr')[idx+1];
	var cells = row.getElementsByTagName('td');
	//Testo se todos os campos necessários foram preenchidos
	if(cells[2].children[0].value != "" && cells[1].children[0].value != ""){
		var aux = parseInt(cells[1].children[0].value) * parseFloat(cells[2].children[0].value.replace(",","."));
		cells[3].children[0].value = String(aux).replace(".",",");
	}
});

//Função que permite apenas números em um input de texto
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

//Função que permite apenas números e virgulas em um input de texto
function isNumberKeyOrDot(evt){
	//Calculate();
    var charCode = (evt.which) ? evt.which : event.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44 && charCode != 46);
}

//Cria novas linhas para a tabela de produtos (cadastro manual)
$('#plus1').click(function(){
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
		);
});

//Deleta linha para a tabela de produtos (cadastro manual)
$('#not').click(function(){
	var table = document.getElementById('tableProduto');
	var num_linhas = table.rows.length;
	if(num_linhas-1 > 1) {
		if(!table.rows[num_linhas-1].getElementsByTagName('td')[0].children[0].value){
			table.deleteRow(num_linhas-1);
		}
	}
});

//Aparecer campo de fornecedores para cadastro
$("#plusForn").click(function(){
	$("#divFornecedor").toggle('slow');
	$("#SelectFornecedor").toggle('slow');
	$('#divFornecedor').find('input:text').val('');
	if($("#plusForn").attr('src') == 'icon/plus.png') $('#plusForn').attr('src','icon/less.png');
	else $('#plusForn').attr('src','icon/plus.png');
});

//Funções para hover de inputs
$("#InputNf").change(function(){
   document.getElementById('inputnf').setAttribute("data-balloon", $(this).val().split(/(\\|\/)/g).pop());
   $('#imgInputNf').attr('src', 'icon/desp/check.png');
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
	//alert($(this)[0].files.item(0).name)
	document.getElementById('inputoutros').setAttribute("data-balloon", $(this)[0].files.length + " arquivos selecionados");
   $('#imgInputOutros').attr('src', 'icon/desp/check.png');
});