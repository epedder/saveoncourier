<?php

//echo phpinfo();

/*
function listFolderFiles($dir){
    $ffs = scandir($dir);
    echo '<ol>';
    foreach($ffs as $ff){
        if($ff != '.' && $ff != '..'){
            echo '<li>'.$ff;
            if(is_dir($dir.'/'.$ff)) listFolderFiles($dir.'/'.$ff);
            echo '</li>';
        }
    }
    echo '</ol>';
}

listFolderFiles('.');
*/

require_once('vendor/autoload.php');

$loader = new Twig_Loader_Filesystem(__DIR__ . '/templates');
$twig = new Twig_Environment($loader, array(
    'cache' => false,
    'debug' => true,
    'strict_variables' => true,
));
$twig->addExtension(new Twig_Extension_Debug());
echo $twig->render('home.html', array('menu' => 'home'));


?>
