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
    <script type="text/javascript" src="own_js/functionality.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>
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
                    <table>
                        <table class="table table-dark table-responsive-sm" id="modal-table">
                            <thead>
                            <tr>
                                <th scope="col">Client Name</th>
                                <th scope="col">Order Date</th>
                                <th scope="col">Amount excl. VAT</th>
                                <th scope="col">Total</th>
                                <th scope="col">Revised</th>
                            </tr>
                            </thead>
                            <tbody id="modal-table-body">

                            </tbody>
                        </table>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="confirm" ></button>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <input type="date" name="start" id="start" onblur="callPost('read')">
        </div>
        <div class="col">
            <input type="date" name="end" id="end" onblur="callPost('read')">
        </div>
    </div>
    <div class="row">
        <table class="table table-striped table-dark table-hover" id="table">
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
            <tbody id="table-body">

            </tbody>
        </table>
    </div>
</div>

</body>
</html>