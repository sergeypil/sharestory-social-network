create table commentary (
	id  bigserial not null, 
	created_date timestamp, 
	text varchar(255), 
	post_id int8, 
	user_id int8, 
	primary key (id));
	
create table post (
	id  bigserial not null, 
	created_date timestamp, 
	description text not null, 
	post_name varchar(255) not null,
	edited boolean not null,	
	vote_count int4, 
	topic_id int8, 
	user_id int8, primary key (id));
	

create table refresh_token (id  bigserial not null, created_date timestamp, token varchar(255), user_id int8, primary key (id));
create table role (id  serial not null, name varchar(20), primary key (id));
create table topic (
	id  bigserial not null, 
	created_date timestamp, 
	description varchar(255) not null, 
	name varchar(255) not null, 
	user_id int8, primary key (id));
	
create table token (id  bigserial not null, expiry_date timestamp, token varchar(255), user_id int8, primary key (id));
create table user_roles (user_id int8 not null, role_id int4 not null, primary key (user_id, role_id));
create table usr (id  bigserial not null, created timestamp, email varchar(255) not null, email_confirmed boolean not null, password varchar(255) not null, username varchar(20) not null, primary key (id));
create table vote (id  bigserial not null, vote_type int4, post_id int8 not null, user_id int8, primary key (id));

alter table usr add constraint UK_5qon25cbubi501q40jh1u866w unique (username);
alter table commentary add constraint FKs1slvnkuemjsq2kj4h3vhx7i1 foreign key (post_id) references post;
alter table commentary add constraint FKgcgdcgly6u49hf4g8y2di3g4p foreign key (user_id) references usr;
alter table post add constraint FKg8ln3nj8tjclai0nuvpw5s5uw foreign key (topic_id) references topic;
alter table post add constraint FKrm2u0ujvvi9euawhsm1km29m4 foreign key (user_id) references usr;
alter table refresh_token add constraint FKblk12jwiin47e1t4i842k2j2r foreign key (user_id) references usr;
alter table token add constraint FKssf1kt08wvjrqg5x50facgn4g foreign key (user_id) references usr;
alter table topic add constraint FKrdf7v8xb9v98d0elr0s0bpta5 foreign key (user_id) references usr;
alter table user_roles add constraint FKrhfovtciq1l558cw6udg0h0d3 foreign key (role_id) references role;
alter table user_roles add constraint FKg6agnwreityp2vf23bm2jgjm3 foreign key (user_id) references usr;
alter table vote add constraint FKl3c067ewaw5xktl5cjvniv3e9 foreign key (post_id) references post;
alter table vote add constraint FKc6i3m68apmo9o5oqntyl0s0ip foreign key (user_id) references usr;



