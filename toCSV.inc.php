<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Content-Disposition");
session_start();
include_once 'config.inc.php';
class toCSV{
    protected $conn = null;
    public function __construct(){
        $this->conn = Database::connection();
    }
    /*public function jsonToCSV($json, $file): string{
        if(!($temp = file_get_contents($json))){
            die('something wrong');
        }
        $data = json_decode($json, true);
        $fp = fopen($file, 'w');
        $header = false;
        foreach ($data as $row){
            if(empty($header)){
                $header = array_keys($row);
                fputcsv($fp, $header);
                $header = array_flip($header);
            }
            fputcsv($fp, array_merge($header, $row));
        }
        fclose($fp);
        return;
    }*/
    public function dbToCSV($start, $end){
        try {
            $sql = "SELECT *
                    FROM sales 
                    WHERE order_date BETWEEN ? AND ?
                    ORDER BY order_date DESC";
            $query = $this->conn->prepare($sql);
            $query->execute([$start, $end]);
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            $columnNames = array();
            if(!empty($result)){
                $firstRow = $result[1];
                foreach($firstRow as $colName => $val){
                    $columnNames[] = $colName;
                }
                $file = $start.'-'.$end.'.csv';
                header('Content-Type: application/excel');
                header('Content-Disposition: attachment; filename="' . $file . '"');
                ob_clean();
                $fp = fopen('php://output', 'w');
                fputcsv($fp, $columnNames);
                foreach ($result as $row) {
                    fputcsv($fp, $row);
                }
                fclose($fp);
            }else die();

        }
        catch (PDOException $err){
            error_log($err);
        }
    }
}
if($_SERVER['REQUEST_METHOD']=='POST') {
    $_POST = (json_decode(file_get_contents("php://input"), true));
    if (isset($_POST['type'])) {
        $instance = new toCSV();
        if($_POST['type']=='download'){
            $instance->dbToCSV($_POST['start'], $_POST['end']);
        }
        else
            die();
    }
}
