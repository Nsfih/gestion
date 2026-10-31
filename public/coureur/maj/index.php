<?php
declare(strict_types=1);

use ClasseMetier\Categorie;
use ClasseMetier\Club;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

$page = new Page();

$page->setTitre("Modification des coureurs")
    ->setDonnee("lesClubs", Club::getListe())
    ->setDonnee("lesCategories", Categorie::getAll())
    ->avecJeton()
    ->afficher();
