use gestion;

drop procedure if exists determinerCategorieCoureur;

delimiter $$

create procedure determinerCategorieCoureur(in _dateNaissance date, out _idCategorie char(3))
begin
    declare _annee int;
    set _idCategorie = null;
    set _annee = year(curdate());

    if month(curdate()) >= 9 then
        set _annee = _annee + 1;
    end if;

    select id
    into _idCategorie
    from categorie
    where _annee - year(_dateNaissance) between agemin and agemax
    limit 1;

    if _idCategorie is null then
        signal sqlstate '45000'
            set message_text = 'La date de naissance n''est pas acceptable au regard des catégories d''âge définies dans l''application ';
    end if;
end
$$

delimiter ;