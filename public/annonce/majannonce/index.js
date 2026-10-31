"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {appelAjax} from "/composant/fonction/ajax.js";
import {configurerFormulaire, configurerDate, donneesValides } from "/composant/fonction/formulaire.js";
import {messageBox, retournerVers} from '/composant/fonction/afficher.js';
import {getDateRelative} from "/composant/fonction/date.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// -----------------------------------------------------------------------------------

/*global tinymce */
const annonce = getData("annonce");

// récupération des élements de l'interface
let nom = document.getElementById('nom');
let date = document.getElementById('date');
let description = document.getElementById('description');
let btnModifier = document.getElementById('btnModifier');
let msg = document.getElementById('msg');


// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------
btnModifier.onclick = () => {
    // récupération de la valeur du composant tinyMce
    description.value =  tinymce.get('description').getContent();
    if ( donneesValides()) {
        modifier();
    }
};

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

function modifier() {
    msg.innerHTML = '';
    // transmission des paramètres
    const columns = {};

    if (nom.value !== annonce.nom) {
        columns.nom = nom.value;
    }
    if (description.value !== annonce.description) {
        columns.description = description.value;
    }
    if (date.value !== annonce.date) {
        columns.date = date.value;
    }
    if (Object.keys(columns).length === 0) {
        messageBox("Aucune modification constatée !", 'error');
        return;
    }
    appelAjax({
        url: 'ajax/modifier.php',
        data: {
            primaryKey : annonce.id,
            columns : columns
        },
        success: data => retournerVers(data.message, '/annonce/liste'),
    });
}

// -----------------------------------------------------------------------------------
// Programme principal
// -----------------------------------------------------------------------------------

// Initialisation de TinyMCE
tinymce.init({

    license_key: 'gpl',
    selector: '#description',

    menubar: false,
    plugins: 'link lists table  code autoresize image',
    toolbar: [
       ' styles | bold italic underline | forecolor backcolor | fontsizeselect | link | image | bullist numlist outdent indent | table | code'
    ],
    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    autoresize_min_height: 200,
    autoresize_max_height: 600,
});

// Mise en place des balises div de class 'messageErreur' sur chaque champ de saisie
configurerFormulaire();

// configuration de la date
// intervalle accepté pour la date de l'événement : +- un an

const min = getDateRelative("annee", -1); // un an avant
const max = getDateRelative("annee", 1); // un an après
const valeur = getDateRelative("mois",2); // une annonce est souvent réalisé 2 mois à l'avance

configurerDate(date, {
    min: min,
    max: max,
    valeur: valeur
});

// alimentation des champs sur le formulaire
date.value = annonce.date;
nom.value = annonce.nom;
description.value = annonce.description;