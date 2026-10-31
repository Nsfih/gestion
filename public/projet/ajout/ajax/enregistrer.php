<?php
declare(strict_types=1);

use Service\ProjetService;
use ClasseTechnique\ReponseJson;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/bootstrap.php';

// récupération controlée des paramètres transmis
$nom = Requete::postString('nom');
$lesCompetences = Requete::postArray('lesCompetences');

// enregistrement du projet via le service
$service = new ProjetService();
$service->enregistrer($nom, $lesCompetences);

// Envoi de la réponse
ReponseJson::envoyerMessage("Le projet a été enregistré avec succès");

