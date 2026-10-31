use gestion;

-- Supprimer les coureurs avec un numéro de licence commençant par '00000'
Select * from coureur where licence like '00000%';

delete from coureur where licence like '00000%';