<?php
declare(strict_types=1);

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

use ClasseMetier\Annonce;
use ClasseTechnique\Page;

$page = new Page();
$page->setTitre("Liste des annonces")
    ->setDonnee("lesAnnonces", Annonce::getAll())
    ->avecJeton()
    ->afficher();
