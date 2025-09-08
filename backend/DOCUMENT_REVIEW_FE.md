
# Angular – Dokumentumok admin review funkció FE oldali teendők

## 1. Típusok (`document.model.ts`)
```typescript
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: number;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  filename: string;
  originalName: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewNote?: string;
}
```

## 2. Service (`document.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>('/api/documents');
  }

  reviewDocument(id: number, status: DocumentStatus, reviewNote?: string): Observable<any> {
    return this.http.post(`/api/documents/${id}/review`, { status, reviewNote });
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`/api/documents/${id}/download`, { responseType: 'blob' });
  }
}
```

## 3. Komponens (`document-review.component.ts`)
- Listázd a dokumentumokat (pl. táblázatban).
- Minden sorban legyen „Elfogad” és „Elutasít” gomb.
- Elutasításnál jelenjen meg egy modal/input, ahol admin megadja az indokot.
- Gombokra kattintva hívd meg a `reviewDocument` metódust.
- Sikeres művelet után frissítsd a listát, mutass visszajelzést (pl. Angular Material Snackbar).

## 4. Példa sablon (`document-review.component.html`)
```html
<table>
  <tr *ngFor="let doc of documents">
    <td>{{ doc.originalName }}</td>
    <td>{{ doc.user.firstname }} {{ doc.user.lastname }}</td>
    <td>{{ doc.status }}</td>
    <td>
      <button (click)="approve(doc.id)">Elfogad</button>
      <button (click)="openRejectModal(doc.id)">Elutasít</button>
      <button (click)="download(doc.id)">Letöltés</button>
    </td>
  </tr>
</table>

<!-- Elutasítás modal -->
<ng-template #rejectModal>
  <input [(ngModel)]="reviewNote" placeholder="Elutasítás indoka">
  <button (click)="reject(selectedId)">Elutasítás véglegesítése</button>
</ng-template>
```

## 5. Komponens logika (`document-review.component.ts`)
```typescript
export class DocumentReviewComponent implements OnInit {
  documents: Document[] = [];
  reviewNote = '';
  selectedId: number | null = null;

  constructor(private documentService: DocumentService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getAllDocuments().subscribe(docs => this.documents = docs);
  }

  approve(id: number) {
    this.documentService.reviewDocument(id, 'approved').subscribe(() => {
      this.snackBar.open('Elfogadva!', '', { duration: 2000 });
      this.loadDocuments();
    });
  }

  openRejectModal(id: number) {
    this.selectedId = id;
    // Modal megnyitása
  }

  reject(id: number) {
    this.documentService.reviewDocument(id, 'rejected', this.reviewNote).subscribe(() => {
      this.snackBar.open('Elutasítva!', '', { duration: 2000 });
      this.loadDocuments();
      this.reviewNote = '';
      this.selectedId = null;
      // Modal bezárása
    });
  }

  download(id: number) {
    this.documentService.downloadDocument(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
}
```

## 6. Egyéb
- Státuszok színezése (pending: sárga, approved: zöld, rejected: piros)
- Letöltés gomb: `/api/documents/:id/download` endpoint
- Hiba/siker visszajelzés (Angular Material Snackbar, alert)

---

Ez az összefoglaló segít az Angular FE oldali admin dokumentum review funkció implementálásában. Ha részletesebb példát vagy UI mintát szeretnél, szólj!
