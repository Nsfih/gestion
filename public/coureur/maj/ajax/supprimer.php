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

// création de l'objet métier
$Coureur = new Coureur();

// suppression d'un coureur
$resultat = $Coureur->delete($licence);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Coureur supprimé");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($Coureur->getErrors());