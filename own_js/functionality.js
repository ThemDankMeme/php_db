/*function validateEmail(){
       let valid =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       let mail = document.getElementById("email").value;
       if(mail.match(valid)){
              document.getElementById("email").style.background="";
       }
       else{
              document.getElementById("email").style.background = "#F2275D";
              alert("Email input incorrect");
       }
}*/


function callPost(type){
       let url = "http://localhost/phpWeb/API.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url,true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status===200) {
                     let json = JSON.parse(xhr.responseText);
                     if(json.status==="success"){
                            if(type==='read') {
                                   createRow(json);
                            }else if(type==='update'){
                                   alert(json.data.message);
                                   callPost('read');
                            }
                     }
                     else if(json.status==="failed"){
                            console.log(JSON.stringify(json));
                     }
              }
       };
       let data = setType(type)
       xhr.send(JSON.stringify(data));
}
function createRow(json){
       document.getElementById('table-body').innerHTML='';
       for (let i=0; i<json.count;++i){
              let row = document.createElement("tr");
              row.setAttribute("id", json.data[i].order);
              let data = "";
              data += addChild(json, i, data);
              row.innerHTML = data;
              document.getElementById('table-body').appendChild(row);
       }
}
function addChild(json, i, row){
       row+= "<td id='order'>"+json.data[i].order+"</td>";
       row+= "<td id='name'>"+json.data[i].name+"</td>";
       row+= "<td id='date'>"+json.data[i].date+"</td>";
       row+= "<td id='amount'>"+json.data[i].amount+"</td>";
       row+= "<td id='total'>"+json.data[i].total+"</td>";
       row+= "<td id='revised'>"+json.data[i].revised+"</td>";
       row+= "<td><button id='edit' type='button' data-bs-toggle='modal' data-bs-target='#myModal' onclick='update(\""+json.data[i].order+"\")' class='btn btn-default'><i class='bi bi-brush' style='color: #ffca2c'></i></button> ";
       row+= "<td>"+"<button id='remove' type='button' data-bs-toggle='modal' data-bs-target='#myModal' onclick='remove(\""+json.data[i].order+"\")' class='btn btn-default'><i class='bi bi-trash3'style='color: red'></i></button> ";
       return row;
}
function update(elem) {
       document.getElementById('modalTitle').innerHTML = "Update Order: "+elem;
       document.getElementById('confirm').innerHTML = "UPDATE";

       document.getElementById('confirm').setAttribute("onclick", "callPost('update')");
       let url = "http://localhost/phpWeb/API.php";
       let xhr = new XMLHttpRequest();
       xhr.open("POST", url,true);
       xhr.setRequestHeader("Content-Type", "application/json");
       xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status===200) {
                     let json = JSON.parse(xhr.responseText);
                     if (json.status === 'success') {
                            document.getElementById('modal-table-body').innerHTML = '';
                            let row = document.createElement("tr");
                            let data = "";
                            data += modalRow(json, data);
                            row.innerHTML = data;
                            document.getElementById('modal-table-body').appendChild(row);
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
       document.getElementById('confirm').setAttribute("onclick", "callPost('delete')");

}
function modalRow(json, row){
       row += "<td>"+json.data[0].name+"</td>";
       row += "<td><input id='update-date'  name='update-date' type='date' value='"+json.data[0].date+"'></td>";
       row += "<td><input id='update-amount'  name='update-amount' type='number' value='"+json.data[0].amount+"' placeholder='"+json.data[0].amount+"'></td>";
       row += "<td><input id='update-total'  name='update-total' type='number' value='"+json.data[0].total+"' placeholder='"+json.data[0].total+"'></td>";
       row += "<td>"+json.data[0].revised+"</td>";
       return row;
}
function getOrderInfo(order, json){

}
/*function checkUser(email){
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

function setType(type){
       let data;
       if(type==='read') {
              let start = document.getElementById('start').value;
              let end = document.getElementById('end');
              let page = 1;
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

       return data;
}