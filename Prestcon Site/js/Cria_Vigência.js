function FiltrarEscola(){
    var nome;

    nome = $("#select_escola").val();

    //deletar a tabela anterior para aparecer apenas os elementos filtrados
    while (document.getElementById("table_banco").firstChild) {
        document.getElementById("table_banco").removeChild(document.getElementById("table_banco").firstChild);
    }

    $.ajax({
    method: "GET",
    url: String(global_link) + "escola/filter?name="+nome,
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    async: false,
    headers: {
        "Authorization": "Token " + getCookie('MeuToken')
    },
    success: function(data) {
        console.log('filtrado com sucesso', data)
        if (data.length > 0) {
            var tbody = document.getElementById('table_banco');
            for (var i = 0; i < data.length; i++) {
                //Não há necessidade de vigências em contas bancárias
                var tr = document.createElement('tr');

                var td = document.createElement('td');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');

                var select_escola = document.getElementById('select_escola');

                if ($('#select_escola option[value="' + data[i].name + '"]').length == 0) {
                    var option = document.createElement('option');
                    option.value = data[i].name;
                    option.innerHTML = data[i].name;
                    select_escola.appendChild(option);
                }

                td.appendChild(document.createTextNode(data[i].name));          
                td1.appendChild(document.createTextNode(data[i].vigencia.initial_date));
                td2.appendChild(document.createTextNode(data[i].vigencia.final_date));
                console.log(data);
               
                tr.appendChild(td);
                tr.appendChild(td1);
                tr.appendChild(td2);


                tbody.appendChild(tr);
            }

        }
    },
    error: function() {
        alert("ERRO");
    }
});

}


$.ajax({
    method: "GET",
    url: String(global_link) + "escola/",
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
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

                var select_escola = document.getElementById('select_escola');

                if ($('#select_escola option[value="' + data[i].name + '"]').length == 0) {
                    var option = document.createElement('option');
                    option.value = data[i].name;
                    option.innerHTML = data[i].name;
                    select_escola.appendChild(option);
                }
                var d = new Date(data[i].vigencia.initial_date)
                var d2 = new Date(data[i].vigencia.final_date)
                td.appendChild(document.createTextNode(data[i].name));            
                td1.appendChild(document.createTextNode(d.getDate()+1 + '/' + (d.getMonth()+1) + '/' + d.getFullYear()));
                td2.appendChild(document.createTextNode(d2.getDate()+1 + '/' + (d2.getMonth()+1) + '/' + d2.getFullYear()));
               
                tr.appendChild(td);
                tr.appendChild(td1);
                tr.appendChild(td2);


                tbody.appendChild(tr);
            }

        }
    },
    error: function() {
        alert("ERRO - nenhuma vigência foi cadastrado ainda");
    }
});
