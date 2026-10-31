use gestion;

drop trigger if exists avantAjoutCoureur;
drop trigger if exists avantMajCoureur;

delimiter $$


create trigger avantAjoutCoureur
    before insert
    on coureur
    for each row
begin
    declare _idCategorie char(3);

    set new.nom = upper(trim(new.nom));
    set new.prenom = upper(trim(new.prenom));

    if new.email is not null then
        set new.email = lower(trim(new.email));
    end if;

    if new.telephone is not null then
        set new.telephone = trim(new.telephone);
    end if;

    if new.dateNaissance > curdate() then
        signal sqlstate '45000'
            set message_text =
                    'la date de naissance ne peut pas être dans le futur';
    end if;

    call determinerCategorieCoureur(
            new.dateNaissance,
            _idCategorie
         );

    set new.idCategorie = _idCategorie;
end
$$

create trigger avantMajCoureur
    before update
    on coureur
    for each row
begin
    declare _idCategorie char(3);

    -- La clé primaire 'licence n'est pas modifiable
    if new.licence <> old.licence then
        signal sqlstate '45000'
            set message_text = 'La licence ne peut pas être modifiée';
    end if;

    if new.nom <> old.nom then
        set new.nom = upper(trim(new.nom));
    end if;

    if new.prenom <> old.prenom then
        set new.prenom = upper(trim(new.prenom));
    end if;

    if new.email is not null then
        set new.email = lower(trim(new.email));
    end if;

    if new.telephone is not null then
        set new.telephone = trim(new.telephone);
    end if;

    if new.dateNaissance > curdate() then
        signal sqlstate '45000'
            set message_text = 'la date de naissance ne peut pas être dans le futur';
    end if;

    if new.dateNaissance <> old.dateNaissance then
        call determinerCategorieCoureur(new.dateNaissance, _idCategorie);
        set new.idCategorie = _idCategorie;
    end if;
end
$$


