function validateEmail(){
       let valid =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       let mail = document.getElementById("email").value;
       if(mail.match(valid)){
              document.getElementById("email").style.background="";
       }
       else{
              document.getElementById("email").style.background = "#F2275D";
              alert("Email input incorrect");
       }
}


function callPost(type){
       let url = "http://localhost/phpWeb/API.php";
       let email = document.getElementById('email').value;
       if(checkUser(email)){
              document.getElementById("email").style.background="";
              let xhr = new XMLHttpRequest();
              xhr.open("POST", url);
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.onreadystatechange = function () {
                     if (xhr.readyState === 4 && xhr.status===200) {
                            let json = JSON.parse(xhr.responseText);
                            if(json.status==="success"){

                            }
                            else if(json.status==="failed"){

                            }
                     }
              };
              let data = setType(type)
              xhr.send(JSON.stringify(data));
       }
       else{
              document.getElementById("email").style.background = "#F2275D";
       }
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
}

function setType(type){
       let data;

       if(type==='read'){
              let start = document.getElementById('start').value;
              let end = document.getElementById('end');
              let page = document.getElementById('page').value;
              if(end !==null && end.value===""){
                     end = new Date();
                     let dd = end.getDate();
                     if(dd<10)
                            dd='0'+dd;
                     let mm = end.getMonth()+1;
                     if(mm<10)
                            mm='0'+mm;
                     let yy = end.getFullYear();
                     end = yy+'-'+mm+'-'+dd;
              }
              data = {"type": "read", "start": start, "end":end};
       }
       else if(type==='update'){
              let email = document.getElementById('email').value;
              let order = document.getElementById('order').value;
              let amount = document.getElementById('amount').value;
              let total = document.getElementById('total').value;
              let date = document.get
              data = {
                     "type": "update",
                     "order": order,
                     "email": email,
                     "amount": }
       }

       return data;
}