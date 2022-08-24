<?php
if (!session_id()) session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="own_css/extra.css">
    <script type="text/javascript" src="own_js/functionality.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <style>
        #prev-page, #next-page{
            border:none;
            background: none;

        }
    </style>

</head>
<body>
<div class="container container-fluid">
    <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle" ></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal-body">

                </div>
                <div class="modal-footer ">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="confirm" ></button>
                </div>
            </div>
        </div>
    </div>
    <div class="container container-fluid">
        <div class="row align-middle d-flex align-items-center" style="margin-top: 1%; margin-bottom: 1%; text-align: center" >
            <div class="col" >
                <label for="start">START DATE</label>
                <input type="date" name="start" id="start" onblur="callPost('read')">
            </div>
            <div class="col" >
                <label for="end">END DATE</label>
                <input type="date" name="end" id="end" onblur="callPost('read')">
            </div>
            <div class="col" >
                <label for="add-sale">ADD SALE</label>
                <button id="add-sale" class="btn btn-dark" type="button" data-bs-toggle='modal' data-bs-target='#myModal' style="width: 80%;" onclick="displayLoad('','create')">ADD SALE</button>
            </div>
        </div>
    </div>
    <hr style="margin-top: 0; margin-bottom: 2%; width: 100%">
    <div class="row">
        <div class="col-md-12">
            <div class="panel-body">
                <table class="table table-striped table-dark table-hover" id="table" style="width: 100%">
                    <thead>
                    <tr>
                        <th scope="col">Order#</th>
                        <th scope="col">Client Name</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Amount excl. VAT</th>
                        <th scope="col">Total</th>
                        <th scope="col">Revised</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Remove</th>
                    </tr>
                    </thead>
                    <tbody id="table-body" class="align-middle">

                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="row" style="text-align: center" id="page-count">
        <button class="col"  id="prev-page" onclick="clicked('prev'); callPost('read')" value="false" disabled><i class="bi bi-dash"></i></button>
        <span class="col"  id="current-page" >0</span>
        <button class="col"  id="next-page" onclick="clicked('next'); callPost('read')" value="false" disabled><i class="bi bi-dash"></i></button>
    </div>
</div>

</body>
</html>