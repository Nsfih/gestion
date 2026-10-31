use gestion;

drop trigger if exists avantAjoutAnnonce;
drop trigger if exists avantModificationAnnonce;

delimiter $$

create trigger avantAjoutAnnonce
    before insert
    on annonce
    for each row
begin
    -- le compte root peut contourner cette contrainte (ex : jeux de données de test)
    if substring_index(user(), '@', 1) <> 'root' and new.date <= curdate() then
        signal sqlstate '45000'
            set message_text = 'La date de l''annonce doit être supérieure à la date du jour';
    end if;

    -- génération automatique d'un identifiant public aléatoire (clé primaire),
    -- non séquentiel, afin d'empêcher toute énumération des annonces
    set new.id = sha2(concat(uuid(), rand(), now(6), connection_id()), 256);
end
$$


create trigger avantModificationAnnonce
    before update
    on annonce
    for each row
begin
    -- le compte root peut contourner cette contrainte (ex : jeux de données de test)
    if substring_index(user(), '@', 1) <> 'root' and new.date <> old.date and new.date <= curdate() then
        signal sqlstate '45000'
            set message_text = 'La date de l''annonce doit être supérieure à la date du jour';
    end if;
end
$$

delimiter ;