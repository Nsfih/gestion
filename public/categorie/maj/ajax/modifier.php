<?php
declare(strict_types=1);

use ClasseMetier\Categorie;

use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// récupération des données transmises
$id = Requete::postString('primaryKey');
$columns = Requete::postArray('columns');

// création de l'objet métier
$categorie = new Categorie();

// modification de la catégorie
$resultat = $categorie->modify($id, $columns);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Catégorie modifiée");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($categorie->getErrors());