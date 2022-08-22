<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
session_start();
$jsonData = file_get_contents("php://input");
$urlData = json_decode($jsonData);
include_once 'config.inc.php';
class API{
    protected $conn = null;
    public function __construct(){
        $this->conn = Database::connection();
    }
    function test(){
        try {
            $sql = "SELECT id, item_code, item_name, price FROM products";
            $query = $this->conn->prepare($sql);
            $query->execute();
            while ($row = $query->fetch(PDO::FETCH_ASSOC)){
                echo $row['id']." ".$row['item_code']." ".$row['item_name']." ".$row['price'].PHP_EOL;

            }
        }
        catch (Exception $err){
            echo $err->getMessage();
        }
    }
    public function setGeneric($status, $code, $data):string{
        $json['status']=$status;
        $json['code']= $code;
        $json['timestamp']=time();
        $json['data']=['Error'=>$data];
        return json_encode($json);
    }
    public function createSale(){

    }
    public function readRange(){

    }
    public function updateSale(){

    }
    public function removeSale(){
        
    }


}
if($_SERVER['REQUEST_METHOD']=='POST') {
    $_POST = (json_decode(file_get_contents("php://input"), true));
    if (isset($_POST['type'])) {
        $instance = new API();
        if($_POST['type']=='create'){

        }
        elseif ($_POST['type']=='read'){

        }
        elseif ($_POST['type']=='update'){

        }
        elseif ($_POST['type']=='delete'){

        }
        else{
            $res = $instance->setGeneric('Failed', 406, 'NO METHOD MATCHING FOUND');
        }
        return $res;


    }
}
$instance = new API();
$instance->test();