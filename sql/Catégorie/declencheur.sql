use gestion;

drop trigger if exists avantAjoutCategorie;
drop trigger if exists avantMajCategorie;
drop trigger if exists avantSuppressionCategorie;

delimiter $$

create trigger avantAjoutCategorie
    before insert
    on categorie
    for each row
begin
    if exists (
        select 1
        from categorie
        where new.ageMax >= ageMin
          and new.ageMin <= ageMax
    ) then
        signal sqlstate '45000'
            set message_text =
                    'L''intervalle de cette catégorie est en conflit avec une autre catégorie.';
    end if;
end $$


create trigger avantMajCategorie
    before update
    on categorie
    for each row
begin
    if new.id <> old.id then
        signal sqlstate '45000'
            set message_text =
                    'Le code de la catégorie ne peut pas être modifié.';
    end if;

    if new.ageMin <> old.ageMin
        or new.ageMax <> old.ageMax then

        if exists (
            select 1
            from categorie
            where new.ageMax >= ageMin
              and new.ageMin <= ageMax
              and id <> old.id
        ) then
            signal sqlstate '45000'
                set message_text =
                        'L''intervalle de cette catégorie est en conflit avec une autre catégorie.';
        end if;
    end if;
end $$

delimiter ;