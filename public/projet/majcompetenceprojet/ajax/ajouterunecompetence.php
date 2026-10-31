<?php
declare(strict_types=1);

use ClasseMetier\CompetenceProjet;
use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// Vérification d'un appel AJAX par la méthode POST sécurisé par un jeton
// Requete::exigerPost();

// récupération des données transmises
$columns = Requete::postArray('columns');

// ajout de la compétence dans le projet
$competenceProjet = new CompetenceProjet();
$resultat = $competenceProjet->add($columns);

if ($resultat === true) {
    ReponseJson::envoyerMessage('La compétence à été ajoutée dans le projet');
}

ReponseJson::envoyerLesErreurs($resultat);

