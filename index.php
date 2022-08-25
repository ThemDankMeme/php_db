<?php include 'htmlAccess.inc.php' ?>
<!DOCTYPE html>
<html lang="en">
<?php include 'head.inc.php';?>
<body>
    <div class="container container-fluid">
        <?php include 'modal.inc.php'?>
        <?php include 'select.inc.php'?>
        <div id="table-container">
            <?php include 'table.inc.php'?>
        </div>
        <?php include 'productsVsSales.inc.php' ?>
    </div>
    <div class="col-12 text-center" style="margin-top: 3%">
        <button id="little-button" class="btn btn-dark" type="button" data-bs-toggle='modal' data-bs-target='#myModal' onclick="oneDoesNot()">Pssst..</button>
    </div>
</body>
</html>