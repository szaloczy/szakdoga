# Export to CSV - Backend oldali megvalósítás

## Szükséges lépések

1. **API végpont létrehozása**
   - Pl.: `GET /api/students/export-csv`
   - Jogosultság ellenőrzése (csak admin vagy jogosult felhasználók)

2. **Adatok lekérése**
   - Szűrési paraméterek támogatása (pl. státusz, név, egyetem, stb.)
   - Adatok lekérése adatbázisból

3. **CSV generálása szerveren**
   - Megfelelő oszlopok: név, email, egyetem, státusz, órák, stb.
   - Adatok formázása, speciális karakterek kezelése

4. **Válasz formázása**
   - HTTP válaszban a CSV fájl küldése
   - Megfelelő Content-Type: `text/csv`
   - Fájl név beállítása: pl. `students_export_YYYYMMDD.csv`

5. **Hibakezelés**
   - Hibás kérés, jogosulatlan hozzáférés, üres adatlista esetén megfelelő válasz

6. **Dokumentáció**
   - API végpont leírása, paraméterek, válasz formátum

## Példa API válasz
```
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="students_export_20250822.csv"

Név,Email,Egyetem,Státusz,Teljesített órák,Függő órák
Kiss Péter,kiss.peter@uni.hu,BME,completed,180,0
Nagy Anna,nagy.anna@uni.hu,ELTE,pending,120,60
...
```

## Javasolt technológiák
- Node.js: `csv-writer`, `fast-csv` vagy hasonló
- Python: `csv` modul
- Java: OpenCSV

## Tesztelés
- Jogosultság tesztelése
- Nagy adatmennyiség exportja
- CSV formátum ellenőrzése
- Hibás/üres lekérdezés kezelése
