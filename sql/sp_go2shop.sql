--  exec ksp_go2shop_buscaruser 'jogv66@gmail.com','MjAxOHBlcnJvKys=' ; 
IF OBJECT_ID('ksp_go2shop_buscaruser', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_go2shop_buscaruser;  
GO  
CREATE PROCEDURE ksp_go2shop_buscaruser ( @email varchar(80), @pssw varchar(120) ) 
With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
	--
	select	id,email,celular,nombre,direccion,creacion,valido
	FROM ktb_usuarios
	where email = @email
	  and pssw = @pssw;
	--
END;
go

IF OBJECT_ID('ksp_go2shop_crearuser', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_go2shop_crearuser;  
GO  
CREATE PROCEDURE ksp_go2shop_crearuser ( 
	@email varchar(80),
	@celu varchar(20),
	@pssw varchar(120),
	@nombre varchar(80),
	@direccion varchar(100) ) 
With Encryption
AS
BEGIN
	--
	-- select @email,@pssw,@celu,@nombre,@direccion
    SET NOCOUNT ON
	--
	declare @Error	nvarchar(250), 
			@ErrMsg	nvarchar(2048);
	--
	BEGIN TRY ;  
		if not exists ( select * from ktb_usuarios where email = @email and pssw = @pssw ) begin
			insert into ktb_usuarios (email,pssw,celular,nombre,direccion,valido)
							  values (@email,@pssw,@celu,@nombre,@direccion,0)
			--
			set  @Error = @@ERROR
			if ( @Error <> 0 ) begin
				set @ErrMsg = ERROR_MESSAGE();
				THROW @Error, @ErrMsg, 0 ;  
			end			
			--
			select 1 as id, cast(0 as bit) as error, '' as mensaje; 
			--
		end
		else begin
			--
			select cast(0 as bit) as resultado, cast(1 as bit) as error, 'Ya existe un usuario con ese mismo email en nuestros registros. Corrija y reintente.' as mensaje;
			--
		end;
	END TRY
	BEGIN CATCH
		--
		select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje; 
		--
	END CATCH;
	--
END;
go


-- exec ksp_go2shop_buscarprod null,0
-- exec ksp_go2shop_buscarprod 'ngx',0 ;
IF OBJECT_ID('ksp_go2shop_buscarprod', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_go2shop_buscarprod;  
GO  
CREATE PROCEDURE ksp_go2shop_buscarprod ( @texto varchar(50), @offset int ) 
With Encryption
AS
BEGIN
 
    SET NOCOUNT ON
	--
	declare @query			NVARCHAR(max)	= ''; 
    declare @stock			varchar(200)	= '';  -- AND COALESCE(BO.STFI1,0) <> 0
	declare @soloconprecios varchar(200)	= ' AND coalesce(L.precio, 0) > 0 ';  -- AND coalesce(L.precio, 0) > 0 
	declare @paginar		varchar(200)	= ' OFFSET '+rtrim(cast(@offset as varchar(5)))+' ROWS FETCH NEXT 20 ROWS ONLY; ';
	declare @xorden			varchar(200)	= '';
	declare @descri			varchar(2500);
	declare @xnokopr		varchar(500);
	declare @xkopr			varchar(500);
	declare @xnokopramp		varchar(500);
	--
	set @query += 'with precios as ( select L.KOPR,TL.MELT,(case when TL.MELT=''N'' then ''Neto'' else ''Bruto'' end) as tipolista, L.PP01UD as precio ';
	set @query +=					'from TABPRE  AS L with (nolock) ';
	set @query +=					'inner join TABPP TL  with (nolock) on L.KOLT=TL.KOLT ';
	set @query +=					'where L.KOLT=''01P'' ) ';
    set @query += 'select PR.KOPR as codigo,';
	set @query +=         '(case when patindex(''%-%'',reverse(rtrim(PR.KOPRTE)))>0 then substring(rtrim(PR.KOPRTE), 1, len(rtrim(PR.KOPRTE))-patindex(''%-%'',reverse(rtrim(PR.KOPRTE)))) else rtrim(PR.KOPRTE) end)+''.jpg'' as codigosincolor,';
    set @query +=         'rtrim(PR.NOKOPR) AS descripcion,PR.UD01PR as unidad1, PR.RLUD as rtu,';
    set @query +=         'COALESCE(BO.STFI1,0) as fisico_ud1,';
    set @query +=         'rtrim(MAR.NOKOMR) as marca, L.precio,';
    set @query +=         'L.tipolista,L.MELT as metodolista,''01P'' as listaprecio ';
	--
	if ( @texto is null ) set @query += ',home.segmento ';
	else				  set @query += ','''' as segmento ';
	--
    set @query += 'FROM MAEPR         AS PR  WITH (NOLOCK) ';
    set @query += 'inner join MAEPREM AS ME  WITH (NOLOCK) on PR.KOPR=ME.KOPR and ME.EMPRESA=''02'' ';
	--
	if ( @texto is null ) begin
		set @query += 'inner join ktb_home AS home  WITH (NOLOCK) on PR.KOPR=home.codigo ';
	end;
	--
    set @query += 'left  join MAEST   AS BO  WITH (NOLOCK) on BO.EMPRESA=''02'' and BO.KOSU=''CMA'' AND BO.KOBO=''001'' AND BO.KOPR = PR.KOPR ';
    set @query += 'left  join precios AS L   with (nolock) on L.KOPR=PR.KOPR ';
    set @query += 'left  join TABMR   AS MAR with (nolock) on MAR.KOMR=PR.MRPR ';
	--
	if ( @texto is null )	set @xorden = ' ORDER BY home.orden ';
	else					set @xorden = ' ORDER BY PR.NOKOPR ';
    --
    exec ksp_cambiatodo @texto, @salida = @descri OUTPUT ;
	--
    begin
		if ( @texto is null ) begin	
			--
			set @xnokopr = ' 1=1 ';
			set @query = concat( @query, ' WHERE ', @xnokopr, @stock, @soloconprecios, @xorden, @paginar ); 
			--
		end
		else begin
			--
			exec ksp_TipoGoogle 'PR.NOKOPR',	@descri, @salida = @xnokopr output;
			exec ksp_TipoGoogle 'PR.KOPR',		@descri, @salida = @xkopr output;
			exec ksp_TipoGoogle 'PR.NOKOPRAMP',	@descri, @salida = @xnokopramp output;
			set @query = concat( @query, ' WHERE ( ', @xnokopr,' or ',@xkopr,' or ', @xnokopramp,' ) ', @stock, @soloconprecios, @xorden, @paginar ); 
			--
		end;
		--
		-- print @query;
        EXECUTE sp_executesql @query
    end         
END;
go

