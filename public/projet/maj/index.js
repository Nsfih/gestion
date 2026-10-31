"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {confirmer, afficherToast} from '/composant/fonction/afficher.js';
import {creerBoutonModification, creerBoutonSuppression, creerInputTexte} from '/composant/fonction/dom.js';
import {creerTr, creerTd} from "/composant/fonction/dom.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

const lesProjets = getData("lesProjets");
const lesLignes = document.getElementById('lesLignes');

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

/**
 * Demande de suppression d'un projet
 * @param {number} id
 */
function supprimer(id) {
    appelAjax({
        url: 'ajax/supprimer.php',
        data: {id},
        success: () => document.getElementById(id)?.remove(),
        error: () => afficherToast("Erreur lors de la suppression", "error")
    });
}

/**
 * Demande de modification du nom du projet
 * @param {HTMLInputElement} inputNom
 * @param {number} id
 */
function modifierNom(inputNom, id) {
    appelAjax({
        url: 'ajax/modifiernomprojet.php',
        data: {
            primarykey: id,
            columns: {nom: inputNom.value}
        },
        success: (data) => {
            afficherToast(data.message);
            inputNom.classList.remove("text-danger");
            inputNom.classList.add("text-success");
        }
    });
}

/**
 * Crée la colonne des actions : bouton modifier et supprimer
 * @param {number} id
 * @returns {HTMLTableCellElement}
 */
function creerColonneAction(id) {

    const btnModifier = creerBoutonModification(() => location.href = `/projet/majcompetenceprojet/?id=${id}`
    );

    const btnSupprimer = creerBoutonSuppression(() => confirmer(() => supprimer(id)));

    btnModifier.setAttribute('aria-label', 'Modifier le projet');
    btnSupprimer.setAttribute('aria-label', 'Supprimer le projet');

    const tdAction = creerTd('');
    tdAction.classList.add("td-actions");
    tdAction.append(btnModifier, btnSupprimer);

    return tdAction;
}

/**
 * Crée la colonne du nom
 * @param {number} id
 * @param {string} nom
 * @returns {HTMLTableCellElement}
 */
function creerColonneNom(id, nom) {

    const inputNom = creerInputTexte({
        value: nom,
        classes: ['form-control'],
        width: '600px',
        ariaLabel: 'Nom du projet'
    });

    inputNom.addEventListener('change', function () {

        if (!this.checkValidity()) {
            this.classList.remove('text-success');
            this.classList.add('text-danger');
            this.reportValidity();
            return;
        }

        modifierNom(this, id);
    });

    const tdNom = creerTd('');
    tdNom.appendChild(inputNom);

    return tdNom;
}

/**
 * Crée une ligne de tableau représentant un projet
 * @param {Object} projet - Objet projet avec id et nom
 * @returns {HTMLTableRowElement}
 */
function creerLigneProjet(projet) {

    const tr = creerTr([]);

    tr.id = projet.id;
    tr.classList.add("align-middle");

    // Création et ajout des colonnes
    tr.appendChild(creerColonneAction(projet.id));
    tr.appendChild(creerColonneNom(projet.id, projet.nom));

    return tr;
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

for (const projet of lesProjets) {
    lesLignes.appendChild(creerLigneProjet(projet));
}