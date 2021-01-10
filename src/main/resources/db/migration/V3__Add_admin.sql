create extension if not exists pgcrypto;

INSERT INTO public.usr(
	id, created, email, email_confirmed, password, username)
	VALUES (1, current_date, 'sharestory.projectt@gmail.com', true, crypt('sharestory5january', gen_salt('bf',10)), 'admin');
	
INSERT INTO public.user_roles(
	user_id, role_id)
	VALUES (1, 1),
	(1,3);
	
	INSERT INTO public.usr(
	id, created, email, email_confirmed, password, username)
	VALUES (2, current_date, 'serejasmail@mail.ru', true, crypt('realnando5', gen_salt('bf',10)), 'realnando');
	
INSERT INTO public.user_roles(
	user_id, role_id)
	VALUES (2, 1),
	(2,3);
	
ALTER SEQUENCE usr_id_seq restart with 3;
	