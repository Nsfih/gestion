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

// création de l'objet métier
$categorie = new Categorie();

// suppression de la catégorie
$resultat = $categorie->delete($id);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Catégorie supprimée");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($categorie->getErrors());