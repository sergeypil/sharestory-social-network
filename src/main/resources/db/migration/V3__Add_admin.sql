create extension if not exists pgcrypto;

INSERT INTO public.usr(
	id, created, email, email_confirmed, password, username)
	VALUES (1, current_date, 'admin@admin.com', true, crypt('sharestory5january', gen_salt('bf',10)), 'admin');
	
INSERT INTO public.user_roles(
	user_id, role_id)
	VALUES (1, 1),
	(1,3);
	
ALTER SEQUENCE usr_id_seq restart with 2;
	