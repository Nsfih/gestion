"use strict";

// -----------------------------------------------------------------------------------
// Import des competences nécessaires
// -----------------------------------------------------------------------------------
import {appelAjax} from "/composant/fonction/ajax.js";
import {creerCheckbox} from "/composant/fonction/dom.js";
import {getData} from "/composant/fonction/page.js";
import {afficherToast} from "/composant/fonction/afficher.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

const projet = getData("projet");
const lesCompetencesBloc1 = getData("lesCompetencesBloc1");
const lesIdCompetencesProjet = getData("lesIdCompetencesProjet");

// récupération des éléments du DOM
const nom = document.getElementById('nom');
const listeCompetence = document.getElementById('listeCompetence');

// -----------------------------------------------------------------------------------
// procédures évènementielles
// -----------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------


function ajouterCompetence(id, input) {
    appelAjax({
        url: 'ajax/ajouterunecompetence.php',
        data: {
            columns: {
                idProjet : projet.id,
                idCompetence: id
            }
        },
        success : (data) => afficherToast(data.message),
        error: () => input.checked = false
    });
}

function supprimerCompetence(id, input) {
    appelAjax({
        url: 'ajax/supprimerunecompetence.php',
        data: {primaryKey : id},
        success : (data) => afficherToast(data.message),
        error: () => input.checked = true
    });
}


/**
 * Crée une ligne DOM complète contenant :
 * - une case à cocher configurée
 * - un label affichant le libellé de la compétence
 *
 * @param {Object} competence - Objet contenant { id, libelle }
 * @returns {HTMLDivElement}
 */
function creerLigneCompetence(competence) {

    const { id, libelle } = competence;
    const input = creerCheckbox();

    input.id = id;
    input.name = 'competence';

    // id de l'association competenceprojet si elle existe
    const association = lesIdCompetencesProjet.find(c => Number(c.idCompetence) === Number(id));
    // Si cette compétence est dans le projet il faut mémoriser son identifiant pour pouvoir la supprimer
    if (association) {
        input.dataset.idAssociation = association.id;
        input.checked = true;
    }
    // sur le changement de la case à cocher, ajouter ou supprimer la compétence du projet
    // on passe l'objet input car en cas d'échec sur l'appel Ajax il faudra remettre la case à cocher dans son état initial
    input.onclick = () => {
        if (input.checked) {
            ajouterCompetence(id, input);
        } else {
            supprimerCompetence(input.dataset.idAssociation, input);
        }
    };

    const label = document.createElement('label');
    label.innerText = libelle;
    label.classList.add("my-auto");

    const div = document.createElement('div');
    div.classList.add("d-flex", "mb-1");
    div.appendChild(input);
    div.appendChild(label);

    return div;
}


// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// afficher le nom du projet dans le formulaire de gestion
nom.innerText = projet.nom;

// afficher toutes les competences du bloc 1 sous forme de case à cocher
for (const competence of lesCompetencesBloc1) {
    const ligne = creerLigneCompetence(competence);
    listeCompetence.appendChild(ligne);
}

// cocher les cases des compétences du projet
for (const competence of lesIdCompetencesProjet) {
    document.getElementById(competence.idCompetence).checked = true;
}
