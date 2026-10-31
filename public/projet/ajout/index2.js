"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {configurerFormulaire, donneesValides } from "/composant/fonction/formulaire.js";
import {messageBox, retournerVers} from "/composant/fonction/afficher.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

const lesCompetencesBloc1 = getData("lesCompetencesBloc1");

// récupération des éléments de l'interface
const nom = document.getElementById('nom');
const msg = document.getElementById('msg');
const btnEnregistrer = document.getElementById('btnEnregistrer');
const listeCompetence = document.getElementById('listeCompetence');

// Tableau simple pour conserver les compétences sélectionnées (conservation du const)
const lesCompetencesDuProjet = [];

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------


btnEnregistrer.onclick = () => {
    // vérification sur le champ nom
    if (donneesValides()) {
        // il faut au moins une compétence
        if (lesCompetencesDuProjet.length === 0) {
            messageBox('Il faut associer au moins une compétence au projet', 'error');
        } else {
            enregistrer();
        }
    } else {
        messageBox("Des données sont manquantes ou incorrectes, veuillez vérifier votre saisie", 'error');
    }
};


// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

/**
 * Demande d'enregistrement du projet avec ses compétences
 */
function enregistrer() {
    msg.innerHTML = '';
    appelAjax({
        url: 'ajax/enregistrer.php',
        data: {
            nom: nom.value,
            lesCompetences: lesCompetencesDuProjet
        },
        success: () => retournerVers('Projet enregistré', '/projet/liste')
    });
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// mise en place des balises div de class 'messageErreur' sur chaque champ de saisie
configurerFormulaire();

// alimentation de la div listeCompetence qui affiche toutes les compétences du bloc 1 sous la forme de case à cocher
for (const competence of lesCompetencesBloc1) {
    let div = document.createElement('div');
    div.classList.add("d-flex", "mb-1");
    let uneCase = document.createElement('input');
    uneCase.type = 'checkbox';
    uneCase.classList.add("form-check-input", "my-auto", "m-3");
    uneCase.style.width = '25px';
    uneCase.style.height = '25px';
    // pour permettre de récupérer toutes les cases
    uneCase.name = 'competence';

    // le clic sur une case à cocher déclenche la mise à jour du tableau des compétences du projet (ajout ou suppression)
    uneCase.onclick = function () {
        if (uneCase.checked) {
            lesCompetencesDuProjet.push(competence.id);
        } else {
            // recherche de l'index et suppression directe dans le tableau existant
            const index = lesCompetencesDuProjet.indexOf(competence.id);
            if (index !== -1) {
                lesCompetencesDuProjet.splice(index, 1);
            }
        }
    };
    div.appendChild(uneCase);
    let label = document.createElement('label');
    label.innerText = competence.libelle;
    label.classList.add("my-auto");
    div.appendChild(label);
    listeCompetence.appendChild(div);
}