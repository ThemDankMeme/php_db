<?php
include 'config.inc.php';

//try {
//    $conn = Database::connection();
//    $sql = "SELECT YEAR(order_date) AS x, COUNT(*) AS y
//            FROM sales
//            GROUP BY YEAR(order_date)";
//    $query = $conn->prepare($sql);
//    $query->execute();
//    $result = $query->fetchAll(PDO::FETCH_OBJ);
//    foreach ($result as $row){
//        $salesDataPoints[] = array("x" => $row->x, "y" => $row->y);
//    }
//    $conn = null;
//}
//catch (PDOException $err){
//    print($err->getMessage());
//}
function getData($type): array{
    $array = array();
    try {
        $conn = Database::connection();
        $sql="";
        if($type=='sale') {
            $sql = "SELECT YEAR(order_date) AS x, COUNT(*) AS y 
                    FROM sales 
                    GROUP BY YEAR(order_date)";
        }elseif ($type=='product'){
            $sql = "SELECT YEAR(date_created) AS x, COUNT(*) AS y 
                    FROM products 
                    GROUP BY YEAR(date_created)";
        }
        $query = $conn->prepare($sql);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_OBJ);
        foreach ($result as $row){
            $array[] = array("x" => $row->x, "y" => $row->y);
        }
        $conn = null;
        return $array;
    }
    catch (PDOException $err){
        print($err->getMessage());
        return $array;
    }
}
$salesDataPoints = getData('sale');
$productsData = getData('product');

?>
<script>
    window.onload = function () {
        let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            exportEnabled: true,
            theme: "dark1",
            title:{
                text: "PRODUCTS vs SALES (per annum)"
            },
            data: [{
                type: "column", //change type to bar, line, area, pie, etc,
                xValueFormatString: "####",
                dataPoints: <?php echo json_encode($salesDataPoints, JSON_NUMERIC_CHECK); ?>
            },{
                type: "line",
                xValueFormatString: "####",
                dataPoints: <?php echo json_encode($productsData, JSON_NUMERIC_CHECK); ?>
            }],
            axisX:{
                valueFormatString: "####",
            }
        });
        chart.render();
    }
</script>
<div id="chartContainer" style="height: 370px; width: 100%;"></div>
<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
