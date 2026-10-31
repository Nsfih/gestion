use gestion;

drop trigger if exists avantAjoutBloc;
drop trigger if exists avantModificationBloc;
drop trigger if exists avantSuppressionBloc;

drop trigger if exists avantAjoutDomaine;
drop trigger if exists avantModificationDomaine;
drop trigger if exists avantSuppressionDomaine;

drop trigger if exists avantAjoutCompetence;
drop trigger if exists avantModificationCompetence;
drop trigger if exists avantSuppressionCompetence;

delimiter $$

create trigger avantAjoutBloc
    before insert
    on bloc
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'L''ajout d''un bloc n''est pas autorisé';
end
$$


create trigger avantModificationBloc
    before update
    on bloc
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'La modification d''un bloc n''est pas autorisée';
end
$$


create trigger avantSuppressionBloc
    before delete
    on bloc
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'La suppression d''un bloc n''est pas autorisée';
end
$$


create trigger avantAjoutDomaine
    before insert
    on domaine
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'L''ajout d''un domaine n''est pas autorisé';
end
$$


create trigger avantModificationDomaine
    before update
    on domaine
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'La modification d''un domaine n''est pas autorisée';
end
$$


create trigger avantSuppressionDomaine
    before delete
    on domaine
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'La suppression d''un domaine n''est pas autorisée';
end
$$


create trigger avantAjoutCompetence
    before insert
    on competence
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'L''ajout d''une compétence n''est pas autorisé';
end
$$


create trigger avantModificationCompetence
    before update
    on competence
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'La modification d''une compétence n''est pas autorisée';
end
$$


create trigger avantSuppressionCompetence
    before delete
    on competence
    for each row
begin
    signal sqlstate '45000'
        set message_text = 'La suppression d''une compétence n''est pas autorisée';
end
$$

delimiter ;