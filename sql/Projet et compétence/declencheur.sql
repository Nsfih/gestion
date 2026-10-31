use gestion;

drop trigger if exists avantAjoutCompetenceProjet;
drop trigger if exists avantMajCompetenceProjet;

delimiter $$

create trigger avantAjoutCompetenceProjet
    before insert
    on competenceprojet
    for each row
        begin
    declare bloc int;

    select idBloc
    into bloc
    from competence
    where id = new.idCompetence;

    if bloc <> 1 then
        signal sqlstate '45000'
            set message_text = 'La compétence doit appartenir au bloc 1';
    end if;
end
        $$


create trigger avantMajCompetenceProjet
    before update
    on competenceprojet
    for each row
        begin
    signal sqlstate '45000'
        set message_text = 'La modification d''une association projet-compétence n''est pas autorisée';
end$$

delimiter ;