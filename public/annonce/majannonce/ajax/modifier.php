<?php
declare(strict_types=1);

use ClasseMetier\Annonce;
use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;
use ClasseTechnique\Std;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// récupération des données transmises
$id = Requete::postString('primaryKey');
$columns = Requete::postArray('columns');

// création de l'objet métier
$annonce = new Annonce();

// modification de l'annonce
$resultat = $annonce->modify($id, $columns);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Annonce modifiée");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($annonce->getErrors());