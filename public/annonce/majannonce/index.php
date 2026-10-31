<?php

use ClasseMetier\Annonce;
use ClasseTechnique\InterfaceSystem;
use ClasseTechnique\UserException;
use ClasseTechnique\Page;
use ClasseTechnique\Requete;

/** @noinspection PhpIncludeInspection */
require $_SERVER['DOCUMENT_ROOT'] . "/../bootstrap/bootstrap.php";

// Vérifier l'utilisation de la méthode Get
Requete::exigerGet();

// Contrôle de la transmission du paramètre attendu : id
$id = Requete::getString('id');

// Contrôle de la validité de l'identifiant : doit être présent dans la table annonce
$ligne = Annonce::getById($id);
if (!$ligne) {
    $titre = "Annonce inexistante";
    $message = "Cette annonce n'existe pas";
    $type= "avertissement";
    $interface = new InterfaceSystem($titre, $message, $type);
    $interface->afficher();
}

$page = new Page();

$page->setTitre("Mise à jour de l'annonce")
    ->setDonnee("annonce", $ligne)
    ->avecJeton()
    ->addScript('/composant/tinymce/tinymce.min.js')
    ->afficher();

