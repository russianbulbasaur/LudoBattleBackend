create database ludo;
use ludo;


create table if not exists 
users(id bigint not null auto_increment,
      name varchar(50) not null,
      phone varchar(10) not null unique,
      balance float not null default 0,
      referral bigint null,
      created_at timestamp default CURRENT_TIMESTAMP,
      updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
      primary key(id),
      foreign key(referral) references users(id));


create table if not exists 
transactions(id bigint not null auto_increment,
             user_id bigint not null,
             type enum('withdrawal','deposit') not null,
             status enum('completed','pending','denied') not null,
             amount float not null,
             order_id varchar(40),
             payment_id_or_upi_id varchar(50),
             signature varchar(70),
             date_time timestamp default CURRENT_TIMESTAMP,
             created_at timestamp default CURRENT_TIMESTAMP,
             updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
             foreign key(user_id) references users(id),
             primary key(id));
             
create table if not exists 
games(id bigint not null auto_increment,
     host_id bigint not null,
     amount float not null,
     winning_amount float not null,
     status enum('open','waiting','playing','ended') not null,
     player_id bigint,
     code varchar(20),
     winner bigint,
     attachments json default ('{}'),
     created_at timestamp default CURRENT_TIMESTAMP,
     updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
     primary key(id),
     foreign key(host_id) references users(id),
     foreign key(player_id) references users(id),
     foreign key(winner) references users(id));
     
     
create table if not exists
referral_earn(id bigint not null,
             earner bigint not null,
             referer bigint not null,
             amount float not null,
             created_at timestamp default CURRENT_TIMESTAMP,
             updated_at timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
             primary key(id),
             foreign key(earner) references users(id),
             foreign key(referer) references users(id));
             
             
