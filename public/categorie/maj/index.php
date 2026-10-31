<?php
declare(strict_types=1);

use ClasseMetier\Categorie;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

// alimentation et affichage de l'interface
$page = new Page();
$page->setTitre('Mise à jour des catégories')
    ->setDonnee("lesCategories", Categorie::getAll())
    ->avecJeton()
    ->afficher();

