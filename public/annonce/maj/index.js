"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from '/composant/fonction/ajax.js';
import {afficherToast, confirmer, genererMessage} from '/composant/fonction/afficher.js';
import {creerBoutonModification, creerBoutonSuppression, creerCheckbox} from '/composant/fonction/dom.js';
import {creerTd, creerTr} from "/composant/fonction/dom.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

const lesAnnonces = getData("lesAnnonces");

const lesLignes = document.getElementById('lesLignes');
const msg = document.getElementById('msg');
const deleteOld = document.getElementById('deleteOld');

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

deleteOld.onclick = () => confirmer(supprimerAnciennesAnnonces);

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

/**
 * Demande de suppression d'une annonce
 * @param {string} id
 */
function supprimer(id) {
    appelAjax({
        url: 'ajax/supprimer.php',
        data: {
            primaryKey: id
        },
        success: () => document.getElementById(id)?.remove(),
    });
}

/**
 * Demande de modification de la colonne "actif"
 * @param {HTMLInputElement} checkbox
 * @param {string} id
 */
function modifierActif(checkbox, id) {
    appelAjax({
        url: 'ajax/modifieractif.php',
        data: {
            primaryKey: id,
            actif: checkbox.checked ? 1 : 0
        },
        success : () => afficherToast(checkbox.checked ? 'Annonce activée' : 'Annonce désactivée', 'vert'),
        error: () => {
            // Annuler le changement en cas d'erreur
            checkbox.checked = !checkbox.checked;
        }
    });
}

/**
 * Supprime les anciennes annonces
 */
function supprimerAnciennesAnnonces() {
    msg.innerText = "";
    appelAjax({
        url: 'ajax/deleteold.php',
        success: (lesIdsSupprimes) => {
            for (const id of lesIdsSupprimes) {
                document.getElementById(id)?.remove();
            }
            if (lesIdsSupprimes.length === 0) {
                msg.innerHTML = genererMessage('Aucune annonce à supprimer','orange',2000);

            } else if (lesIdsSupprimes.length === 1) {
                msg.innerHTML = genererMessage('Une annonce supprimée', 'vert',2000);
            } else {
                msg.innerHTML = genererMessage(lesIdsSupprimes.length + ' annonces supprimées', 'vert', 2000);
            }
        }
    });
}

/**
 * Crée la colonne des actions
 * @param {string} id
 * @returns {HTMLTableCellElement}
 */
function creerColonneAction(id) {
    const actionModifier = () => location.href = '/annonce/majannonce/?id=' + id;
    const actionSupprimer = () => confirmer(() => supprimer(id));

    const btnModifier = creerBoutonModification(actionModifier);
    const btnSupprimer = creerBoutonSuppression(actionSupprimer);

    btnModifier.setAttribute('aria-label', 'Modifier l\'annonce');
    btnSupprimer.setAttribute('aria-label', 'Supprimer l\'annonce');

    const tdAction = creerTd('');
    tdAction.appendChild(btnModifier);
    tdAction.appendChild(btnSupprimer);

    return tdAction;
}

/**
 * Crée la colonne de la case à cocher actif
 * @param {string} id
 * @param {number} actif
 * @returns {HTMLTableCellElement}
 */
function creerColonneActif(id, actif) {
    const checkbox = creerCheckbox();
    checkbox.checked = actif === 1;
    checkbox.setAttribute('aria-label', 'Activer/Désactiver l\'annonce');
    checkbox.onchange = () => modifierActif(checkbox, id);
    const tdActif = creerTd('', {centrer: true});
    tdActif.appendChild(checkbox);

    return tdActif;
}

/**
 * Crée une ligne de tableau représentant une annonce
 * @param {Object} annonce - Objet annonce avec id, dateFr, nom, actif
 * @returns {HTMLTableRowElement}
 */
function creerLigneAnnonce(annonce) {
    const {id, dateFr, nom, actif} = annonce;

    const tr = creerTr([]);
    tr.id = id;

    // Création et ajout des colonnes
    tr.appendChild(creerColonneAction(id));
    tr.appendChild(creerTd(dateFr));
    tr.appendChild(creerTd(nom));
    tr.appendChild(creerColonneActif(id, actif));

    return tr;
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

for (const annonce of lesAnnonces) {
    lesLignes.appendChild(creerLigneAnnonce(annonce));
}