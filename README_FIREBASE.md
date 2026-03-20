# Migration Firebase — École SCIRE

## Fichiers fournis

| Fichier | Emplacement dans le projet | Description |
|---|---|---|
| `scire-store.ts` | `src/lib/scire-store.ts` | Remplace l'ancien store localStorage par Firebase |
| `login.tsx` | `src/routes/login.tsx` | Connexion + inscription + mot de passe oublié via Firebase Auth |
| `student.tsx` | `src/routes/student.tsx` | Espace étudiant avec chargement async Firebase |
| `results.tsx` | `src/routes/results.tsx` | Résultats publics depuis Firestore |
| `memoirs.tsx` | `src/routes/memoirs.tsx` | Mémoires depuis Firestore + Storage |
| `theses.tsx` | `src/routes/theses.tsx` | Thèses depuis Firestore + Storage |

---

## Installation Firebase SDK

Dans votre terminal, à la racine du projet :

```bash
npm install firebase
```

---

## Configuration Firebase (déjà intégrée)

Le projet Firebase **ecolescire01** est déjà configuré dans `scire-store.ts` :

```
apiKey:            AIzaSyA5ZJbRbKbs7qIZwyvV5rOb_OI9IT1oEWU
authDomain:        ecolescire01.firebaseapp.com
projectId:         ecolescire01
storageBucket:     ecolescire01.firebasestorage.app
messagingSenderId: 391556479368
appId:             1:391556479368:web:f46ee988f1f0907ad5a23d
```

---

## Étapes dans la console Firebase (ecolescire01)

### 1. Authentication
- Allez dans **Authentication → Sign-in method**
- Activez **Email/Mot de passe**
- Créez le compte admin manuellement :
  - Email : `admin@scire-unikin.ac.cd`
  - Mot de passe : `scire@admin2025`

### 2. Firestore Database
- Allez dans **Firestore Database → Créer une base de données**
- Choisissez **Mode test**
- Collections créées automatiquement : `users`, `publications`, `results`, `messages`

### 3. Storage
- Allez dans **Storage → Commencer**
- Choisissez **Mode test**
- Les PDF seront stockés dans les dossiers `publications/` et `results/`

### 4. Règles Firestore (après les tests)
Remplacez les règles test par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Publications et résultats : lecture publique, écriture admin uniquement
    match /publications/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@scire-unikin.ac.cd';
    }
    match /results/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@scire-unikin.ac.cd';
    }
    // Utilisateurs : lecture/écriture par l'utilisateur lui-même
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read: if request.auth != null && request.auth.token.email == 'admin@scire-unikin.ac.cd';
    }
    // Messages : écriture publique, lecture admin
    match /messages/{doc} {
      allow create: if true;
      allow read: if request.auth != null && request.auth.token.email == 'admin@scire-unikin.ac.cd';
    }
  }
}
```

---

## Comptes de connexion

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@scire-unikin.ac.cd | scire@admin2025 |
| Étudiant | (email au choix) | (mot de passe choisi à l'inscription, min. 6 caractères) |

---

## Ce qui change par rapport à l'ancienne version

- **Stockage** : plus de localStorage → tout est dans Firebase
- **Synchronisation** : toutes les publications sont visibles sur tous les appareils instantanément
- **PDF** : stockés sur Firebase Storage avec URL permanente (plus de Blob local)
- **Authentification** : Firebase Auth gère les sessions, mots de passe hashés, réinitialisation par email
- **Mot de passe oublié** : Firebase envoie automatiquement l'email de réinitialisation
