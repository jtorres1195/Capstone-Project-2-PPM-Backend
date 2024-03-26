\echo 'Delete and recreate perfectpetmatchdb db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE perfectpetmatchdb;
CREATE DATABASE perfectpetmatchdb;
\connect perfectpetmatchdb

\i perfectpetmatchdb-schema.sql
\i perfectpetmatchdb-seed.sql

\i perfectpetmatchdb-schema.sql