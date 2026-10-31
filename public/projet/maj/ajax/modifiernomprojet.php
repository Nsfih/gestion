<?php
declare(strict_types=1);

use ClasseMetier\Projet;

use Service\ProjetService;
use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// récupération controlée des paramètres transmis
$id = Requete::postInt('primarykey');
$columns = Requete::postArray('columns');

// création de l'objet métier
$projet = new Projet();

// modification du projet
$resultat = $projet->modify($id, $columns);

if ($resultat === true) {
    ReponseJson::envoyerMessage("Le nom du projet a été modifié");
}

// en cas d'erreur
ReponseJson::envoyerLesErreurs($projet->getErrors());




