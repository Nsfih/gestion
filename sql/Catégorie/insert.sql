use gestion;

set foreign_key_checks = 0;

delete from categorie;

INSERT INTO categorie (id, nom, ageMin, ageMax)
VALUES ('CA', 'Cadet', 16, 17),
       ('ES', 'Espoir', 20, 22),
       ('JU', 'Junior', 18, 19),
       ('M0', 'Master 0', 35, 39),
       ('M1', 'Master 1', 40, 44),
       ('M10', 'Master 10', 85, 99),
       ('M2', 'Master 2', 45, 49),
       ('M3', 'Master 3', 50, 54),
       ('M4', 'Master 4', 55, 59),
       ('M5', 'Master 5', 60, 64),
       ('M6', 'Master 6', 65, 69),
       ('M7', 'Master 7', 70, 74),
       ('M8', 'Master 8', 75, 79),
       ('M9', 'Master 9', 80, 84),
       ('MI', 'Minime', 14, 15),
       ('SE', 'Senior', 23, 34);

set foreign_key_checks = 1;

