--
-- PostgreSQL database dump
--

\restrict PF4KWENBgLXdcduIQD9P0MxN4jCm51USgdP3oYhgz8F50dipgte0G0C7UFzVIQg

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-18 20:59:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16426)
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    id_mascota integer NOT NULL,
    id_empleado integer,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    estado character varying(50) DEFAULT 'pendiente'::character varying,
    observaciones text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo_cita character varying(100),
    detalle text
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16425)
-- Name: citas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citas_id_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 223
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- TOC entry 222 (class 1259 OID 16408)
-- Name: mascotas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mascotas (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    especie character varying(50) NOT NULL,
    sexo character varying(20),
    activo boolean DEFAULT true,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    raza character varying(100),
    fecha_nacimiento date,
    peso numeric(5,2)
);


ALTER TABLE public.mascotas OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16407)
-- Name: mascotas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mascotas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mascotas_id_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 221
-- Name: mascotas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mascotas_id_seq OWNED BY public.mascotas.id;


--
-- TOC entry 225 (class 1259 OID 16456)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'cliente'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4877 (class 2604 OID 16429)
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 16411)
-- Name: mascotas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascotas ALTER COLUMN id SET DEFAULT nextval('public.mascotas_id_seq'::regclass);


--
-- TOC entry 4870 (class 2604 OID 16393)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5047 (class 0 OID 16426)
-- Dependencies: 224
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.citas VALUES (2, 4, 1, NULL, '2026-01-22', '08:00:00', 'pendiente', NULL, '2026-01-18 14:57:35.406076', 'Estetico', 'Baño Completo');
INSERT INTO public.citas VALUES (1, 4, 2, 2, '2026-01-19', '10:00:00', 'pendiente', NULL, '2026-01-18 14:54:28.645575', 'Medico', 'Vacunación');
INSERT INTO public.citas VALUES (3, 4, 1, 2, '2026-01-18', '16:00:00', 'Realizada', 'Se le inyecto', '2026-01-18 15:03:07.994704', 'Medico', 'Cojea / Dolor');


--
-- TOC entry 5045 (class 0 OID 16408)
-- Dependencies: 222
-- Data for Name: mascotas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.mascotas VALUES (1, 4, 'Pinina', 'Perro', 'Hembra', true, '2026-01-18 14:48:43.299944', 'Mestizo', '2026-01-01', 5.50);
INSERT INTO public.mascotas VALUES (2, 4, 'Negrito', 'Gato', 'Macho', true, '2026-01-18 14:49:19.061626', NULL, '2026-01-13', 4.50);


--
-- TOC entry 5048 (class 0 OID 16456)
-- Dependencies: 225
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5043 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (1, 'Administrador', 'admin@caninu.com', 'admin123', 'admin', '2026-01-18 12:46:52.61361', 'activo');
INSERT INTO public.usuarios VALUES (2, 'Veterinario Juan', 'empleado2@caninu.com', 'admin123', 'empleado', '2026-01-18 12:46:52.61361', 'activo');
INSERT INTO public.usuarios VALUES (3, 'Cliente Javier', 'javier@example.com', 'clave123', 'cliente', '2026-01-18 12:46:52.61361', 'activo');
INSERT INTO public.usuarios VALUES (4, 'admin', 'admin@example.com', 'clave123', 'usuario', '2026-01-18 12:48:46.986283', 'activo');


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 223
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citas_id_seq', 3, true);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 221
-- Name: mascotas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mascotas_id_seq', 2, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- TOC entry 4887 (class 2606 OID 16440)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16419)
-- Name: mascotas mascotas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascotas
    ADD CONSTRAINT mascotas_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 16465)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 4881 (class 2606 OID 16406)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4883 (class 2606 OID 16404)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 1259 OID 16466)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- TOC entry 4892 (class 2606 OID 16446)
-- Name: citas fk_empleado_cita; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT fk_empleado_cita FOREIGN KEY (id_empleado) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 4893 (class 2606 OID 16451)
-- Name: citas fk_mascota_cita; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT fk_mascota_cita FOREIGN KEY (id_mascota) REFERENCES public.mascotas(id) ON DELETE CASCADE;


--
-- TOC entry 4894 (class 2606 OID 16441)
-- Name: citas fk_usuario_cita; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT fk_usuario_cita FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4891 (class 2606 OID 16420)
-- Name: mascotas fk_usuario_mascota; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mascotas
    ADD CONSTRAINT fk_usuario_mascota FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-01-18 20:59:47

--
-- PostgreSQL database dump complete
--

\unrestrict PF4KWENBgLXdcduIQD9P0MxN4jCm51USgdP3oYhgz8F50dipgte0G0C7UFzVIQg

