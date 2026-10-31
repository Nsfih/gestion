drop user if exists gestion@localhost;

create user gestion@localhost identified by 'Nkb&"7.$js]kjCk]NTRD';

grant select, insert, update, delete on gestion.* to gestion@localhost;

