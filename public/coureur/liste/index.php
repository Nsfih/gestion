<?php

use ClasseMetier\Coureur;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

$page = new Page();
$page->setTitre("Liste des coureurs")
    ->setDonnee("lesCoureurs", Coureur::getAll())
    ->afficher();
