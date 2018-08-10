$("#limparFiltros").click(function() {
    document.getElementById('select_bank_code').selectedIndex = 0;
    document.getElementById('select_name_bank').selectedIndex = 0;
    FiltrarConta();
});

$.ajax({
    method: "GET",
    url: String(global_link) + "diretor/",
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    headers: {
        "Authorization": "Token " + getCookie('MeuToken')
    },
    success: function(data) {
        document.getElementById("Nome-diretor").innerHTML = data.user.name;
        //document.getElementById("username").value = data[0].username;
        document.getElementById("EMail-diretor").innerHTML = data.user.email;
        document.getElementById("CPF-diretor").innerHTML = data.user.username;
        document.getElementById("Telefone-diretor").innerHTML = data.user.telefone;
    },
    error: function() {
        alert("ERRO - Diretor não encontrado");

    }
});

$.ajax({
    method: "GET",
    url: String(global_link) + "escola/",
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    async: false,
    headers: {
        "Authorization": "Token " + getCookie('MeuToken')
    },
    success: function(data) {
        console.log(data);
        if (data.length > 0) {
            var tbody = document.getElementById('table');
            for (var i = 0; i < data.length; i++) {
                if (data[i].vigencia.pk == sessionStorage.vigencia_pk) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    var td1 = document.createElement('td');
                    var td2 = document.createElement('td');
                    var td3 = document.createElement('td');
                    var td4 = document.createElement('td');
                    var td5 = document.createElement('td');
                    var td6 = document.createElement('td');
                    var img = document.createElement('img');


                    td.appendChild(document.createTextNode(data[i].name));
                    td1.appendChild(document.createTextNode(data[i].cnpj));
                    td2.appendChild(document.createTextNode(data[i].director.name));
                    td3.appendChild(document.createTextNode(data[i].type_school));
                    td4.appendChild(document.createTextNode(data[i].classification_school));
                    td5.appendChild(document.createTextNode(data[i].state));

                    img.classList.add("btn", "icon_modal");
                    img.setAttribute('type', 'button');
                    img.setAttribute('data-toggle', 'modal');
                    img.setAttribute('data-target', '#Modal_Escola');
                    img.setAttribute('title', 'Atualizar');
                    img.setAttribute('data-placement', 'top');
                    img.setAttribute('src', 'icon/tool.png');
                    img.style.cursor = "pointer";
                    img.id = data[i].pk;
                    img.name = "AtualizarEscola";
                    td6.appendChild(img);

                    tr.appendChild(td);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);


                    tbody.appendChild(tr);
                }
            }
        }
    },
    error: function(data) {
        console.log('erro', data)
        alert("Nenhuma Escola encontrada");
    }
});


$.ajax({
    method: "GET",
    url: String(global_link) + "conta/",
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    async: false,
    headers: {
        "Authorization": "Token " + getCookie('MeuToken')
    },
    success: function(data) {
        console.log(data)
        if (data.length > 0) {
            var tbody = document.getElementById('table_banco');
            for (var i = 0; i < data.length; i++) {
                //Não há necessidade de vigências em contas bancárias

                var tr = document.createElement('tr');

                var td = document.createElement('td');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var td4 = document.createElement('td');
                var td5 = document.createElement('td');
                //var img1 = document.createElement('img');
                var img2 = document.createElement('img');
                var img3 = document.createElement('img');

                var select_name = document.getElementById('select_name_bank');
                var selecte_code = document.getElementById('select_bank_code');

                if ($('#select_name_bank option[value="' + data[i].bank + '"]').length == 0) {
                    var option = document.createElement('option');
                    option.value = data[i].bank;
                    option.innerHTML = data[i].bank;
                    select_name.appendChild(option);
                }
                if ($('#select_bank_code option[value="' + data[i].bank_code + '"]').length == 0) {
                    var option1 = document.createElement('option');
                    option1.value = data[i].bank_code;
                    option1.innerHTML = data[i].bank_code;
                    selecte_code.appendChild(option1);
                }

                td.appendChild(document.createTextNode(data[i].bank_code));
                td1.appendChild(document.createTextNode(data[i].bank));
                td2.appendChild(document.createTextNode(data[i].code));
                td3.appendChild(document.createTextNode(data[i].name));
                td4.appendChild(document.createTextNode(data[i].account_number + '-' + data[i].digito_account_number));

                img2.classList.add("btn", "icon_modal_banco");
                img2.setAttribute('type', 'button');
                img2.setAttribute('data-toggle', 'modal');
                img2.setAttribute('data-target', '#Modal_Att_Banco');
                img2.setAttribute('src', 'icon/tool.png');
                img2.setAttribute('title', 'Atualizar');
                img2.setAttribute('data-placement', 'top');
                img2.style.cursor = "pointer";
                img2.id = data[i].pk;
                img2.name = "AtualizarConta";

                img3.classList.add("btn", "icon_modal_banco");
                img3.setAttribute('type', 'button');
                img3.setAttribute('src', 'icon/not.png');
                img3.setAttribute('title', 'Deletar');
                img3.setAttribute('data-placement', 'top');
                img3.style.cursor = "pointer";
                img3.id = data[i].pk;
                img3.name = "DeletarConta";

                td5.appendChild(img2);
                td5.appendChild(img3);
                td5.style.padding = "0%";

                tr.appendChild(td);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);

                tbody.appendChild(tr);
            }

        }
    },
    error: function() {
        alert("ERRO - nenhum Banco foi cadastrado ainda");
    }
});


//Carregando estados e cidades
$(document).ready(function() {
    $.getJSON('estados_cidades.json', function(data) {
        var items = [];
        var options = '<option value="">escolha um estado</option>';
        $.each(data, function(key, val) {
            options += '<option value="' + val.nome + '">' + val.nome + '</option>';
        });
        $("#estados").html(options);

        $("#estados").change(function() {

            var options_cidades = '';
            var str = "";

            $("#estados option:selected").each(function() {
                str += $(this).text();
            });

            $.each(data, function(key, val) {
                if (val.nome == str) {
                    $.each(val.cidades, function(key_city, val_city) {
                        options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                    });
                }
            });
            $("#cidades").html(options_cidades);

        }).change();
    });
});


// $.ajax({
// 	method:"GET",
// 	url: String(global_link) + "bloco-cheques/",
// 	contentType: 'application/json; charset=utf-8',
// 	dataType: "json",
// 	headers: {
// 		"Authorization": "Token " + document.cookie
// 	},
// 	   success: function(data) {
// 			if(data.length > 0)
// 	       	{
// 	       		var tbody = document.getElementById('table_cheque');
// 	       		for (var i = 0; i<data.length; i++)
// 	       		{
// 	       			var tr = document.createElement('tr');

// 	       			var td = document.createElement('td');
// 	       			var td1 = document.createElement('td');
// 	       			var td2 = document.createElement('td');
// 	       			var td3 = document.createElement('td');
// 	       			td.appendChild(document.createTextNode(data[i].initial_numbers));
// 	       			td1.appendChild(document.createTextNode(data[i].last_numbers));
// 	       			td2.appendChild(document.createTextNode(data[i].account));
// 	       			td3.appendChild(document.createTextNode(data[i].director));

// 	       			tr.appendChild(td);
// 	       			tr.appendChild(td1);
// 	       			tr.appendChild(td2);
// 	       			tr.appendChild(td3);

// 	       			tbody.appendChild(tr);
// 				}
// 	       	}
// 	   },
// 	   error: function() {
// 	       alert("Nenhum talão de cheque foi encontrado");
// 	   }
// });