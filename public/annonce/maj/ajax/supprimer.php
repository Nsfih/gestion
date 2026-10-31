<?php
declare(strict_types=1);

use ClasseMetier\Annonce;

use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// récupération des données transmises
$id = Requete::postString('primaryKey');

// création de l'objet métier
$annonce = new Annonce();

// suppression de l'annonce
$resultat = $annonce->delete($id);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Annonce supprimée");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($annonce->getErrors());