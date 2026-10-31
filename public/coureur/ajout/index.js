"use strict";
// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {retournerVersApresConfirmation } from "/composant/fonction/afficher.js";
import {configurerFormulaire, configurerDate, donneesValides, filtrerLaSaisie} from "/composant/fonction/formulaire.js";
import {enleverAccent, supprimerEspace } from "/composant/fonction/chaine.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

const lesClubs = getData("lesClubs");
const lesCategories = getData("lesCategories");

const licence = document.getElementById('licence');
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const idClub = document.getElementById('idClub');
const ffa = document.getElementById('ffa');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const idCategorie = document.getElementById('idCategorie');
const msg = document.getElementById('msg');
const btnAjouter = document.getElementById('btnAjouter');


// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

btnAjouter.onclick = () => {
    // mise en forme des données
    nom.value = enleverAccent(supprimerEspace(nom.value)).toUpperCase();
    prenom.value = enleverAccent(supprimerEspace(prenom.value)).toUpperCase();
    // contrôle des champs de saisie
    msg.innerHTML = "";
    if (donneesValides()) {
        ajouter();
    }
};

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

/**
 * Retourne l'année de référence utilisée pour le calcul des âges (identique à Categorie::getAnneeReference côté PHP)
 * @returns {number}
 */
function calculerAnneeReference() {
    const dateCourante = new Date();
    let anneeReference = dateCourante.getFullYear();
    if (dateCourante.getMonth() >= 8) {
        anneeReference++;
    }
    return anneeReference;
}

/**
 * Calcule la date de naissance minimale autorisée à partir des catégories (identique à Categorie::getDateNaissanceMin côté PHP)
 * lesCategories est trié par ageMin croissant (cf. Categorie::getAll), donc l'ageMax le plus grand est celui de la dernière catégorie
 * @returns {string}
 */
function calculerDateNaissanceMin() {
    const ageMax = Number(lesCategories[lesCategories.length - 1].ageMax);
    return `${calculerAnneeReference() - ageMax}-01-01`;
}

/**
 * Calcule la date de naissance maximale autorisée à partir des catégories (identique à Categorie::getDateNaissanceMax côté PHP)
 * lesCategories est trié par ageMin croissant (cf. Categorie::getAll), donc l'ageMin le plus petit est celui de la première catégorie
 * @returns {string}
 */
function calculerDateNaissanceMax() {
    const ageMin = Number(lesCategories[0].ageMin);
    return `${calculerAnneeReference() - ageMin}-12-31`;
}

/**
 * Détermine l'identifiant de la catégorie correspondant à une date de naissance
 * @param {string} date
 * @returns {string}
 */
function calculerCategorie(date) {
    if (!date) {
        return '';
    }

    const naissance = new Date(date + 'T00:00:00');
    if (Number.isNaN(naissance.getTime())) {
        return '';
    }

    const age = calculerAnneeReference() - naissance.getFullYear();

    const categorie = lesCategories.find(c => age >= Number(c.ageMin) && age <= Number(c.ageMax));
    return categorie ? categorie.id : '';
}

/**
 * Affiche la catégorie correspondant à la date de naissance saisie
 * @param {string} date
 */
function afficherCategorie(date) {
    idCategorie.value = calculerCategorie(date);
}

function ajouter() {
    const columns = {
        licence: licence.value,
        nom: nom.value,
        prenom: prenom.value,
        sexe: sexe.value,
        dateNaissance: dateNaissance.value,
        idClub: idClub.value,
        ffa: ffa.checked ? 1 : 0
    };

    // prise en compte des champs optionnels
    if (email.value.length > 0) {
        columns.email = email.value;
    }
    if (telephone.value.length > 0) {
        columns.telephone = telephone.value;
    }

    //  demande d'ajout dans la base de données
    appelAjax({
        url: 'ajax/ajouter.php',
        data: {
            columns: columns
        },
        success: (data) => {
                retournerVersApresConfirmation(data.message, '/coureur/liste');
        }
    });
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------


// alimentation de la zone de liste des clubs
for (const club of lesClubs) {
    idClub.add(new Option(club.nom, club.id));
}

// contrôle des données
configurerFormulaire();
filtrerLaSaisie('telephone', /[0-9]/);
filtrerLaSaisie('licence', /[0-9]/);
filtrerLaSaisie('nom', /[A-Za-z '-]/);
filtrerLaSaisie('prenom', /[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ '-]/);


// La date doit être comprise entre dateMin et dateMax
configurerDate(dateNaissance, {
    min: calculerDateNaissanceMin(),
    max: calculerDateNaissanceMax(),
    valeur: calculerDateNaissanceMax()
});

dateNaissance.addEventListener('input', () => {
    afficherCategorie(dateNaissance.value);
});

afficherCategorie(dateNaissance.value);


// pour le test, on peut pré-remplir le formulaire avec des valeurs aléatoires
nom.value ='LEMOINE';
prenom.value ='Jean';
sexe.value ='M';
dateNaissance.value ='1990-01-01';
licence.value ='000001';
idClub.value ='080004';
ffa.checked = true;
email.value ='jean.lemoine@example.com';
telephone.value ='0606060606';
afficherCategorie(dateNaissance.value);
