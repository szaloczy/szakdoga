# Szalóczy Krisztián - Y4O4X0 - Szakdolgozat

A feladat részletezése:
Készítsen egy olyan webes alkalmazást, amely a szakmai gyakorlatok nyilvántartására és adminisztrációjára szolgál. Az alkalmazás biztosítson bejelentkezési és regisztrációs felületet, valamint három szerepkört: hallgató, aki rögzítheti és frissítheti saját szakmai gyakorlatával kapcsolatos adatait; mentor, aki értékelheti és igazolhatja a hallgatók teljesítményét; valamint adminisztrátor, aki felügyeli a rendszert és kezelheti a felhasználói jogosultságokat.

A hallgatók szakmai gyakorlatukat csak akkor véglegesíthetik, ha minden szükséges dokumentumot feltöltöttek és azokat a mentor jóváhagyta. A rendszer listázza a hallgatók szakmai gyakorlatait és azok státuszát.

Készítsen egység- és integrációs teszteket a rendszer tesztelésére Jest és Karma segítségével. Az alkalmazás üzembe helyezése Docker konténerizációval történjen, biztosítva a könnyű telepíthetőséget és skálázhatóságot.


# BACKEND

Use VS code ediot as an IDE

Steps to run this project:
In backend folder:
1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command / develpoer mod run `npm run dev`

## Running BACKEND TESTS
Run `npm run test`

## Running eslint check
Run `npm run lint`

# DOCKER 

Webapp connects to a postgres database in a docker container

In backend folder:
`docker compose up`

# FRONTEND
Steps to run this project:

In frontend folder:
1. Run `npm i` command
3. Run `ng serve`