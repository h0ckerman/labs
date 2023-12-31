PGDMP      4                 |            lab9    16.0    16.0     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    25591    lab9    DATABASE        CREATE DATABASE lab9 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1251';
    DROP DATABASE lab9;
                postgres    false            �            1259    25613    EmployeeVisits    TABLE     �   CREATE TABLE public."EmployeeVisits" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "EmployeeId" integer NOT NULL,
    "VisitId" integer NOT NULL
);
 $   DROP TABLE public."EmployeeVisits";
       public         heap    postgres    false            �            1259    25593 	   Employees    TABLE     �   CREATE TABLE public."Employees" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Employees";
       public         heap    postgres    false            �            1259    25592    Employees_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Employees_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Employees_id_seq";
       public          postgres    false    216            �           0    0    Employees_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Employees_id_seq" OWNED BY public."Employees".id;
          public          postgres    false    215            �            1259    25600    Visits    TABLE       CREATE TABLE public."Visits" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "employeeId" integer
);
    DROP TABLE public."Visits";
       public         heap    postgres    false            �            1259    25599    Visits_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Visits_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Visits_id_seq";
       public          postgres    false    218            �           0    0    Visits_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Visits_id_seq" OWNED BY public."Visits".id;
          public          postgres    false    217            #           2604    25596    Employees id    DEFAULT     p   ALTER TABLE ONLY public."Employees" ALTER COLUMN id SET DEFAULT nextval('public."Employees_id_seq"'::regclass);
 =   ALTER TABLE public."Employees" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            $           2604    25603 	   Visits id    DEFAULT     j   ALTER TABLE ONLY public."Visits" ALTER COLUMN id SET DEFAULT nextval('public."Visits_id_seq"'::regclass);
 :   ALTER TABLE public."Visits" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �          0    25613    EmployeeVisits 
   TABLE DATA           ]   COPY public."EmployeeVisits" ("createdAt", "updatedAt", "EmployeeId", "VisitId") FROM stdin;
    public          postgres    false    219   G       �          0    25593 	   Employees 
   TABLE DATA           I   COPY public."Employees" (id, name, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    216   �       �          0    25600    Visits 
   TABLE DATA           b   COPY public."Visits" (id, title, description, "createdAt", "updatedAt", "employeeId") FROM stdin;
    public          postgres    false    218   �       �           0    0    Employees_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Employees_id_seq"', 4, true);
          public          postgres    false    215            �           0    0    Visits_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Visits_id_seq"', 6, true);
          public          postgres    false    217            *           2606    25617 "   EmployeeVisits EmployeeVisits_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public."EmployeeVisits"
    ADD CONSTRAINT "EmployeeVisits_pkey" PRIMARY KEY ("EmployeeId", "VisitId");
 P   ALTER TABLE ONLY public."EmployeeVisits" DROP CONSTRAINT "EmployeeVisits_pkey";
       public            postgres    false    219    219            &           2606    25598    Employees Employees_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Employees" DROP CONSTRAINT "Employees_pkey";
       public            postgres    false    216            (           2606    25607    Visits Visits_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visits_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Visits" DROP CONSTRAINT "Visits_pkey";
       public            postgres    false    218            ,           2606    25618 -   EmployeeVisits EmployeeVisits_EmployeeId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."EmployeeVisits"
    ADD CONSTRAINT "EmployeeVisits_EmployeeId_fkey" FOREIGN KEY ("EmployeeId") REFERENCES public."Employees"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 [   ALTER TABLE ONLY public."EmployeeVisits" DROP CONSTRAINT "EmployeeVisits_EmployeeId_fkey";
       public          postgres    false    219    4646    216            -           2606    25623 *   EmployeeVisits EmployeeVisits_VisitId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."EmployeeVisits"
    ADD CONSTRAINT "EmployeeVisits_VisitId_fkey" FOREIGN KEY ("VisitId") REFERENCES public."Visits"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 X   ALTER TABLE ONLY public."EmployeeVisits" DROP CONSTRAINT "EmployeeVisits_VisitId_fkey";
       public          postgres    false    218    4648    219            +           2606    25608    Visits Visits_employeeId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visits_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."Employees"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 K   ALTER TABLE ONLY public."Visits" DROP CONSTRAINT "Visits_employeeId_fkey";
       public          postgres    false    216    218    4646            �   <   x�3202�50�50W02�25�26ѳ00�60�4�-e�ią)m�ghf�]'B
�3F��� Z*�      �   T   x�3�����Sp�O�4202�50�50W02�20�20׳00713�60�/�e�镘����Y�A�AƜN�I
 7��QdR� ��-�      �   �   x�����0E��o7�R�Wup�EF�ڼ`M��%ƿuu`>79�b�,R�b�ԋ��f���w4	>F�O�(�Tu.�\6�ʭ���)6���j%�?�;gJ�A[�4p�-�8���җ0������bo%��0�v��-j���W:M)�x�9��~��+�,{&�_�     