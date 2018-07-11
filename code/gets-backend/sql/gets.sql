create table cameras
(
    cameraid    integer NOT NULL UNIQUE AUTO_INCREMENT,
    param1      varchar(40) NOT NULL,
    param2      varchar(40) NOT NULL,
    param3      varchar(40) NOT NULL,
    x   varchar(10) NOT NULL,
    y   varchar(10) NOT NULL,
    areaid      integer NOT NULL,
    primary key (cameraid)
);

create table history
(
    id  integer NOT NULL UNIQUE AUTO_INCREMENT,
    cameraid integer NOT NULL,
    filename varchar(100) NOT NULL,
    primary key (id)
);

create table map
(
    areaid integer NOT NULL UNIQUE AUTO_INCREMENT,
    map varchar(50000),
    primary key (areaid)
)