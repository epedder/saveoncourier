<?php

//echo phpinfo();

$loader = new Twig_Loader_Filesystem(__DIR__ . '/templates');
$twig = new Twig_Environment($loader, array(
    'cache' => false,
    'debug' => true,
    'strict_variables' => true,
));
$twig->addExtension(new Twig_Extension_Debug());
echo $twig->render('home.twig', array());

?>
