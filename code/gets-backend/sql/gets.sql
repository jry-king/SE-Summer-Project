create table cameras
(
    cameraid    integer NOT NULL UNIQUE,
    param1      varchar(40) NOT NULL,
    param2      varchar(40) NOT NULL,
    param3      varchar(40) NOT NULL,
    x   varchar(10) NOT NULL,
    y   varchar(10) NOT NULL,
    areaid      integer NOT NULL,
    primary key (cameraid)
    
)