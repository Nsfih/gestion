use gestion;

set foreign_key_checks = 0;

delete from competenceprojet;
delete from projet;

insert into projet (id, nom)
values (1, 'Gestion des grands prix de formule 1'),
       (2, 'Création d''un site Web pour une association'),
       (3, 'Mise en place d''un service de messagerie pour une entreprise'),
       (4, 'Développement d''une application mobile pour un service public'),
       (5, 'Sécurisation des données d''une entreprise face aux cyberattaques');

insert into competenceprojet (idProjet, idCompetence)
values (1,2),
       (1, 12),
       (1, 13),
       (1, 14),
       (1, 15),
       (1, 16),
       (1, 17),
       (2, 1),
       (2, 5),
       (2, 10),
       (2, 12),
       (2, 14),
       (2, 18),
        (3, 1),
       (3, 2),
       (3, 3),
       (3, 4),
       (3, 5),
       (3, 6),
       (3, 7),
       (4, 1),
       (4, 2),
       (4, 3),
       (4, 4),
       (4, 5),
       (4, 6),
       (4, 7),
       (5, 1),
       (5, 2),
       (5, 3),
       (5, 4),
       (5, 5);

set foreign_key_checks = 1;


