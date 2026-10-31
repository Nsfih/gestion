"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {confirmer, afficherToast} from '/composant/fonction/afficher.js';
import {
    configurerFormulaire,
    donneesValides,
    configurerDate,
    filtrerLaSaisie,
    effacerLesErreurs,
    effacerLesChamps
} from "/composant/fonction/formulaire.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------
const lesClubs = getData("lesClubs");
const lesCategories = getData("lesCategories");

// récupération des éléments de l'interface
const nom = document.getElementById('nom');
const prenom = document.getElementById('prenom');
const sexe = document.getElementById('sexe');
const dateNaissance = document.getElementById('dateNaissance');
const idClub = document.getElementById('idClub');
const ffa = document.getElementById('ffa');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const licence = document.getElementById('licence');
const idCategorie = document.getElementById('idCategorie');
const search = document.getElementById('search');
const btnSupprimer = document.getElementById('btnSupprimer');
const btnModifier = document.getElementById('btnModifier');
const zoneSaisie = document.getElementById('zoneSaisie');
const msg = document.getElementById('msg');

// objet global contenant les informations du coureur actuellement affiché
let coureur = {};


// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

search.onfocus = () => {
    search.value = '';
    btnSupprimer.style.display = 'none';
    zoneSaisie.style.visibility = 'hidden';
    effacerLesChamps();
};


// le bouton 'btnSupprimer'
btnSupprimer.onclick = () => confirmer(supprimer);

btnModifier.onclick = () => {
    effacerLesErreurs();

    // 1. Contrôle si au moins un champ a changé
    if (!estModifie()) {
        afficherToast('Aucune modification détectée');
        return;
    }

    // 2. Validation du formulaire puis envoi
    if (donneesValides(zoneSaisie)) {
        modifier();
    }
};

nom.addEventListener('input', () => {
    const pos = nom.selectionStart;
    nom.value = nom.value.toLocaleUpperCase('fr-FR');
    nom.setSelectionRange(pos, pos);
});

prenom.addEventListener('input', () => {
    const pos = prenom.selectionStart;
    prenom.value = prenom.value.toLocaleUpperCase('fr-FR');
    prenom.setSelectionRange(pos, pos);
});


// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

function normaliserValeur(valeur) {
    return valeur == null ? '' : String(valeur).trim();
}

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

function calculerCategorie(date) {
    if (!date) {
        return '';
    }

    const dateNaissance = new Date(date + 'T00:00:00');
    if (Number.isNaN(dateNaissance.getTime())) {
        return '';
    }

    const age = calculerAnneeReference() - dateNaissance.getFullYear();

    const categorie = lesCategories.find(c => age >= Number(c.ageMin) && age <= Number(c.ageMax));
    return categorie ? categorie.id : '';
}

function afficherCategorie(date) {
    const categorie = calculerCategorie(date);
    idCategorie.value = categorie;
    coureur.idCategorie = categorie;
}

/**
 * affichage des coordonnées du coureur contenues dans le paramètre implicite data
 * On conserve les coordonnées du coureur dans l'objet coureur afin de détecter une modification
 * @param data
 */
function afficher(data) {
    // vider l'éventuel message d'erreur
    msg.innerHTML = '';
    coureur = {...data};
    nom.value = data.nom;
    prenom.value = data.prenom;
    sexe.value = data.sexe;
    dateNaissance.value = data.dateNaissance;
    licence.value = normaliserValeur(data.licence);
    idCategorie.value = data.idCategorie;
    idClub.value = normaliserValeur(data.idClub);
    ffa.checked = Number(data.ffa) === 1;
    // pour les champs optionnels la valeur null est transformée en chaine vide ''
    email.value = data.email ?? '';
    telephone.value = data.telephone ?? '';
    btnSupprimer.style.display = 'block';

    // afficher La zone de saisie
    zoneSaisie.style.visibility = 'visible';
    afficherCategorie(dateNaissance.value);

}

function estModifie() {
    const emailVal = email.value.trim().length > 0 ? email.value : null;
    const telephoneVal = telephone.value.trim().length > 0 ? telephone.value : null;

    return nom.value !== (coureur.nom ?? '') ||
        prenom.value !== (coureur.prenom ?? '') ||
        sexe.value !== (coureur.sexe ?? '') ||
        dateNaissance.value !== (coureur.dateNaissance ?? '') ||
        normaliserValeur(idClub.value) !== normaliserValeur(coureur.idClub) ||
        (ffa.checked ? 1 : 0) !== Number(coureur.ffa) ||
        emailVal !== coureur.email ||
        telephoneVal !== coureur.telephone;
}

function modifier() {
    msg.innerHTML = '';

    const columns = {
        nom: nom.value,
        prenom: prenom.value,
        sexe: sexe.value,
        dateNaissance: dateNaissance.value,
        idClub: normaliserValeur(idClub.value),
        ffa: ffa.checked ? 1 : 0,
        email: email.value.trim().length > 0 ? email.value : null,
        telephone: telephone.value.trim().length > 0 ? telephone.value : null
    };

    appelAjax({
        url: 'ajax/modifier.php',
        data: {
            primaryKey: coureur.licence,
            columns: columns
        },
        success: () => {
            // il faut remplacer les anciennes valeurs par les nouvelles au niveau de l'objet coureur afin de détecter les modifications
            coureur.nom = nom.value;
            coureur.prenom = prenom.value;
            coureur.sexe = sexe.value;
            coureur.dateNaissance = dateNaissance.value;
            coureur.idCategorie = idCategorie.value;
            coureur.idClub = normaliserValeur(idClub.value);
            coureur.ffa = ffa.checked ? 1 : 0;
            coureur.email = email.value.trim().length > 0 ? email.value : null;
            coureur.telephone = telephone.value.trim().length > 0 ? telephone.value : null;
            afficherToast('Coureur modifié');
        }
    });
}

/**
 * Demande de suppression du coureur actuellement affiché
 */
function supprimer() {
    appelAjax({
        url: 'ajax/supprimer.php',
        data: {
            primaryKey: coureur.licence
        },
        success: () => {
            afficherToast('Coureur supprimé');
            search.focus();
        }
    });
}


// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// intervalle sur la date de naissance
// La date doit être comprise entre dateMin et dateMax
configurerDate(dateNaissance, {
    min: calculerDateNaissanceMin(),
    max: calculerDateNaissanceMax(),
    valeur: calculerDateNaissanceMax()
});

dateNaissance.addEventListener('input', () => {
    afficherCategorie(dateNaissance.value);
});

// alimentation de la zone de liste des clubs
for (const club of lesClubs) {
    idClub.add(new Option(club.nom, club.id));
}

// paramétrage du composant autoComplete
const autoCompleteJS = new autoComplete({
    selector: "#search",
    threshold: 1,
    debounce: 300,
    data: {
        src: async (query) => {
            const reponse = await appelAjax({
                url: "ajax/getbyname.php?search=" + query,
                method: "GET",
                dataType: "json"
            });
            console.log(`Résultat de la recherche " :`, reponse);
            return reponse ?? [];
        },

        keys: ["nomPrenom"],
        cache: false
    },
    searchEngine: "loose",
    resultsList: {
        maxResults: 10,
        noResults: true,
        element: (list, data) => {
            if (!data.results.length) {
                const message = document.createElement("li");
                message.textContent = "Aucun étudiant trouvé." + (data.query ? ` pour "${data.query}"` : "");
                // message.textContent = "Aucun coureur trouvé.";
                message.setAttribute("class", "no_result");

                list.appendChild(message);
            }
        }
    },

    resultItem: {
        highlight: true,
        element: (item, data) => item.innerHTML = `<span>${data.match}</span>`
    },

    events: {
        input: {
            selection: (event) => {
                const selection = event.detail.selection.value;
                search.value = selection.nomPrenom;
                afficher(selection);
            }
        }
    }
});

// contrôle des données saisies toujours après le système d'autocomplétion qui vient ajouter ses propres balises
configurerFormulaire();
filtrerLaSaisie('telephone', /[0-9]/);
filtrerLaSaisie('nom', /[A-Za-z ]/);
filtrerLaSaisie('search', /[A-Za-z ]/);
filtrerLaSaisie('prenom', /[A-Za-z ]/);
