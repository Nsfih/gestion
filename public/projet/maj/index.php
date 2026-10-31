<?php

use ClasseMetier\Projet;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

$page = new Page();
$page->setTitre("Mise à jour des projets")
    ->setDonnee("lesProjets", Projet::getAll())
    ->avecJeton()
    ->afficher();

