<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
session_start();
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
    public function createSale($email, $order, $date, $amount, $total): string{
        $orgEmail = $email;
        $orgOrder = $order;
        $orgAmount = $amount;
        $orgTotal = $total;
        $orgDate = $date;
        $email = $this->testInput($email);
        $order = $this->testInput($order);
        $amount = $this->testInput($amount);
        $total = $this->testInput($total);
        $date = $this->testInput($date);
        if($this->beforeSubmit($orgEmail, $email) && $this->beforeSubmit($orgOrder, $order) && $this->beforeSubmit($orgAmount, $amount) && $this->beforeSubmit($orgTotal, $total) && $this->beforeSubmit($orgDate, $date)){
            if($this->validEmail($email)){
                $user = $this->findEmail($email);
                $valid = $this->findOrder($user, $order, $date);
                if($user==-1)
                    return $this->setGeneric('failed', 401, "Check Email: ".$email );
                elseif ($valid){
                    return $this->setGeneric('failed', 500, "exists or server error");
                }
                else{
                    try {
                        $date = date_create()->format('Y-m-d');
                        $sql = "INSERT INTO sales (order_no, client, order_date, amount_ex_vat, total)
                                VALUES (:order,:client,:order_date,:amount,:total)";
                        $query = $this->conn->prepare($sql);
                        $query->bindParam(':order', $order, PDO::PARAM_INT);
                        $query->bindParam(':client',$user, PDO::PARAM_INT);
                        $query->bindParam(':order_date',$date, PDO::PARAM_STR);
                        $query->bindParam(':amount', $amount, PDO::PARAM_INT);
                        $query->bindParam(':total',$total, PDO::PARAM_INT);
                        $query->execute();
                        return $this->setGeneric('success', 200, "Sale Successfully Created");
                    }
                    catch (PDOException $err) {
                        return $this->errorMessage($err);
                    }
                }
            }
            else
                return $this->setGeneric('failed', 401, "Invalid User");
        }
        else
            return $this->teaPot();

    }
    private function findOrder($user, $order, $date): bool{
        try {
            $sql = "SELECT order_no
                    from sales
                    WHERE order_no=:order and client=:user and order_date=:date";
            $query = $this->conn->prepare($sql);
            $query->bindParam(':order', $order, PDO::PARAM_INT);
            $query->bindParam(':user', $user, PDO::PARAM_INT);
            $query->bindParam(':date', $date, PDO::PARAM_STR);
            $query->execute();
            if($query->rowCount()!=0){
                return true;
            }
            else return false;
        }
        catch (PDOException $err){
            return true;
        }
    }

    private function validEmail($email): bool{
        $original = $email;
        $email = $this->testInput($email);
        if($this->beforeSubmit($original, $email)) {
            try {
                $sql = "SELECT id 
                        FROM users
                        WHERE users.email=?";
                $query = $this->conn->prepare($sql);
                $query->execute([$email]);
                $result = $query->fetch();
                if($query->rowCount()!=1){
                    return false;
                }else{
                    return true;
                }
            }catch (PDOException $err){
                error_log("Unexpected Error: " . $err->getMessage() . " at " . date_create()->format('Y-m-d H:i:s'));
                return false;
            }
        }
        else
            return false;
    }
    private function findEmail($email):int{
        $original = $email;
        $email = $this->testInput($email);
        if($this->beforeSubmit($original, $email)){
            try {
                $sql = "SELECT id 
                        FROM users
                        WHERE users.email=?";
                $query = $this->conn->prepare($sql);
                $query->execute([$email]);
                $result = $query->fetch();
                if($query->rowCount()!=1){
                    return -1;
                }else{
                    return $result[0];
                }
            }
            catch (PDOException $err){
                return -1;
            }
        }
        else
            return -1;
    }
    public function readRange($start, $end, $page):string{
        $originalStart = $start;
        $originalEnd = $end;
        $orgPage = $page;
        $page = $this->testInput($page);
        $start = $this->testInput($start);
        $end = $this->testInput($end);
        if($this->beforeSubmit($originalStart, $start)&&$this->beforeSubmit($originalEnd, $end) && $this->beforeSubmit($orgPage, $page)){
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
                    if($page>$pages || $page<=0){
                        return $this->teaPot();
                    }
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
                    $json['status'] = 'success';
                    $json['code'] = 200;
                    $json['page'] = (int)$page;
                    $json['count'] = $count;
                    $json['pages'] = $pages;
                    $json['start'] = $offset+1;
                    $json['end'] = $offset+$count;
                    $json['message']= "Sales data between ".$start." and ".$end;
                    while ($row = $query->fetch(PDO::FETCH_ASSOC)){
                        $json['data'][] = [
                            'order'=>$row['order_no'],
                            'name'=>$row['name'],
                            'date'=>$row['order_date'],
                            'amount'=> $row['amount_ex_vat'],
                            'total'=>$row['total'],
                            'revised'=>$row['revised']
                        ];
                    }
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
    public function updateSale($order, $date, $amount, $total){
        $orgOrder = $order;
        $orgDate = $date;
        $orgAmount = $amount;
        $orgTotal = $total;
        $order = $this->testInput($order);
        $date = $this->testInput($date);
        $amount = $this->testInput($amount);
        $total = $this->testInput($total);
        if($this->beforeSubmit($orgOrder, $order)&&$this->beforeSubmit($orgDate, $date)&&$this->beforeSubmit($orgAmount, $amount)&&$this->beforeSubmit($orgTotal, $total)){
            try {
                $sql = "UPDATE sales SET order_date=:date, amount_ex_vat=:amount, total=:total, revised=(revised+1) WHERE order_no=:order";
                $query = $this->conn->prepare($sql);
                $query->bindParam(':date', $date, PDO::PARAM_STR);
                $query->bindParam(':amount', $amount, PDO::PARAM_INT);
                $query->bindParam(':total', $total, PDO::PARAM_INT);
                $query->bindParam(':order', $order, PDO::PARAM_INT);
                $query->execute();
                return $this->setGeneric('success', 200, "Updated Order: ".$order);
            }
            catch (PDOException $err){
                return $this->errorMessage($err);
            }
        }
        else
            return $this->teaPot();
    }
    public function removeSale($order):string{
        $original = $order;
        $order = $this->testInput($order);
        if($this->beforeSubmit($original, $order)) {
            try {
                $sql = "DELETE FROM sales WHERE order_no=:order";
                $query = $this->conn->prepare($sql);
                $query->bindParam(':order', $order, PDO::PARAM_INT);
                $query->execute();
                return $this->setGeneric('success', 200, "Removed Order:".$order);
            } catch (PDOException $err){
                return $this->errorMessage($err);
            }
        }else{
            return $this->teaPot();
        }
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
    public function orderInfo($order):string{
        $original = $order;
        $order = $this->testInput($order);
        if($this->beforeSubmit($original, $order)){
            try {
                $sql = "SELECT order_no, users.name, order_date, amount_ex_vat, total, revised
                        FROM sales 
                        INNER JOIN users ON sales.client=users.id
                        WHERE order_no=?";
                $query = $this->conn->prepare($sql);
                $query->execute([$order]);
                if($query->rowCount()!=0){
                    $json['status']='success';
                    $json['code'] = 200;
                    while ($row = $query->fetch(PDO::FETCH_ASSOC)){
                        $json['data'][] = [
                            'order'=>$row['order_no'],
                            'name'=>$row['name'],
                            'date'=>$row['order_date'],
                            'amount'=> $row['amount_ex_vat'],
                            'total'=>$row['total'],
                            'revised'=>$row['revised']
                        ];
                    }
                    return json_encode($json);
                }else
                    return $this->setGeneric('failed', 200, "No Order Matching: ".$order);
            }
            catch (PDOException $err){
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
        if($_POST['type']=='create'){
            $res = $instance->createSale($_POST['email'], $_POST['order'], $_POST['date'], $_POST['amount'], $_POST['total']);
        }
        elseif ($_POST['type']=='read'){
            $res = $instance->readRange($_POST['start'], $_POST['end'], $_POST['page']);
        }
        elseif ($_POST['type']=='update'){
            $res = $instance->updateSale($_POST['order'], $_POST['date'], $_POST['amount'], $_POST['total']);
        }
        elseif ($_POST['type']=='delete'){
            $res = $instance->removeSale($_POST['order']);
        }
        elseif ($_POST['type']=='check'){
            $res = $instance->findUser($_POST['email']);
        }
        elseif($_POST['type']=='info'){
            $res = $instance->orderInfo($_POST['order']);
        }
        else{
            $res = $instance->setGeneric('failed', 501, 'NO METHOD MATCHING FOUND');
        }
        echo($res);
    }
}
