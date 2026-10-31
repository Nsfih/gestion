"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import { getData } from "/composant/fonction/page.js";


// -----------------------------------------------------------------------------------
// Déclaration des éléments DOM
// -----------------------------------------------------------------------------------

const lesCartes = document.getElementById("lesCartes");
const filtreMois = document.getElementById("filtreMois");
const courseTemplate = document.getElementById("courseTemplate");


// -----------------------------------------------------------------------------------
// Récupération des données injectées par Vue
// -----------------------------------------------------------------------------------

const lesAnnonces = getData("lesAnnonces");


// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

filtreMois.onchange = afficher;


// -----------------------------------------------------------------------------------
// Création d'une carte
// -----------------------------------------------------------------------------------

function creerCarte(element) {

    const fragment = courseTemplate.content.cloneNode(true);

    const carte = fragment.querySelector(".course-carte");
    const dateNode = fragment.querySelector(".course-date");
    const nomNode = fragment.querySelector(".course-nom");
    const descriptionNode = fragment.querySelector(".course-description");


    // -------------------------------------------------------
    // Date
    // -------------------------------------------------------

    const date = new Date(element.date);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    dateNode.textContent = date.toLocaleDateString(
        "fr-FR",
        options
    );


    // -------------------------------------------------------
    // Nom de l'épreuve
    // -------------------------------------------------------

    nomNode.textContent = element.nom;


    // -------------------------------------------------------
    // Description
    // -------------------------------------------------------

    if (element.description) {
        descriptionNode.innerHTML = element.description;
    } else {
        descriptionNode.textContent =
            "Aucune description disponible.";
    }


    return carte;
}


// -----------------------------------------------------------------------------------
// Affichage des cartes
// -----------------------------------------------------------------------------------

function afficher() {

    lesCartes.innerHTML = "";

    const moisChoisi = Number(filtreMois.value);

    let nombreCourses = 0;


    for (const element of lesAnnonces) {

        const date = new Date(element.date);

        // ---------------------------------------------------
        // Filtre par mois
        // ---------------------------------------------------

        if (
            moisChoisi !== 0
            && date.getMonth() + 1 !== moisChoisi
        ) {
            continue;
        }


        lesCartes.appendChild(
            creerCarte(element)
        );

        nombreCourses++;
    }


    // -------------------------------------------------------
    // Aucun résultat
    // -------------------------------------------------------

    if (nombreCourses === 0) {

        const message = document.createElement("p");

        message.textContent =
            "Aucune course annoncée pour ce mois.";

        message.style.textAlign = "center";
        message.style.color = "#6c757d";
        message.style.padding = "1rem";

        lesCartes.appendChild(message);
    }
}


// -----------------------------------------------------------------------------------
// Initialisation du filtre des mois
// -----------------------------------------------------------------------------------

for (let i = 1; i <= 12; i++) {

    const option = document.createElement("option");

    option.value = String(i);

    option.textContent = new Date(
        2000,
        i - 1,
        1
    ).toLocaleDateString(
        "fr-FR",
        {
            month: "long"
        }
    );


    // -------------------------------------------------------
    // On désactive les mois sans course
    // -------------------------------------------------------

    const existe = lesAnnonces.some(
        annonce => {

            const date = new Date(annonce.date);

            return date.getMonth() === i - 1;
        }
    );


    if (!existe) {
        option.disabled = true;
    }


    filtreMois.appendChild(option);
}


// -----------------------------------------------------------------------------------
// Affichage initial
// -----------------------------------------------------------------------------------

afficher();
