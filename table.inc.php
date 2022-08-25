<?php include 'htmlAccess.inc.php' ?>
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
