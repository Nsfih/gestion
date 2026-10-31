// noinspection JSUnusedGlobalSymbols

"use strict";

// Version 2026.1
// Date version : 11/08/2026

// -----------------------------------------------------------------------------------
// Import des fonctions nécessaires
// -----------------------------------------------------------------------------------

import {messageBox} from "/composant/fonction/afficher.js";

// -----------------------------------------------------------------------------------
// Composant principal
// -----------------------------------------------------------------------------------

/**
 * Affiche une interface de tri manuel par glisser-déposer et retourne les IDs dans l'ordre.
 * @param {Array} data - Tableau d'objets à ordonner.
 * @param {Function} callback - Fonction appelée avec le tableau des IDs.
 * @param {Object} [options] - Options de configuration.
 * @param {string} [options.cle="id"] - Nom de la clé unique pour chaque élément.
 * @param {string} [options.champ="nom"] - Nom du champ à afficher.
 */
export function ordonnerElement(data, callback, {cle = "id", champ = "nom"} = {}) {
    const zone = document.getElementById("zone");

    if (!zone) {
        console.error("L'élément avec l'ID 'zone' n'existe pas dans le DOM.");
        return;
    }

    // -----------------------------------------------------------------------------------
    // Génération de l'interface
    // -----------------------------------------------------------------------------------

    const divInfo = document.createElement("div");
    divInfo.innerHTML = `
        <p>Déplacez les éléments du cadre de gauche vers le cadre de droite pour les ordonner.<br>
        Ensuite, cliquez sur le bouton pour valider cet ordre.</p>`;
    divInfo.classList.add("alert", "alert-info", "m-1");
    zone.appendChild(divInfo);

    const cadreG = document.createElement("div");
    const cadreD = document.createElement("div");

    for (const cadre of [cadreG, cadreD]) {
        cadre.classList.add("border", "p-2", "m-2");
        cadre.style.minHeight = "300px";
        cadre.style.flex = "1";
    }

    const btnOrdonner = document.createElement("button");
    btnOrdonner.classList.add("btn", "btn-outline-danger", "m-1");
    btnOrdonner.textContent = "✔ Valider";

    const divBtn = document.createElement("div");
    divBtn.classList.add("text-center" );
    divBtn.appendChild(btnOrdonner);
    zone.appendChild(divBtn);

    const conteneurFlex = document.createElement("div");
    conteneurFlex.className = "d-flex flex-column flex-md-row justify-content-around";
    conteneurFlex.appendChild(cadreG);
    conteneurFlex.appendChild(cadreD);

    zone.appendChild(conteneurFlex);

    // -----------------------------------------------------------------------------------
    // Drag & Drop
    // -----------------------------------------------------------------------------------

    for (const cadre of [cadreG, cadreD]) {
        cadre.ondragover = (e) => e.preventDefault();
        cadre.ondrop = (e) => {
            const id = e.dataTransfer.getData("id");
            cadre.appendChild(document.getElementById(id));
        };
    }

    // -----------------------------------------------------------------------------------
    // Remplissage du cadre gauche
    // -----------------------------------------------------------------------------------

    for (const element of data) {
        const div = document.createElement("div");
        div.id = element[cle];
        div.classList.add("border", "p-2", "m-1");
        div.innerText = element[champ];
        div.style.backgroundColor = "#0088FF";
        div.style.color = "white";
        div.draggable = true;

        div.ondragstart = (e) => e.dataTransfer.setData("id", e.target.id);
        div.onclick = () => {
            if (div.parentElement === cadreG) {
                cadreD.appendChild(div);
            } else {
                cadreG.appendChild(div);
            }
        };

        cadreG.appendChild(div);
    }

    // Ajustement initial de la hauteur du cadre droit
    cadreD.style.height = cadreG.offsetHeight + "px";

    // -----------------------------------------------------------------------------------
    // Traitement du bouton
    // -----------------------------------------------------------------------------------

    btnOrdonner.onclick = () => {
        if (cadreG.children.length > 0) {
            messageBox("Tous les éléments n'ont pas été déplacés dans le cadre de droite", 'error');
            return;
        }

        const lesIdOrdonnes = [];
        for (const div of cadreD.children) {
            lesIdOrdonnes.push(div.id);
        }

        callback(lesIdOrdonnes);
    };
}
