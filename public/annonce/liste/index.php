<?php
declare(strict_types=1);

use ClasseMetier\Annonce;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

// alimentation et affichage de l'interface
$page = new Page();
$page->setTitre("Liste des annonces")
    ->setDonnee('lesAnnonces', Annonce::getLesAnnoncesActives())
    ->afficher();
