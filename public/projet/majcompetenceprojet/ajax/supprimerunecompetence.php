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
$id = Requete::postString('primaryKey');

// création de l'objet métier
$competenceProjet = new CompetenceProjet();
$resultat = $competenceProjet->delete($id);

if ($resultat === true) {
    ReponseJson::envoyerMessage('La compétence a été supprimée du projet');
}

ReponseJson::envoyerLesErreurs($competenceProjet->getErrors());


