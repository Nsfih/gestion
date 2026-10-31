<?php
declare(strict_types=1);

use ClasseMetier\Annonce;

use ClasseTechnique\Requete;
use ClasseTechnique\ReponseJson;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// Suppression des anciennes annonces
$lesIdsSupprimes =  Annonce::deleteOld();

// réponse
ReponseJson::envoyerLesDonnees($lesIdsSupprimes);