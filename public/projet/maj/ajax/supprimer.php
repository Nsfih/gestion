<?php
declare(strict_types=1);

use ClasseMetier\Projet;
use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// récupération des données transmises
$id = Requete::postInt('id');

// suppression via le service
$projet = new Projet();

// suppression d'un projet : la suppression en cascade assure la suppréssion automatique dans la table competenceprojet
$resultat = $projet->delete($id);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Projet supprimé");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($projet->getErrors());
