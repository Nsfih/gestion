use gestion;

drop event if exists supprimerAnciennesAnnonces;

create event supprimerAnciennesAnnonces
    on schedule
        every 1 day
            starts (current_date + interval 1 day)
    on completion preserve
    enable
    do
    delete from annonce
    where date < current_date;



show events from gestion;


# Pour vérifier que le Event Scheduler est actif : show variables like 'event_scheduler';

# Réponse attendue  : event_scheduler    ON

# Pour activer le Event Scheduler si nécessaire:  set global event_scheduler = on;