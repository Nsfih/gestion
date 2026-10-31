<?php

use ClasseMetier\Coureur;

use ClasseTechnique\Requete;
use ClasseTechnique\ReponseJson;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

// Vérification d'un appel AJAX par la méthode POST
Requete::exigerGet();

$lesEtudiants = [];

$search = Requete::getString('search');

// Vérification du format de la recherche : lettres, espaces, apostrophes et traits d'union
if (!preg_match('/^[A-Za-zÀ-ÖØ-öø-ÿ\s\'\-]+$/u', $search)) {
    ReponseJson::envoyerLesDonnees([]);
}

// Récupération des étudiants
ReponseJson::envoyerLesDonnees(Coureur::getByNomPrenom($search));

