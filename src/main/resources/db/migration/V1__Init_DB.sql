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
	user_id int8,
	primary key (id));
	

create table refresh_token (
	id  bigserial not null,
	created_date timestamp,
	token varchar(255),
	user_id int8,
	primary key (id));
 
create table role (
	id  serial not null, 
	name varchar(20), 
	primary key (id));
	
create table topic (
	id  bigserial not null, 
	created_date timestamp, 
	description varchar(255) not null, 
	name varchar(255) not null, 
	user_id int8, primary key (id));
	
create table token (
	id  bigserial not null, 
	expiry_date timestamp, 
	token varchar(255), 
	user_id int8, 
	primary key (id));
	
create table user_roles (
	user_id int8 not null, 
	role_id int4 not null, 
	primary key (user_id, role_id));
create table usr (
	id  bigserial not null, 
	created timestamp, 
	email varchar(255) not null, 
	email_confirmed boolean not null, 
	password varchar(255) not null, 
	username varchar(20) not null, 
	primary key (id));
	
create table vote (
	id  bigserial not null, 
	vote_type int4, 
	post_id int8 not null, 
	user_id int8, 
	primary key (id));

alter table usr add constraint UQ_user_username unique (username);
alter table usr add constraint UQ_user_email unique (email);
alter table commentary add constraint FK_post_commentary foreign key (post_id) references post;
alter table commentary add constraint FK_user_commentary foreign key (user_id) references usr;
alter table post add constraint FK_topic_post foreign key (topic_id) references topic;
alter table post add constraint FK_user_post foreign key (user_id) references usr;
alter table refresh_token add constraint FK_user_refresh_token foreign key (user_id) references usr;
alter table token add constraint FK_user_token foreign key (user_id) references usr;
alter table topic add constraint FK_user_topic foreign key (user_id) references usr;
alter table topic add constraint UQ_topic_name unique (name);
alter table user_roles add constraint FK_role_user_roles foreign key (role_id) references role;
alter table user_roles add constraint FK_user_user_roles foreign key (user_id) references usr;
alter table vote add constraint FK_post_vote foreign key (post_id) references post;
alter table vote add constraint FK_user_vote foreign key (user_id) references usr;



