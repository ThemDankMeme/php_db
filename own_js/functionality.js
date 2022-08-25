let timer;
function displayLoad(elem, type){
       document.getElementById('modal-body').innerHTML='';
       document.getElementById('modal-body').innerHTML=spinner();
       document.getElementById('modalTitle').innerHTML="Loading...";
       document.getElementById('confirm').innerHTML=spinner();
       clearTimeout(timer);
       timer = setTimeout(function (){
              if (type==='update'){
                     update(elem);
              }else if(type==='remove'){
                     remove(elem);
              }else if(type==='create'){
                     addSale();
              }
       }, 1000);
}
function oneDoesNot(){
       document.getElementById('modal-body').innerHTML='';
       document.getElementById('modal-body').innerHTML=spinner();
       document.getElementById('modalTitle').innerHTML="Mmmm what might this be?";
       document.getElementById('confirm').innerHTML=spinner();
       clearTimeout(timer);
       timer = setTimeout(function (){
              simply();
       }, 2000);
}
function refreshContent(){
       let url = "http://localhost/phpWeb/table.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("GET", url, true);
       xhr.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                     document.getElementById('table-container').innerHTML = xhr.response;
                     callPost('read');
              }
       };
       xhr.send();
}
function tableLoad(json){
       document.getElementById('table-body').innerHTML='';
       document.getElementById('table-body').innerHTML = spinner();
       clearTimeout(timer);
       timer = setTimeout(function (){
              createReadTable(json);
       }, 1000);
}
function spinner(){
       return "<div class='spinner-border text-secondary' role='status' id='loading'>" +
           "<span class='visually-hidden'>Loading...</span>" +
           "</div>";
}
function validateEmail(){
       let valid =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       let mail = document.getElementById("user-email").value;
       if(mail.match(valid)){
              document.getElementById("user-email").style.background="";
       }
       else{
              document.getElementById("user-email").style.background = "#F2275D";
       }
}
function validateValues(value){
       let temp = document.getElementById(value);
       if(temp.value===""){
              temp.style.background="#F2275D";
       }
       else{
              temp.style.background="";
       }
}
function clicked(elem){
       if(elem==='prev'){
              document.getElementById('prev-page').value = true;
       }
       else if(elem==='next'){
              document.getElementById('next-page').value = true;
       }
}
function callPost(type){
       let url = "http://localhost/phpWeb/API.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url,true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                     let json = JSON.parse(xhr.responseText);
                     if (json.status === "success") {
                            if (type === 'read') {
                                   tableLoad(json);
                            } else if (type === 'update') {
                                   callPost('read');
                            } else if (type === 'delete') {
                                   refreshContent()
                            } else if (type === 'create') {
                                   refreshContent();
                            }
                     } else if (json.status === "failed") {
                            alert(json.data.message);
                     }
              }
       };
       let data = setType(type);
       xhr.send(JSON.stringify(data));
}
function endDate(){
       let end = document.getElementById('end');
       if (end !== null && end.value === "") {
              end = new Date();
              let dd = end.getDate();
              if (dd < 10)
                     dd = '0' + dd;
              let mm = end.getMonth() + 1;
              if (mm < 10)
                     mm = '0' + mm;
              let yy = end.getFullYear();
              end = yy + '-' + mm + '-' + dd;
       } else {
              end = end.value;
       }
       return end;
}
function setType(type){
       let data;
       if(type==='read' || type==='download') {
              let start = document.getElementById('start').value;
              let end = endDate();
              let page = parseFloat(document.getElementById('current-page').innerHTML);
              if(type==='read') {
                     if (page === 0) {
                            page = 1;
                     } else if (page >= 1) {
                            if (document.getElementById('next-page').value === 'true') {
                                   document.getElementById('next-page').value = false;
                                   page += parseFloat(1);
                            } else if (document.getElementById('prev-page').value === 'true' && page !== 1) {
                                   document.getElementById('prev-page').value = false;
                                   page -= parseFloat(1);
                            }
                     }
                     data = {
                            "type": "read",
                            "start": start,
                            "end": end,
                            "page": page
                     };
              }else if(type==='download'){
                     data={
                            "type": "download",
                            "start": start,
                            "end": end
                     };
              }
       }
       else if(type==='update'){
              let order = document.getElementById('confirm').value;
              let amount = document.getElementById('update-amount').value;
              let total = document.getElementById('update-total').value;
              let date = document.getElementById('update-date').value;
              data = {
                     "type": "update",
                     "order": order,
                     "amount": amount,
                     "total": total,
                     "date": date
              };
       }
       else if(type==='delete'){
              let order = document.getElementById('confirm').value;
              data = {
                     "type": "delete",
                     "order": order
              };
       }
       else if(type==='create'){
              let email = document.getElementById('user-email').value;
              let order = document.getElementById('user-order').value;
              let date = document.getElementById('user-date').value;
              let amount = document.getElementById('user-amount').value;
              let total = document.getElementById('user-total').value;
              data = {
                     "type":"create",
                     "email": email,
                     "order": order,
                     "date": date,
                     "amount":amount,
                     "total": total
              };
       }
       return data;
}
function createReadTable(json){
       document.getElementById('table-body').innerHTML='';
       for (let i=0; i<json.count;++i){
              let row = document.createElement("tr");
              row.setAttribute("id", json.data[i].order);
              let data = "";
              data += createReadRow(json, i, data);
              row.innerHTML = data;
              document.getElementById('table-body').appendChild(row);
       }
       document.getElementById('current-page').innerHTML = json.page;
       if(json.page===1 && json.page<json.pages){
              document.getElementById('next-page').innerHTML="<i class='bi bi-arrow-right'></i>";
              document.getElementById('next-page').disabled = false;
              document.getElementById('prev-page').innerHTML="<i class='bi bi-dash'></i>";
              document.getElementById('prev-page').disabled= true;
       }
       else if(json.page===json.pages && json.page!==1){
              document.getElementById('prev-page').innerHTML="<i class='bi bi-arrow-left'></i>";
              document.getElementById('prev-page').disabled= false;
              document.getElementById('next-page').innerHTML="<i class='bi bi-dash'></i>";
              document.getElementById('next-page').disabled = true;
       }
       else if(json.page<json.pages && json.page>1){
              document.getElementById('next-page').innerHTML="<i class='bi bi-arrow-right'></i>";
              document.getElementById('prev-page').innerHTML="<i class='bi bi-arrow-left'></i>";
              document.getElementById('next-page').disabled= false;
              document.getElementById('prev-page').disabled= false;
       }

}
function simply(){
       let url = "http://localhost/phpWeb/nopeNothingHere.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url, true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status===200) {
                     let json = JSON.parse(xhr.responseText);
                     if(json.url!==""){
                            walkInto(json);
                     }
              }
       };
       xhr.send();
}
function createReadRow(json, i, row){
       row+= "<td id='order'>"+json.data[i].order+"</td>";
       row+= "<td id='name'>"+json.data[i].name+"</td>";
       row+= "<td id='date'>"+json.data[i].date+"</td>";
       row+= "<td id='amount'>"+json.data[i].amount+"</td>";
       row+= "<td id='total'>"+json.data[i].total+"</td>";
       row+= "<td id='revised'>"+json.data[i].revised+"</td>";
       row+= "<td><button id='edit' type='button' data-bs-toggle='modal' data-bs-target='#myModal'  onclick='displayLoad(\""+json.data[i].order+"\", \"update\")' class='btn btn-default'><i class='bi bi-brush' style='color: #ffca2c'></i></button> ";
       row+= "<td>"+"<button id='remove' type='button' data-bs-toggle='modal' data-bs-target='#myModal' onclick='displayLoad(\""+json.data[i].order+"\", \"remove\")' class='btn btn-default'><i class='bi bi-trash3'style='color: red'></i></button> ";
       return row;
}
function update(elem) {
       document.getElementById('modalTitle').innerHTML = "Update Order: "+elem;
       document.getElementById('confirm').innerHTML = "UPDATE";
       document.getElementById('confirm').setAttribute("onclick", "callPost('update')");
       let url = "http://localhost/phpWeb/API.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url,true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                     let json = JSON.parse(xhr.responseText);
                     if (json.status === 'success') {
                            document.getElementById('modal-body').innerHTML ='';
                            let table = updateRemoveTable(json, 'update');
                            document.getElementById('modal-body').appendChild(table);
                            document.getElementById('confirm').setAttribute('value', json.data[0].order);
                     } else {
                            alert(json.data.message);
                     }
              }
       };
       let data = {
              "type": "info",
              "order": elem
       };
       xhr.send(JSON.stringify(data));
}
function remove(elem){
       document.getElementById('modalTitle').innerHTML = "Delete Order: "+elem;
       document.getElementById('confirm').innerHTML = "DELETE";
       document.getElementById('confirm').setAttribute("onclick", "confirmDelete() && callPost('delete')");
       let url = "http://localhost/phpWeb/API.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url,true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                     let json = JSON.parse(xhr.responseText);
                     if (json.status === 'success') {
                            document.getElementById('modal-body').innerHTML ='';
                            let table = updateRemoveTable(json,'remove');
                            document.getElementById('modal-body').appendChild(table);
                            document.getElementById('confirm').setAttribute('value', json.data[0].order);
                     } else {
                            alert(json.data.message);
                     }
              }
       };
       let data = {
              "type": "info",
              "order": elem
       };
       xhr.send(JSON.stringify(data));
}
function confirmDelete(){
       return confirm("Proceed with Delete?");
}
function updateRemoveTable(json, type){
       let table = document.createElement("table");
       table.setAttribute('class', 'table table-dark table-sm');
       table.setAttribute('id', 'modal-table');
       let tableHead = document.createElement("thead");
       tableHead.setAttribute('id', 'modal-table-head');
       let tableBody = document.createElement("tbody");
       tableBody.setAttribute('id', 'modal-table-body');
       let body = document.createElement("tr");
       let head = document.createElement("tr");
       let bodyData = "";
       let headData = "";
       if(type==='update')
              bodyData += updateModalBody(json, bodyData);
       else if(type==='remove')
              bodyData += removeModalBody(json, bodyData);
       headData += updateRemoveModalHead(headData);
       body.innerHTML = bodyData;
       head.innerHTML = headData;
       tableHead.appendChild(head);
       tableBody.appendChild(body);
       table.appendChild(tableHead);
       table.appendChild(tableBody);
       return table;
}
function updateRemoveModalHead(row){
       row+= "<th scope='col'>Client Name</th>";
       row+= "<th scope='col'>Order Date</th>";
       row+= "<th scope='col'>Amount excl. VAT</th>";
       row+= "<th scope='col'>Total</th>";
       row+= "<th scope='col'>Revised</th>";
       return row;
}
function updateModalBody(json, row){
       row += "<td>"+json.data[0].name+"</td>";
       row += "<td><input id='update-date'  name='update-date' type='date' value='"+json.data[0].date+"'></td>";
       row += "<td><input id='update-amount'  name='update-amount' type='number' maxlength='10' min='0' value='"+json.data[0].amount+"' placeholder='"+json.data[0].amount+"'></td>";
       row += "<td><input id='update-total'  name='update-total' type='number' maxlength='10' min='0' value='"+json.data[0].total+"' placeholder='"+json.data[0].total+"'></td>";
       row += "<td>"+json.data[0].revised+"</td>";
       return row;
}
function removeModalBody(json ,row){
       row += "<td>"+json.data[0].name+"</td>";
       row += "<td>"+json.data[0].date+"</td>";
       row += "<td>"+json.data[0].amount+"</td>";
       row += "<td>"+json.data[0].total+"</td>";
       row += "<td>"+json.data[0].revised+"</td>";
       return row;
}
function addSale(){
       document.getElementById('modalTitle').innerHTML = "Add Sale";
       document.getElementById('confirm').innerHTML = "CREATE";
       document.getElementById('confirm').setAttribute("onclick", "callPost('create')");
       document.getElementById('modal-body').innerHTML = '';
       let saleBody = document.createElement('div');
       saleBody.setAttribute('class', 'container container-fluid');
       saleBody.appendChild(labelGenerator('user-email', 'EMAIL'));
       saleBody.appendChild(emailInput('user-email'));
       saleBody.appendChild(labelGenerator('user-order', 'ORDER#'));
       saleBody.appendChild(orderInput('user-order'));
       saleBody.appendChild(labelGenerator('user-date', 'ORDER DATE'));
       saleBody.appendChild(dateInput('user-date'));
       saleBody.appendChild(labelGenerator('user-amount', 'AMOUNT excl. VAT'));
       saleBody.appendChild(valueInput('user-amount'));
       saleBody.appendChild(labelGenerator('user-total', 'TOTAL'));
       saleBody.appendChild(valueInput('user-total'));
       document.getElementById('modal-body').appendChild(saleBody);
}
function emailInput(id){
       let email = document.createElement('input');
       email.required = true;
       email.setAttribute('id', id );
       email.setAttribute('name', id);
       email.setAttribute('type', 'email');
       email.setAttribute('onblur', 'validateEmail()');
       return email;
}
function dateInput(id){
       let date = document.createElement('input');
       date.required = true;
       date.setAttribute('id', id );
       date.setAttribute('name', id);
       date.setAttribute('type', 'date');
       date.setAttribute('onblur', "validateValues(\'"+id+"\')");
       return date;
}
function orderInput(id){
       let order = document.createElement('input');
       order.required = true;
       order.setAttribute('id', id );
       order.setAttribute('name', id);
       order.setAttribute('type', 'number');
       order.setAttribute('onblur', "validateValues(\'"+id+"\')");
       order.setAttribute('minlength', '3');
       order.setAttribute('maxlength', '20');
       return order;
}
function valueInput(id){
       let value = document.createElement('input');
       value.required = true;
       value.setAttribute('id', id );
       value.setAttribute('name', id);
       value.setAttribute('type', 'number');
       value.setAttribute('onblur', "validateValues(\'"+id+"\')");
       value.setAttribute('minlength', '3');
       value.setAttribute('maxlength', '20');
       value.setAttribute('min', '0');
       return value;
}
/*function createArray(id, name, type, on, func, param, minL, maxL, minV){
       return {
              "id": id,
              "name": name,
              "type": type,
              "on": on,
              "func": func,
              "param": param,
              "minLen": minL,
              "maxLen": maxL,
              "minVal": minV
       };
}
function inputAttributes(){
       return{
              "id": "id",
              "name": "name",
              "type": "type",
              "minLen": "minlength",
              "maxLen": "maxlength",
              "minVal": "min"
       };
}*/
function labelGenerator(type, desc){
       let label = document.createElement('label');
       label.setAttribute('for', type);
       let b = document.createElement('b');
       b.innerHTML = desc;
       label.appendChild(b);
       return label;
}
/*function inputGenerator(arr){
       let attr = inputAttributes();
       let input = document.createElement('input');
       for(const key in arr){
              if(key!==''){

              }
       }

       return input;
}

function addSaleModalBody(row){
       row += "<td><input id='user-email'  name='user-email' type='email' onblur='validateEmail()' required></td>";
       row += "<td><input id='user-order'  name='user-order' type='number' minlength='3' maxlength='20' onblur='validateValues('user-order')' required></td>";
       row += "<td><input id='user-date'  name='user-date' type='date' onblur='validateValues('user-date')' required></td>";
       row += "<td><input id='user-amount'  name='user-amount' type='number' minlength='1' maxlength='10' min='0' onblur='validateValues('user-amount')' required></td>";
       row += "<td><input id='user-total'  name='user-total' type='number' minlength='1' maxlength='10' min='0' onblur='validateValues('user-total')' required></td>";
       return row;
}
function addSaleModalHead(row){
       row+= "<th scope='col'>Email</th>";
       row+= "<th scope='col'>Order#</th>";
       row+= "<th scope='col'>Date</th>";
       row+= "<th scope='col'>Amount excl. VAT</th>";
       row+= "<th scope='col'>Total</th>";
       return row;
}

function checkUser(email){
       let url = "http://localhost/phpWeb/API.php";
       let valid;
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status===200) {
                     let json = JSON.parse(xhr.responseText);
                     if(json.status==="success"){
                            valid = true;
                     }
                     else if(json.status==='failed'){
                            alert("No Account Matching: "+ email);
                            valid = false;
                     }
                     else if(json.status==='error'){
                            alert("Unexpected Error: "+ json.data.message);
                            valid = false;
                     }
              }
       };
       let data = {"type": "check", "email": email};
       xhr.send(JSON.stringify(data));
       return valid;
}*/
function downloadCSV(type){
       // const {Parser} = require('json2csv');
       // const fields = ['ID', 'Order#', 'Client', 'Date', 'Amount_Excl_VAT', 'Total', 'Revised'];
       // const json2csvParser = new Parser({fields});
       // const csv = json2csvParser.parse(json);
       // console.log(JSON.stringify(json));
       // console.log(csv);
       //let array = typeof json != 'object' ? JSON.parse(json) : json;
       //console.log(array);
       // for (let i = 0; i < array.length; i++) {
       //        let line = '';
       //        for (let index in array[i]) {
       //               if (line !== '') line += ','
       //
       //               line += array[i][index];
       //        }
       //
       //        str += line + '\r\n';
       // }
       // const replacer = (key, value) => (value === null ? "" : value);
       // const header = Object.keys(json[0]);
       // const csv = [
       //        header.join(","),
       //        ...json.map((row) =>
       //            header
       //                .map((fieldName) => JSON.stringify(row[fieldName], replacer))
       //                .join(",")
       //        ),
       // ].join("\r\n");
       // console.log(csv);
       // let hidden = document.createElement('a');
       // console.log(str);
       // hidden.href='data:text/csv;charset=utf-8,' + encodeURI(str);
       // hidden.target='_blank';
       // hidden.download = 'testing.csv';
       // hidden.click();
       let url = "http://localhost/phpWeb/toCSV.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url, true);
       xhr.setRequestHeader("Content-Type", "application/excel");
       xhr.onreadystatechange = function() {
              let data = xhr.responseText;
              if (this.readyState === 4 && this.status === 200) {
                     if(data!==""){
                     let hidden = document.createElement('a');
                     hidden.href = 'data:text/csv;charset=utf-8,'+ encodeURI(data);
                     hidden.target = '_blank';
                     let start = document.getElementById('start').value;
                     let end = endDate();
                     hidden.download = start +"_-_"+ end + '.csv';
                     hidden.click();
                     }
                     else{
                            alert("ERROR RETRIEVING CSV");
                     }
              }
       };
       let data = setType(type);
       xhr.send(JSON.stringify(data));
}
function mordor(){
       simply();
}
function walkInto(json){
       document.getElementById('modalTitle').innerHTML = "RED PILL OR BLUE PILL";
       document.getElementById('confirm').innerHTML = "MEMES";
       document.getElementById('confirm').setAttribute("onclick", "mordor()");
       document.getElementById('modal-body').innerHTML = '';
       let memeBody = document.createElement('div');
       memeBody.setAttribute('class', 'container container-fluid text-center');
       memeBody.setAttribute('style', 'width: 80%;');
       let img = document.createElement('img');
       img.setAttribute('class', 'img-fluid');
       img.setAttribute('src', json.url);
       memeBody.appendChild(img);
       document.getElementById('modal-body').appendChild(memeBody);
}
