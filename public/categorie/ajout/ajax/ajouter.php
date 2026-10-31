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
$columns = Requete::postArray('columns');

// création de l'objet métier
$categorie = new Categorie();

// ajout de la catégorie
$resultat = $categorie->add($columns);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Catégorie ajoutée");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($categorie->getErrors());