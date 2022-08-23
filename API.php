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
        catch (PDOException $err){
            echo $err->getMessage();
        }
    }
    public function setGeneric($status, $code, $data):string{
        $json['status']=$status;
        $json['code']= $code;
        $json['timestamp']=time();
        $json['data']=['message'=>$data];
        return json_encode($json);
    }
    public function createSale(){

    }
    public function readRange($start, $end, $page):string{
        $originalStart = $start;
        $originalEnd = $end;
        $start = $this->testInput($start);
        $end = $this->testInput($end);
        if($this->beforeSubmit($originalStart, $start)&&$this->beforeSubmit($originalEnd, $end)){
            try {
                $sql = "SELECT COUNT(*) FROM sales WHERE order_date BETWEEN ? AND ?";
                $query = $this->conn->prepare($sql);
                $query->execute([$start, $end]);
                $total = $query->fetchColumn();

                if($total==0){
                    return $this->setGeneric('failed', 204, 'No Sales between '.$start.' and '.$end);
                }else{
                    $limit = 10;
                    $pages = ceil($total/$limit);
                    $offset = ($page-1)*$limit;
                    $sql = "SELECT order_no, users.name, order_date, amount_ex_vat, total, revised
                            FROM sales 
                            INNER JOIN users ON sales.client=users.id
                            WHERE order_date BETWEEN :start AND :end 
                            ORDER BY order_date DESC 
                            LIMIT :limit OFFSET :offset";
                    $query = $this->conn->prepare($sql);
                    $query->bindParam(':start', $start, PDO::PARAM_STR);
                    $query->bindParam(':end', $end, PDO::PARAM_STR);
                    $query->bindParam(':limit', $limit, PDO::PARAM_INT);
                    $query->bindParam(':offset', $offset, PDO::PARAM_INT);
                    $query->execute();
                    $count = $query->rowCount();
                    $json = $this->setGeneric('success', 200, 'Sales data between '.($offset+1).' and '.($offset+$count));
                    $json = json_decode($json);
                    while ($row = $query->fetch(PDO::FETCH_ASSOC)){
                        $json['data'][] = [
                            'order_no'=>$row['order_no'],
                            'name'=>$row['name'],
                            'order_date'=>$row['order_date'],
                            'amount_ex_vat'=> $row['amount_ex_vat'],
                            'total'=>$row['total'],
                            'revised'=>$row['revised']
                        ];
                    }
                    echo ("Total : ".$total." Pages: ".$pages);
                    return json_encode($json);
                }

            }
            catch (PDOException $err){
                return $this->errorMessage($err);
            }
        }
        else
            return $this->teaPot();

    }
    private function errorMessage(PDOException $err):string{
        error_log("Unexpected Error: " . $err->getMessage() . " at " . date_create()->format('Y-m-d H:i:s'));
        return $this->setGeneric('error', 500, $err->getMessage());
    }
    private function teaPot():string{
        return $this->setGeneric('error', 418, "The server refuses the attempt to brew coffee with a teapot.");
    }
    public function updateSale(){

    }
    public function removeSale(){
        
    }
    public function findUser($email): string{
        $original = $email;
        $email = $this->testInput($email);
        if($this->beforeSubmit($original, $email)) {
            try {
                $sql = "SELECT id FROM users WHERE users.email=?";
                $query = $this->conn->prepare($sql);
                $query->execute([$email]);
                if ($query->rowCount() == 0) {
                    return $this->setGeneric('failed', 401, 'Invalid User: ' . $email);
                } else {
                    return $this->setGeneric('success', 200, 'Valid User: ' . $email);
                }
            } catch (PDOException $err) {
                return $this->errorMessage($err);
            }
        }
        else
            return $this->teaPot();
    }
    private function testInput($value): string
    {
        $value = trim($value);
        $value = stripcslashes($value);
        return htmlspecialchars($value);
    }

    private function beforeSubmit($original, $temp): bool
    {
        if ($original != $temp)
            return false;
        else return true;
    }


}
if($_SERVER['REQUEST_METHOD']=='POST') {
    $_POST = (json_decode(file_get_contents("php://input"), true));
    if (isset($_POST['type'])) {
        $instance = new API();
        $db = DB_NAME;
        if($_POST['type']=='create'){

        }
        elseif ($_POST['type']=='read'){
            $res = $instance->readRange($_POST['start'], $_POST['end']);

        }
        elseif ($_POST['type']=='update'){

        }
        elseif ($_POST['type']=='delete'){

        }
        elseif ($_POST['type']=='check'){
            $res = $instance->findUser($_POST['email']);
        }
        else{
            $res = $instance->setGeneric('Failed', 501, 'NO METHOD MATCHING FOUND');
        }
        return $res;


    }
}
$instance = new API();
//$instance->test();
echo ($instance->readRange('1995-01-01', '2018-12-31', 5));