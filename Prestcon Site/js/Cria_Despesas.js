// $("#LimparFiltroDespesa").click(function(){
// 	location.reload();
// });

$("#todos").change(function() {
    if (document.getElementById("todos").checked) {
        document.getElementById("fornecedor").checked = true;
        document.getElementById("conta").checked = true;
        document.getElementById("despesa").checked = true;
        document.getElementById("documento").checked = true;
    } else {
        document.getElementById("fornecedor").checked = false;
        document.getElementById("conta").checked = false;
        document.getElementById("despesa").checked = false;
        document.getElementById("documento").checked = false;
    }
});

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

$.ajax({
    method: "GET",
    url: String(global_link) + "despesa/",
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    headers: {
        "Authorization": "Token " + getCookie('MeuToken')
    },
    success: function(data) {
        console.log(data)
        if (data.length > 0) {

            var DivdaTable = document.createElement("div");
            DivdaTable.classList.add("table-responsive");

            DivdaTable.id = "divtable";

            var Tabela = document.createElement("table");
            Tabela.classList.add("table", "table-bordered");
            Tabela.setAttribute("width", "100%");
            Tabela.setAttribute("cellspacing", "0");
            Tabela.id = "tabela_despesas";

            var THead = document.createElement("thead");
            THead.id = "thead";
            var trH = document.createElement("tr");

            var thF = document.createElement("th");
            var select_fornecedor = document.createElement("select");
            select_fornecedor.id = "fornecedor_sel";

            select_fornecedor.setAttribute("width", "100%");
            select_fornecedor.classList.add("form-control");
            var default_option_fornecedor = document.createElement("option");
            default_option_fornecedor.innerHTML = "Fornecedor";
            //var option_fornecedor = document.createElement("option");
            select_fornecedor.appendChild(default_option_fornecedor);
            thF.appendChild(select_fornecedor);

            var thE = document.createElement("th");
            var select_conta = document.createElement("select");
            select_conta.id = "conta_sel";
            select_conta.setAttribute("width", "100%");
            select_conta.classList.add("form-control");
            var default_option_conta = document.createElement("option");
            default_option_conta.innerHTML = "Conta bancária";
            //var option_conta = document.createElement("option");
            select_conta.appendChild(default_option_conta);
            thE.appendChild(select_conta);

            var thTD = document.createElement("th");
            var select_despesa = document.createElement("select");
            select_despesa.id = "despesa_sel";
            select_despesa.setAttribute("width", "100%");
            select_despesa.classList.add("form-control");
            var default_option_despesa = document.createElement("option");
            default_option_despesa.innerHTML = "Tipo da despesa";
            select_despesa.appendChild(default_option_despesa);
            var option_despesa = document.createElement("option");
            option_despesa.innerHTML = "Material";
            option_despesa.value = "Material";
            select_despesa.appendChild(option_despesa);
            var option_despesa = document.createElement("option");
            option_despesa.innerHTML = "Serviço";
            option_despesa.value = "Serviço";
            select_despesa.appendChild(option_despesa);
            //var option_despesa = document.createElement("option");
            thTD.appendChild(select_despesa);

            var thTE = document.createElement("th");
            var select_documento = document.createElement("select");
            select_documento.id = "documento_sel";
            select_documento.setAttribute("width", "100%");
            select_documento.classList.add("form-control");
            var default_option_documento = document.createElement("option");
            default_option_documento.innerHTML = "Tipo do documento";
            select_documento.appendChild(default_option_documento);
            var option_documento = document.createElement("option");
            option_documento.innerHTML = "Recibo";
            option_documento.value = "Recibo";
            select_documento.appendChild(option_documento);
            var option_documento = document.createElement("option");
            option_documento.innerHTML = "Fatura";
            option_documento.value = "Fatura";
            select_documento.appendChild(option_documento);
            var option_documento = document.createElement("option");
            option_documento.innerHTML = "Nota Fiscal";
            option_documento.value = "Nota Fiscal";
            select_documento.appendChild(option_documento);
            thTE.appendChild(select_documento);

            Tabela.appendChild(THead);
            THead.appendChild(trH);
            trH.appendChild(thF);
            trH.appendChild(thE);
            trH.appendChild(thTD);
            trH.appendChild(thTE);

            var TBody = document.createElement("tbody");
            TBody.id = "tbody";

            for (var i = 0; i < data.length; i++) {
                if (data[i].vigencia == sessionStorage.vigencia_pk) {
                    var trB = document.createElement("tr");
                    trB.setAttribute('id', data[i].pk);
                    trB.style.cursor = "pointer";
                    trB.onclick = function() {
                        sessionStorage.despesa_pk = jQuery(this).attr("id");
                        window.location.href = "cConsultaDespesas.html";
                    }

                    var tdF = document.createElement("td");
                    tdF.innerHTML = data[i].fornecedor.name;

                    if ($('#fornecedor_sel option[value="' + data[i].fornecedor.name + '"]').length == 0) {
                        var option_fornecedor = document.createElement('option');
                        option_fornecedor.innerHTML = data[i].fornecedor.name;
                        option_fornecedor.value = data[i].fornecedor.name;
                        select_fornecedor.appendChild(option_fornecedor);
                    }

                    var tdE = document.createElement("td");
                    if (data[i].bank) {
                        tdE.innerHTML = data[i].bank.name;
                        if ($('#conta_sel option[value="' + data[i].bank.name + '"]').length == 0) {
                            var option_bank = document.createElement('option');
                            option_bank.innerHTML = data[i].bank.name;
                            option_bank.value = data[i].bank.name;
                            select_conta.appendChild(option_bank);
                        }
                    } else {
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

                    DivdaTable.appendChild(Tabela);


                    document.getElementById('DivPai').appendChild(DivdaTable);

                }
            }
            //select_fornecedor.setAttribute("onchange",FiltrarDespesas());

            show('DivPai', true);
            show('loading', false);
        }
    },
    error: function() {
        alert("Nenhuma Despesa foi Cadastrada ainda");
    }
});

