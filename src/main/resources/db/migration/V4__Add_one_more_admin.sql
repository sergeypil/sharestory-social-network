create extension if not exists pgcrypto;

INSERT INTO public.usr(
	id, created, email, email_confirmed, password, username)
	VALUES (10, current_date, 'admin2@admin2.com', true, crypt('sharestory5january', gen_salt('bf',10)), 'admin2');
	
INSERT INTO public.user_roles(
	user_id, role_id)
	VALUES (10, 1),
	(10,3);