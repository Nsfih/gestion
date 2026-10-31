<?php
declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Contraintes SQL de l'application
|--------------------------------------------------------------------------
|
| Ce fichier associe le nom d'une contrainte SQL à un message destiné
| à l'utilisateur.
|
| Les noms correspondent aux contraintes définies dans le script SQL.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Contraintes Primary key
    |--------------------------------------------------------------------------
    */

    'primary@coureur' => "Un coureur avec la même licence est déjà enregistré.",
    'primary@categorie' => "Une catégorie avec le même identifiant est déjà enregistrée.",
    'primary' => "Un enregistrement avec cette clé primaire existe déjà.",


    /*
    |--------------------------------------------------------------------------
    | Contraintes UNIQUE
    |--------------------------------------------------------------------------
    */

    'uk_categorie_nom' => "Une catégorie portant ce nom existe déjà.",

    'uk_club_nom' => "Un club portant ce nom existe déjà.",

    'uk_coureur_nom_prenom_dateNaissance' =>
        "Un coureur portant le même nom, prénom et date de naissance existe déjà.",

    'uk_coureur_email' =>
        "Cette adresse électronique est déjà utilisée.",

    'uk_competenceprojet_idprojet_idcompetence' => "Cette compétence est déjà associée à ce projet.",

    'uk_projet_nom' => "Un projet portant ce nom existe déjà.",

    /*
    |--------------------------------------------------------------------------
    | Contraintes CHECK
    |--------------------------------------------------------------------------
    */

    'ck_categorie_age' => "L'âge minimum doit être inférieur à l'âge maximum.",
    'ck_categorie_id' => "L'identifiant de la catégorie est invalide.",
    'ck_categorie_nom_longueur' => "Le nom de la catégorie doit contenir entre 5 et 20 caractères.",
    'ck_categorie_nom_format' => "Le nom de la catégorie contient des caractères invalides.",
    'ck_categorie_ageMin' => "L'âge minimum doit être compris entre 3 et 99.",
    'ck_categorie_ageMax' => "L'âge maximum doit être compris entre 3 et 99.",

    'ck_club_id' => "L'identifiant du club est invalide.",
    'ck_club_nom' => "Le nom du club est invalide.",

    'ck_coureur_nom' => "Le nom du coureur est invalide.",
    'ck_coureur_prenom' => "Le prénom du coureur est invalide.",
    'ck_coureur_sexe' => "Le sexe du coureur doit être M ou F.",
    'ck_coureur_ffa' => "Le champ FFA du coureur doit valoir 0 ou 1.",
    'ck_coureur_telephone' => "Le numéro de téléphone du coureur est invalide.",

    'ck_annonce_nom_format' => "Le nom de l'annonce ne doit pas contenir de caractères spéciaux.",

    'ck_annonce_actif' => "Le champ 'actif' doit être 0 ou 1.",

    /*
    |--------------------------------------------------------------------------
    | Contraintes FOREIGN KEY
    |--------------------------------------------------------------------------
    */

    'fk_coureur_categorie' => "Suppression impossible : cette catégorie possède des coureurs.",
    'fk_coureur_club' => "Suppression impossible : ce club possède des coureurs.",
    'fk_competenceprojet_projet' => "Suppression impossible : ce projet est utilisé par des compétences associées.",
    'fk_competenceprojet_competence' => "La compétence sélectionnée est introuvable.",
];
