<?php

use ClasseMetier\Competence;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

$page = new Page();

$page->setTitre("Nouveau projet")
    ->setDonnee("lesCompetencesBloc1", Competence::getLesCompetences(1))
    ->avecJeton()
    ->afficher();
