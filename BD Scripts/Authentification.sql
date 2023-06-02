
drop procedure GetUserByEmail;
create procedure GetUserByEmail @email nvarchar(max)
AS
BEGIN
SELECT * FROM apuser WHERE apuser.email = @email
PRINT 'proc exec!';
END;

create procedure Authentification @email nvarchar(max), @password nvarchar(max) 
AS
SELECT * FROM apuser WHERE apuser.email    = @email
                       AND APUSER.password = @password

                       