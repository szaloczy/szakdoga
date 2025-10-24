# Jelszó Változtatás API Dokumentáció

## Endpoint
```
PUT /api/user/:id/change-password
```

## Autentikáció
Szükséges: Bearer token az Authorization header-ben

## Jogosultságok
- **Saját jelszó**: Minden felhasználó változtathatja a saját jelszavát
- **Más felhasználó jelszava**: Csak admin változtathatja

## Request Body
```json
{
  "currentPassword": "string", // Jelenlegi jelszó (kötelező, kivéve admin esetén)
  "newPassword": "string"      // Új jelszó (min. 6 karakter)
}
```

## Válaszok

### Sikeres jelszó változtatás (200)
```json
{
  "message": "Password changed successfully"
}
```

### Hibás kérés (400)
```json
"Invalid user ID"
"Current password and new password are required"
"New password must be at least 6 characters long"
"Current password is incorrect"
"New password must be different from current password"
```

### Jogosultság hiánya (403)
```json
"You can only change your own password"
```

### Felhasználó nem található (404)
```json
"User not found"
```

## Biztonsági jellemzők

1. **Jelenlegi jelszó ellenőrzése**: A felhasználó csak a helyes jelenlegi jelszó megadásával változtathatja meg
2. **Minimális jelszó hossz**: 6 karakter minimum
3. **Új jelszó validáció**: Az új jelszó nem lehet ugyanaz, mint a jelenlegi
4. **Admin jogosultság**: Admin bármely felhasználó jelszavát megváltoztathatja a jelenlegi jelszó ismerete nélkül
5. **Jelszó hash-elés**: A jelszavak bcrypt-tel vannak hash-elve (10 rounds)

## Frontend használat

```typescript
// UserService metódus
changePassword(userId: number, data: { currentPassword: string, newPassword: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/user/${userId}/change-password`, data);
}

// Component használat
onSubmitPasswordChange() {
  if (this.passwordForm.valid) {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    
    this.userService.changePassword(this.authService.getUserId(), {
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.toastService.showSuccess('Password changed successfully!');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.toastService.showError(err.error || 'Failed to change password');
      }
    });
  }
}
```

## Tesztelés

Futtatható unit tesztek a `__tests__/unit/user.changePassword.test.ts` fájlban.

```bash
npm test -- __tests__/unit/user.changePassword.test.ts
```