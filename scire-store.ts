// src/lib/scire-store.ts
// Firebase-powered store — remplace le localStorage
// Projet Firebase : ecolescire01

import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

// ─── Firebase Config ────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyA5ZJbRbKbs7qIZwyvV5rOb_OI9IT1oEWU',
  authDomain: 'ecolescire01.firebaseapp.com',
  projectId: 'ecolescire01',
  storageBucket: 'ecolescire01.firebasestorage.app',
  messagingSenderId: '391556479368',
  appId: '1:391556479368:web:f46ee988f1f0907ad5a23d',
  measurementId: 'G-HWSPP91JXG',
}

// Évite la double initialisation en dev (hot reload)
const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

export const auth    = getAuth(firebaseApp)
export const db      = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

// ─── Types ──────────────────────────────────────────────────────────────────
export type PublicationType = 'article' | 'memoir' | 'thesis'

export interface Publication {
  id: string
  type: PublicationType
  title: string
  author: string
  abstract: string
  year: number
  tags: string[]
  downloads: number
  fileURL?: string
  fileRef?: string
  fileName?: string
  createdAt?: number
}

export interface AcademicResult {
  id: string
  studentName: string
  class: string
  academicYear: string
  subject: string
  score: number
  grade?: number
  mention: string
  pdfName?: string
  fileURL?: string
  fileRef?: string
  createdAt?: number
}

export interface ScireUser {
  id: string
  uid: string
  name: string
  email: string
  class: string
  role: 'student' | 'admin'
  createdAt?: number
}

export interface Session {
  userId: string
  uid: string
  email: string
  name: string
  role: 'student' | 'admin'
  class: string
}

// ─── Session (localStorage léger pour l'UI) ─────────────────────────────────
const SESSION_KEY = 'scire_session'

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Écoute les changements d'état Firebase Auth et met à jour la session
export function initAuthListener(onUser: (user: User | null) => void) {
  return onAuthStateChanged(auth, onUser)
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

// Connexion admin via Firebase Auth
export async function loginAdmin(email: string, password: string): Promise<Session> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const session: Session = {
    userId: cred.user.uid,
    uid: cred.user.uid,
    email: cred.user.email ?? email,
    name: 'Administrateur SCIRE',
    role: 'admin',
    class: '',
  }
  setSession(session)
  return session
}

// Connexion étudiant via Firebase Auth
export async function loginStudent(email: string, password: string): Promise<Session> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  // Récupère le profil depuis Firestore
  const profile = await getUserByUid(cred.user.uid)
  const session: Session = {
    userId: cred.user.uid,
    uid: cred.user.uid,
    email: cred.user.email ?? email,
    name: profile?.name ?? email,
    role: 'student',
    class: profile?.class ?? '',
  }
  setSession(session)
  return session
}

// Inscription étudiant
export async function registerStudent(
  email: string,
  password: string,
  name: string,
  studentClass: string,
): Promise<Session> {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const profile: Omit<ScireUser, 'id'> = {
    uid: cred.user.uid,
    name,
    email,
    class: studentClass,
    role: 'student',
    createdAt: Date.now(),
  }
  await setDoc(doc(db, 'users', cred.user.uid), profile)
  const session: Session = {
    userId: cred.user.uid,
    uid: cred.user.uid,
    email,
    name,
    role: 'student',
    class: studentClass,
  }
  setSession(session)
  return session
}

// Mot de passe oublié
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

// Déconnexion
export async function logout(): Promise<void> {
  await signOut(auth)
  clearSession()
}

// ─── UTILISATEURS ────────────────────────────────────────────────────────────

export async function getUserByUid(uid: string): Promise<ScireUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as ScireUser
}

export async function getUserByEmail(email: string): Promise<ScireUser | null> {
  const q = query(collection(db, 'users'), where('email', '==', email))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as ScireUser
}

export async function getAllUsers(): Promise<ScireUser[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScireUser))
}

// ─── PUBLICATIONS ─────────────────────────────────────────────────────────────

export async function getPublicationsByType(type: PublicationType): Promise<Publication[]> {
  const q = query(
    collection(db, 'publications'),
    where('type', '==', type),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Publication))
}

export async function getAllPublications(): Promise<Publication[]> {
  const q = query(collection(db, 'publications'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Publication))
}

export async function addPublication(
  data: Omit<Publication, 'id' | 'downloads' | 'createdAt'>,
  file?: File,
): Promise<string> {
  let fileURL: string | undefined
  let fileRef: string | undefined
  let fileName: string | undefined

  if (file) {
    const path = `publications/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    fileURL = await getDownloadURL(storageRef)
    fileRef = path
    fileName = file.name
  }

  const docRef = await addDoc(collection(db, 'publications'), {
    ...data,
    downloads: 0,
    fileURL: fileURL ?? null,
    fileRef: fileRef ?? null,
    fileName: fileName ?? null,
    createdAt: Date.now(),
  })
  return docRef.id
}

export async function deletePublication(id: string, fileRef?: string): Promise<void> {
  await deleteDoc(doc(db, 'publications', id))
  if (fileRef) {
    try {
      await deleteObject(ref(storage, fileRef))
    } catch {
      // Fichier déjà supprimé ou inexistant
    }
  }
}

export async function incrementDownloads(id: string): Promise<void> {
  await updateDoc(doc(db, 'publications', id), { downloads: increment(1) })
}

// getPDF n'est plus nécessaire avec Firebase — on utilise directement fileURL
// Cette fonction est conservée pour compatibilité avec le code existant
export async function getPDF(id: string): Promise<{ name: string; url: string } | null> {
  try {
    const snap = await getDoc(doc(db, 'publications', id))
    if (!snap.exists()) return null
    const data = snap.data()
    if (!data.fileURL) return null
    return { name: data.fileName ?? 'document.pdf', url: data.fileURL }
  } catch {
    return null
  }
}

// ─── RÉSULTATS ────────────────────────────────────────────────────────────────

export async function getResults(): Promise<AcademicResult[]> {
  const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AcademicResult))
}

export async function getResultsByClass(studentClass: string): Promise<AcademicResult[]> {
  const q = query(
    collection(db, 'results'),
    where('class', '==', studentClass),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AcademicResult))
}

export async function addResult(
  data: Omit<AcademicResult, 'id' | 'createdAt'>,
  file?: File,
): Promise<string> {
  let fileURL: string | undefined
  let fileRef: string | undefined
  let pdfName: string | undefined

  if (file) {
    const path = `results/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    fileURL = await getDownloadURL(storageRef)
    fileRef = path
    pdfName = file.name
  }

  const docRef = await addDoc(collection(db, 'results'), {
    ...data,
    fileURL: fileURL ?? null,
    fileRef: fileRef ?? null,
    pdfName: pdfName ?? null,
    createdAt: Date.now(),
  })
  return docRef.id
}

export async function deleteResult(id: string, fileRef?: string): Promise<void> {
  await deleteDoc(doc(db, 'results', id))
  if (fileRef) {
    try {
      await deleteObject(ref(storage, fileRef))
    } catch {
      // Fichier déjà supprimé
    }
  }
}

// getPDF pour les résultats (compatibilité)
export async function getResultPDF(id: string): Promise<{ name: string; url: string } | null> {
  try {
    const snap = await getDoc(doc(db, 'results', id))
    if (!snap.exists()) return null
    const data = snap.data()
    if (!data.fileURL) return null
    return { name: data.pdfName ?? 'resultats.pdf', url: data.fileURL }
  } catch {
    return null
  }
}

// ─── MESSAGES DE CONTACT ──────────────────────────────────────────────────────

export async function sendContactMessage(data: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    ...data,
    createdAt: Date.now(),
    read: false,
  })
}

export async function getMessages() {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ─── LEGACY — compatibilité avec l'ancien code ────────────────────────────────
// Ces fonctions permettent à login.tsx, student.tsx etc. de continuer
// à fonctionner sans modification majeure pendant la migration.

export function addUser(_data: {
  email: string
  name: string
  class: string
  role: 'student'
}): ScireUser {
  // Cette fonction est remplacée par registerStudent()
  // Elle est conservée pour éviter les erreurs TypeScript pendant la migration
  throw new Error('Utilisez registerStudent() à la place de addUser()')
}
