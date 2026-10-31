<?php
declare(strict_types=1);

use ClasseMetier\Coureur;

use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// récupération des données transmises
$licence = Requete::postString('primaryKey');
$columns = Requete::postArray('columns');

// création de l'objet métier
$coureur = new Coureur();

// modification du coureur
$resultat = $coureur->modify($licence, $columns);


if ($resultat === true) {
    ReponseJson::envoyerMessage("Coureur modifié");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($coureur->getErrors());