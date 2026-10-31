<?php

use ClasseMetier\Competence;
use ClasseMetier\CompetenceProjet;
use ClasseMetier\Projet;
use ClasseTechnique\InterfaceSystem;
use ClasseTechnique\Requete;
use ClasseTechnique\Page;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

// Contrôle et récupération de la transmission du paramètre attendu : id
$id = Requete::getInt('id');

// Contrôle de la validité de l'identifiant : doit être présent dans la table projet
$ligne = Projet::getById($id);
if (!$ligne) {
    $titre = "Projet inexistant";
    $message = "Le projet $id n'existe pas";
    $type= "erreur";
    $interface = new InterfaceSystem($titre, $message, $type);
    $interface->afficher();
}

$page = new Page();

$page->setTitre("Mise à jour des compétences d'un projet")
    ->setDonnee("projet", $ligne)
    ->setDonnee("lesCompetencesBloc1", Competence::getLesCompetences(1))
    ->setDonnee("lesIdCompetencesProjet", CompetenceProjet::getLesIdCompetences($id))
    ->avecJeton()
    ->afficher();

