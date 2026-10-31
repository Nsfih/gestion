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
$actif = Requete::postInt('actif');

// création de l'objet métier
$annonce = new Annonce();

// mise à jour de l'état actif de l'annonce
$columns['actif'] = $actif;
$resultat = $annonce->modify($id, $columns);


if ($resultat === true) {
    ReponseJson::envoyerMessage("Annonce " . ($columns['actif'] == 1 ? "activée" : "désactivée"));
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($annonce->getErrors());