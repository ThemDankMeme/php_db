<?php
    require_once 'details.inc.php';
    class Database{
        public static function connection(): PDO
        {
            try{
                $conn = new PDO(DB_TYPE.":host=".DB_HOST."; dbname=".DB_NAME, DB_USER, DB_PWD);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $mess = "Connection Success: ".DB_USER." at ".date_create()->format('Y-m-d H:i:s');
                error_log($mess);
                return $conn;
            }
            catch (PDOException $err){
                $mess = "Connection Failed: ".DB_USER." at ".date_create()->format('Y-m-d H:i:s')." with error ".$err->getMessage();
                error_log($mess);
                die();
            }
        }
    }
