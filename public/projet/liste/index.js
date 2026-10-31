"use strict";

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {genererMessage} from "/composant/fonction/afficher.js";
import {getData} from "/composant/fonction/page.js";

// -----------------------------------------------------------------------------------
// Déclaration des variables globales
// ------

const msg = document.getElementById("msg");
const lesProjets = document.getElementById("lesProjets");
const projetsEtCompetences = getData("lesProjetsEtCompetences");

// -----------------------------------------------------------------------------------
// Procédures évènementielles
// -----------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------
// Fonctions de traitement
// -----------------------------------------------------------------------------------

//   regroupement des compétences par projet
function regrouperParProjet(lignes) {
    const map = new Map();

    for (const ligne of lignes) {

        const idProjet = String(ligne.id);

        if (!map.has(idProjet)) {
            map.set(idProjet, {
                id: idProjet,
                nom: ligne.nom,
                competences: []
            });
        }

        map.get(idProjet).competences.push({
            code: ligne.code,
            libelle: ligne.libelle
        });
    }

    return Array.from(map.values());
}


//  création du tableau des compétences
function creerTableauCompetences(competences) {

    const table = document.createElement("table");

    table.className = "table table-sm table-bordered projet-table";

    const thead = document.createElement("thead");

    const ligneEntete = document.createElement("tr");

    const thCode = document.createElement("th");
    thCode.textContent = "Code";
    thCode.style.width = "100px";

    const thLibelle = document.createElement("th");
    thLibelle.textContent = "Libellé";

    ligneEntete.append(thCode, thLibelle);
    thead.appendChild(ligneEntete);

    const tbody = document.createElement("tbody");

    for (const competence of competences) {

        const tr = document.createElement("tr");

        const tdCode = document.createElement("td");
        tdCode.textContent = competence.code ?? "";

        const tdLibelle = document.createElement("td");
        tdLibelle.textContent = competence.libelle ?? "";

        tr.append(tdCode, tdLibelle);
        tbody.appendChild(tr);
    }

    table.append(thead, tbody);

    return table;
}


// Création d'un bloc projet
function creerBlocProjet(projet) {

    const article = document.createElement("article");
    article.className = "projet-card";

    const header = document.createElement("header");
    header.className = "projet-header";

    const nom = document.createElement("span");
    nom.className = "projet-nom";
    nom.textContent = projet.nom;

    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "projet-toggle";
    bouton.textContent = "Afficher les compétences";
    bouton.setAttribute("aria-expanded", "false");

    header.append(nom, bouton);


    const body = document.createElement("div");
    body.className = "projet-body";
    body.hidden = true;


    const table = creerTableauCompetences(projet.competences);

    body.appendChild(table);


    // Gestion de l'affichage du corps du projet
    bouton.addEventListener("click", () => {
        const ouvert = !body.hidden;
        body.hidden = ouvert;
        bouton.setAttribute("aria-expanded", String(!ouvert));

        bouton.textContent = ouvert ? "Afficher les compétences" : "Masquer les compétences";
    });
    article.append(header, body);

    return article;
}


if (!Array.isArray(projetsEtCompetences) || projetsEtCompetences.length === 0) {
    msg.innerHTML = genererMessage("Aucun projet n'est actuellement enregistré", "orange");
} else {
    const projets = regrouperParProjet(projetsEtCompetences);
    for (const projet of projets) {
        lesProjets.appendChild(creerBlocProjet(projet));
    }
}
