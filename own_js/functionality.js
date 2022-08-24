let timer;
setTimeout(function (){
       document.getElementById('myModal').ariaModal;
}, 2000);
function displayLoad(elem, type){
       document.getElementById('modal-body').innerHTML='';
       document.getElementById('modal-body').innerHTML=spinner();
       document.getElementById('modalTitle').innerHTML="Loading...";
       document.getElementById('confirm').innerHTML=spinner();
       clearTimeout(timer);
       console.log(type);
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
              alert("Email input incorrect");
       }
}
function validateValues(value){
       let temp = document.getElementById(value);
       if(temp.value===""){
              temp.style.background="#F2275D";
              alert("Missing Field: "+value);
       }
       else{
              temp.style.background="";
       }
}
function callPost(type){
       let url = "http://localhost/phpWeb/API.inc.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url,true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status===200) {
                     let json = JSON.parse(xhr.responseText);
                     if(json.status==="success"){
                            if(type==='read') {
                                   createReadTable(json);
                            }else if(type==='update'){
                                   alert(json.data.message);
                                   callPost('read');
                            }else if(type==='delete'){
                                   alert(json.data.message);
                                   callPost('read');
                            }else if(type==='create'){
                                   alert(json.data.message)
                                   callPost('read');
                            }
                     }
                     else if(json.status==="failed"){
                            alert(json.data.message);
                     }
              }
       };
       let data = setType(type);
       xhr.send(JSON.stringify(data));
}
function setType(type){
       let data;
       if(type==='read') {
              let start = document.getElementById('start').value;
              let end = document.getElementById('end');
              let page = parseFloat(document.getElementById('current-page').innerHTML);
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
              if(page===0){
                     page = 1;
              }else if(page>=1){
                     if(document.getElementById('next-page').value==='true'){
                            document.getElementById('next-page').value = false;
                            page += parseFloat(1);
                     }
                     else if(document.getElementById('prev-page').value ==='true' && page!==1){
                            document.getElementById('prev-page').value = false;
                            page -= parseFloat(1);
                     }
              }
              data = {"type": "read", "start": start, "end": end, "page": page};
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
                     "date": date};
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
       console.log(JSON.stringify(json));
       if(json.page<json.pages && json.page>1){
              document.getElementById('next-page').innerHTML="<i class='bi bi-arrow-right'></i>";
              document.getElementById('prev-page').innerHTML="<i class='bi bi-arrow-left'></i>";
              document.getElementById('next-page').disabled= false;
              document.getElementById('prev-page').disabled= false;
       }
       else if(json.page===1){
              console.log(json.page);
              document.getElementById('next-page').innerHTML="<i class='bi bi-arrow-right'></i>";
              document.getElementById('next-page').disabled = false;
              document.getElementById('prev-page').innerHTML="<i class='bi bi-dash'></i>";
              document.getElementById('prev-page').disabled= true;
       }
       else if(json.page===json.pages){
              document.getElementById('prev-page').innerHTML="<i class='bi bi-arrow-left'></i>";
              document.getElementById('prev-page').disabled= false;
              document.getElementById('next-page').innerHTML="<i class='bi bi-dash'></i>";
              document.getElementById('next-page').disabled = true;
       }

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
}*/
/*
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
}*/
/*
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
function clicked(elem){
       if(elem==='prev'){
              document.getElementById('prev-page').value = true;
       }
       else if(elem==='next'){
              document.getElementById('next-page').value = true;
       }
}
