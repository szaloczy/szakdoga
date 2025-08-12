# Backend API Requirements for Mentor Students Page

## 📋 Overview
A mentor oldalon megjelenő hallgatók kezelése az alábbi backend API végpontokat és adatstruktúrákat igényli.

## 🔗 Required API Endpoints

### 1. **GET /mentor/students**
**Cél:** Mentor hozzárendelt hallgatóinak listája óraszámokkal

**Válasz formátum:**
```json
[
  {
    "id": 1,
    "firstname": "János",
    "lastname": "Kovács", 
    "email": "janos.kovacs@example.com",
    "major": "Computer Science",
    "university": "ELTE",
    "hours": 120,                    // Jóváhagyott órák összesen
    "pendingHours": 15,              // Jóváhagyásra váró órák
    "rejectedHours": 5,              // Elutasított órák
    "totalSubmittedHours": 140       // Összes beküldött óra
  }
]
```

### 2. **POST /internship-hour/student/:studentId/approve-all**
**Cél:** Egy hallgató összes pending órájának jóváhagyása

**Request body:** `{}`
**Response:**
```json
{
  "success": true,
  "message": "All pending hours approved successfully",
  "approvedHours": 15,
  "newTotalHours": 135
}
```

### 3. **GET /internship-hour/student/:studentId/details**
**Cél:** Hallgató részletes óra statisztikái és lista

**Response:**
```json
{
  "studentId": 1,
  "statistics": {
    "totalHours": 140,
    "approvedHours": 120,
    "pendingHours": 15,
    "rejectedHours": 5
  },
  "hours": [
    {
      "id": 1,
      "date": "2025-08-01",
      "hours": 8,
      "description": "Frontend development work",
      "status": "approved", // "pending" | "approved" | "rejected"
      "submittedAt": "2025-08-01T18:00:00Z",
      "reviewedAt": "2025-08-02T09:00:00Z",
      "reviewedBy": "mentor@example.com"
    }
  ]
}
```

### 4. **POST /internship-hour/bulk-approve**
**Cél:** Tömeges órák jóváhagyása (több hallgató)

**Request body:**
```json
{
  "hourIds": [1, 2, 3, 4, 5]  // Vagy studentIds array
}
```

**Response:**
```json
{
  "success": true,
  "processedCount": 5,
  "errors": []
}
```

## 📊 Data Structure Requirements

### StudentResponseDTO
```typescript
interface StudentResponseDTO {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  major: string | null;
  university: string | null;
  hours: number;                    // Jóváhagyott órák
  pendingHours?: number;            // Pending órák (KÖTELEZŐ!)
  rejectedHours?: number;           // Elutasított órák
  totalSubmittedHours?: number;     // Összes beküldött
}
```

### Hour Entry Details
```typescript
interface HourEntryDTO {
  id: number;
  date: string;                     // ISO date string
  hours: number;                    // Órák száma (pl. 8, 4.5)
  description: string;              // Munka leírása
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;              // ISO datetime
  reviewedAt?: string;              // ISO datetime (ha reviewed)
  reviewedBy?: string;              // Mentor email/név
  rejectionReason?: string;         // Ha rejected
}
```

## 🔧 Backend Implementation Requirements

### 1. **Mentor Service Layer**
```typescript
// Pseudo code - implementálandó backend oldalon

class MentorService {
  async getAssignedStudents(mentorId: number): Promise<StudentResponseDTO[]> {
    // 1. Mentor hozzárendelt hallgatóinak lekérése
    // 2. Minden hallgatóhoz órák összegzése:
    //    - hours: SUM(approved hours)
    //    - pendingHours: SUM(pending hours) 
    //    - rejectedHours: SUM(rejected hours)
    //    - totalSubmittedHours: SUM(all submitted hours)
    // 3. StudentResponseDTO formátumban visszaadás
  }
}
```

### 2. **InternshipHour Service Layer**
```typescript
class InternshipHourService {
  async approveAllStudentHours(studentId: number, mentorId: number) {
    // 1. Hallgató összes pending órájának megkeresése
    // 2. Status frissítése 'pending' -> 'approved'
    // 3. ReviewedAt és reviewedBy mezők beállítása
    // 4. Összegzett válasz visszaadása
  }

  async getStudentHourDetails(studentId: number) {
    // 1. Hallgató összes órájának lekérése részletesen
    // 2. Statisztikák számolása
    // 3. Órák listája időrendi sorrendben (legújabb elől)
  }

  async bulkApprove(hourIds: number[], mentorId: number) {
    // 1. Batch processing minden hourId-hoz
    // 2. Hibakezelés: részben sikeres műveletek támogatása
    // 3. Részletes eredmény visszaadása
  }
}
```

## 🔍 Key Implementation Points

### 1. **Óraszámok számítása**
```sql
-- Példa SQL query - adaptálandó a valós adatbázis sémához
SELECT 
  s.id,
  u.firstname,
  u.lastname,
  u.email,
  s.major,
  s.university,
  COALESCE(SUM(CASE WHEN ih.status = 'approved' THEN ih.hours ELSE 0 END), 0) as hours,
  COALESCE(SUM(CASE WHEN ih.status = 'pending' THEN ih.hours ELSE 0 END), 0) as pendingHours,
  COALESCE(SUM(CASE WHEN ih.status = 'rejected' THEN ih.hours ELSE 0 END), 0) as rejectedHours,
  COALESCE(SUM(ih.hours), 0) as totalSubmittedHours
FROM students s
LEFT JOIN users u ON s.user_id = u.id
LEFT JOIN internships i ON s.id = i.student_id  
LEFT JOIN internship_hours ih ON i.id = ih.internship_id
WHERE i.mentor_id = ? -- mentor ID parameter
GROUP BY s.id, u.firstname, u.lastname, u.email, s.major, s.university
```

### 2. **Jogosultság ellenőrzés**
- Minden API hívásnál ellenőrizni kell, hogy a mentor valóban hozzá van-e rendelve a hallgatóhoz
- JWT token alapú authentikáció szükséges
- Mentor role ellenőrzés kötelező

### 3. **Hibakezelés**
- 404: Hallgató nem található vagy nincs hozzáférés
- 400: Hibás kérés (pl. nincs pending óra)
- 500: Szerver hiba proper error message-dzsel

## 🚀 Testing Checklist

- [ ] GET /mentor/students megfelelő adatokat ad vissza
- [ ] pendingHours mező helyesen számolódik
- [ ] approveAllStudentHours működik és frissíti az adatokat  
- [ ] getStudentHourDetails részletes adatokat ad vissza
- [ ] bulkApprove kezeli a hibákat
- [ ] Jogosultság ellenőrzések működnek
- [ ] Empty state-ek kezelve (nincs hallgató, nincs óra, stb.)

## 📝 Notes

- A frontend most már teljesen a backend API-kra támaszkodik
- Nincsenek mock adatok a kódban
- Hibás API válaszok esetén megfelelő hibaüzenetek jelennek meg
- Loading state-ek minden API hívás során aktívak
