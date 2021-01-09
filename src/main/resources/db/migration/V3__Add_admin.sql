create extension if not exists pgcrypto;

INSERT INTO public.usr(
	id, created, email, email_confirmed, password, username)
	VALUES (1, current_date, 'admin@admin.com', true, crypt('admin', gen_salt('bf',10)), 'sharestory5january');
	
INSERT INTO public.user_roles(
	user_id, role_id)
	VALUES (1, 1),
	(1,3);
	
ALTER SEQUENCE usr_id_seq restart with 2;
	