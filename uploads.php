<?php
if(isset($_FILES['image'])){
    $errors = [];
    $file_name = $_FILES['image']['name'];
    $file_tmp = $_FILES['image']['tmp_name'];
    $target_dir = "uploads/galeri/";

    if(move_uploaded_file($file_tmp, $target_dir.$file_name)){
        echo json_encode(["status" => "success", "url" => $target_dir.$file_name]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>