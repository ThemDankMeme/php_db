<?php include 'htmlAccess.inc.php' ?>
<div class="container container-fluid">
        <div class="row align-middle d-flex align-items-center" style="margin-top: 1%; margin-bottom: 1%; text-align: center" >
            <div class="col" >
                <label for="start">START DATE</label>
                <input type="date" name="start" id="start" onblur="refreshContent()">
            </div>
            <div class="col" >
                <label for="end">END DATE</label>
                <input type="date" name="end" id="end" onblur="refreshContent()">
            </div>
            <div class="col" >
                <button id="add-sale" class="btn btn-dark" type="button" data-bs-toggle='modal' data-bs-target='#myModal' onclick="displayLoad('','create')">ADD SALE</button>
                <button id="download" class="btn btn-dark" type="button" onclick="downloadCSV('download')">Download CSV</button>
            </div>
        </div>
</div>
<hr style="margin-top: 0; margin-bottom: 2%; width: 100%">