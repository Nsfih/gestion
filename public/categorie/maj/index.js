"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {confirmer,  afficherSousLeChamp, afficherToast} from '/composant/fonction/afficher.js';
import {
    configurerFormulaire,
    donneesValides,
    effacerLesErreurs,
    filtrerLaSaisie
} from "/composant/fonction/formulaire.js";
import {comparerSansAccentEtSansCasse, ucFirst} from "/composant/fonction/chaine.js";
import {getData} from "/composant/fonction/page.js";


// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

// Map indexée par id, pour un accès et une suppression en O(1)
const lesCategories = new Map(getData("lesCategories").map(x => [x.id, x]));

// objet global contenant les informations sur la catégorie sélectionnée
let categorie =  null;

const idR = document.getElementById('idR');
const nom = document.getElementById('nom');
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
const nb = document.getElementById('nb');
const msg = document.getElementById('msg');
const btnModifier = document.getElementById('btnModifier');
const btnSupprimer = document.getElementById('btnSupprimer');

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

// sur le changement de catégorie, il faut récupérer les informations de la catégorie
idR.onchange = () => afficher(idR.value);

// demande de modification d'une catégorie
btnModifier.onclick = () => {
    if (controler()) {
        modifier();
    }
};

// demande de suppression de la catégorie
btnSupprimer.onclick = () => confirmer(supprimer);


/**
 * Affiche les informations de la catégorie dans les champs du formulaire
 * @param {string} idCategorie identifiant de la catégorie
 */
function afficher(idCategorie) {
    categorie = lesCategories.get(idCategorie);
    nom.value = categorie.nom;
    ageMin.value = categorie.ageMin;
    ageMax.value = categorie.ageMax;
    nb.innerText = categorie.nb + " licencié(s) dans cette catégorie";
    // si la catégorie ne comporte pas de licencié, on affiche le bouton de suppression
    // sinon, on le masque et on indique le nombre de licenciés
    if (categorie.nb === 0) {
        btnSupprimer.style.display = "block";
        nb.innerText = "Aucun licencié dans cette catégorie";
    } else {
        btnSupprimer.style.display = "none";
        nb.innerText = `${categorie.nb} ${categorie.nb === 1 ? "licencié" : "licenciés"} dans cette catégorie`;
    }
    // vider l'éventuel message d'erreur
    msg.innerText = '';
}

/**
 * controle les données saisies dans le formulaire
 * @returns {boolean}
 */
function controler() {

    // effacer les anciens messages d'erreur
    effacerLesErreurs();

    nom.value = ucFirst(nom.value.trim());
    if (!donneesValides()) {
        return false;
    }
    let valide = true;

    // vérification de l'unicité du nom
    if (!nomUnique(nom.value)) {
        afficherSousLeChamp('nom', "Le nom de la catégorie doit être unique");
        valide = false;
    }
    // vérification de l'intervalle des âges
    const min = ageMin.valueAsNumber;
    const max = ageMax.valueAsNumber;
    if (min >= max) {
        afficherSousLeChamp('ageMin', "L'âge minimum doit être inférieur à l'âge maximum");
        valide = false;
    } else {
        // vérification de la plage d'âge
        if (!plageValide(categorie.id, min, max)) {
            afficherSousLeChamp('ageMin', "La plage d'âge doit être cohérente avec les autres catégories");
            valide = false;
        }
    }
    return valide;
}

/**
 * Vérifie si le nom de la catégorie est unique
 * Par sécurité, nous utilisons une comparaison insensible aux accents et à la casse
 * @param {string} nom
 * @returns {boolean}
 */
function nomUnique(nom) {
    return ![...lesCategories.values()].some(x => comparerSansAccentEtSansCasse(x.nom, nom) && x.id !== categorie.id);
}

/**
 * Vérifie si la plage d'âge est valide et ne chevauche pas les autres catégories.
 * Il n'y a pas chevauchement si max est avant ageMin ou min est après ageMax (il suffit d'inverser la condition pour trouver un chevauchement)
 *  @param {number} id id de la catégorie actuellement affichée
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function plageValide(id, min, max) {
    return ![...lesCategories.values()].some(x => x.id !== id && max >= x.ageMin && min <= x.ageMax);
}

function modifier() {
    effacerLesErreurs();
    // ne rien envoyer si aucune modification n'a été apportée aux champs
    if (!aEteModifie()) {
        return;
    }
    void appelAjax({
        url: 'ajax/modifier.php',
        data: {
            primaryKey: categorie.id,
            columns: {
                nom: nom.value,
                ageMin: ageMin.value,
                ageMax: ageMax.value
            }
        },
        success: data => {
         afficherToast(data.message);
         // mettre à jour la Map lesCategories
          categorie.nom = nom.value;
          categorie.ageMin = ageMin.value;
          categorie.ageMax = ageMax.value;
          // mettre à jour le texte de l'option correspondante dans la zone de liste idR
          idR.options[idR.selectedIndex].text = categorie.nom + ' (' + categorie.id + ')';
        }
    });
}

/**
 * Vérifie si les champs de saisie ont été modifiés par rapport à la catégorie actuellement chargée
 * @returns {boolean}
 */
function aEteModifie() {
    return nom.value !== categorie.nom
        || Number(ageMin.value) !== Number(categorie.ageMin)
        || Number(ageMax.value) !== Number(categorie.ageMax);
}

/*
 * Demande de suppression de la catégorie actuellement affichée
 */
function supprimer() {
    effacerLesErreurs();
    appelAjax({
        url: 'ajax/supprimer.php',
        data: {
            primaryKey: categorie.id
        },
        success: (reponse) => {
            afficherToast(reponse.message);
            // on supprime la catégorie de la Map lesCategories
            lesCategories.delete(categorie.id);
            // mise à jour de la zone de liste idR
            idR.remove(idR.selectedIndex);
            // charger les données de la catégorie suivante
            afficher(idR.value);
        }
    });
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

configurerFormulaire();
filtrerLaSaisie('nom', /[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]/);
filtrerLaSaisie('ageMin', /[0-9]/);
filtrerLaSaisie('ageMax', /[0-9]/);


// Transformation en valeur numérique pour ageMin et AgeMax et alimentation de la zone de liste des catégories
// cela évitera les erreurs de comparaison
for (const element of lesCategories.values()) {
    idR.add(new Option(element.nom + ' (' + element.id + ')', element.id));
}

// charger les informations de la catégorie actuellement sélectionnée
afficher(idR.value);
