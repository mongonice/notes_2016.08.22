<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wxb2d220ef91e05bce", "21f84a2937a2cf273b5e44e3c645be1e");
$signPackage = $jssdk->GetSignPackage();
echo isset($_GET['callback'])?$_GET['callback']."(".json_encode($signPackage).")":json_encode($signPackage);
?>
