CREATE TABLE [dbo].[ktp_actividad](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[fecha] [datetime] NULL,
	[usuario] [varchar](50) NULL,
	[actividad] [varchar](50) NULL,
	[info1] [varchar](50) NULL,
	[info2] [varchar](50) NULL,
	[info3] [varchar](50) NULL,
	[geolat] [varchar](20) NULL,
	[geolon] [varchar](20) NULL,
 CONSTRAINT [PK_k_actividad] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
CREATE TABLE [dbo].[ktb_usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](80) NOT NULL,
	[pssw] [varchar](120) NOT NULL,
	[celular] [varchar](20) NOT NULL,
	[nombre] [varchar](80) NULL,
	[direccion] [varchar](100) NULL,
	[creacion] [datetime] NOT NULL,
	[valido] [bit] NOT NULL,
	[validador] [char](3) NULL,
	[fvalidacion] [datetime] NULL,
 CONSTRAINT [PK_ktb_usuarios] PRIMARY KEY CLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ktb_usuarios] ADD  CONSTRAINT [DF_ktb_usuarios_creacion]  DEFAULT (getdate()) FOR [creacion]
GO

ALTER TABLE [dbo].[ktb_usuarios] ADD  CONSTRAINT [DF_ktb_usuarios_valido]  DEFAULT ((0)) FOR [valido]
GO

CREATE TABLE [dbo].[ktb_home](
	[codigo] [char](13) NOT NULL,
	[descripcion] [varchar](100) NULL,
	[orden] [int] NULL,
	[segmento] [varchar](20) NULL,
 CONSTRAINT [PK_ktb_home] PRIMARY KEY CLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO