"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import { getData } from "/composant/fonction/page.js";
import {afficherSousLeChamp, retournerVers} from "/composant/fonction/afficher.js";
import {filtrerLaSaisie, configurerFormulaire, donneesValides, effacerLesErreurs } from "/composant/fonction/formulaire.js";
import {ucFirst} from '/composant/fonction/chaine.js';

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

const lesCategories = getData("lesCategories");
const id = document.getElementById('id');
const nom = document.getElementById('nom');
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
const btnAjouter = document.getElementById('btnAjouter');

// -----------------------------------------------------------------------------------
// procédures évènementielles
// -----------------------------------------------------------------------------------

btnAjouter.onclick = () => {
    effacerLesErreurs();
    id.value = id.value.trim().toUpperCase();
    nom.value = ucFirst(nom.value.trim());
    if (donneesValides() && controleMetier()) {
        ajouter();
    }
};

id.addEventListener('input', () => id.value = id.value.toUpperCase());

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

function ajouter() {
    appelAjax({
        url: 'ajax/ajouter.php',
        data: {
            columns: {
                id: id.value,
                nom: nom.value,
                ageMin : ageMin.value,
                ageMax : ageMax.value
            }
        },
        success: (reponse) => retournerVers(reponse.message, "/categorie/liste")
    });
}

function idExiste() {
    return lesCategories.some(c => c.id === id.value);
}

function nomExiste() {
    return lesCategories.some(
        c => c.nom.toUpperCase() === nom.value.toUpperCase()
    );
}

function intervalleValide() {
    return Number(ageMin.value) < Number(ageMax.value);
}

function chevaucheUneCategorie() {

    const min = Number(ageMin.value);
    const max = Number(ageMax.value);

    return lesCategories.some(c => {
        return min <= Number(c.ageMax) &&
            max >= Number(c.ageMin);
    });

}

function controleMetier() {

    let ok = true;

    if (idExiste()) {
        afficherSousLeChamp(id, "Cette catégorie existe déjà.");
        ok = false;
    }

    if (nomExiste()) {
        afficherSousLeChamp(nom, "Une catégorie avec ce nom existe déjà.");
        ok = false;
    }

    if (!intervalleValide()) {
        afficherSousLeChamp(ageMin, "L'âge minimum doit être strictement inférieur à l'âge maximum.");
        ok = false;
    } else if (chevaucheUneCategorie()) {
        afficherSousLeChamp(ageMin, "Cet intervalle d'âges chevauche une catégorie existante.");
        ok = false;
    }

    return ok;
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

configurerFormulaire();
filtrerLaSaisie('nom', /[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]/);
filtrerLaSaisie('id', /[A-Za-z0-9]/);
filtrerLaSaisie('ageMin', /[0-9]/);
filtrerLaSaisie('ageMax', /[0-9]/);

// Données de test
id.value = 'BE';
nom.value = 'Benjamin';
ageMin.value = 11;
ageMax.value = 13;