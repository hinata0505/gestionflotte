import { ref } from 'vue'

export type StatutCourse = 'En attente' | 'Prise en charge' | 'Livrée' | 'Annulée'

export type Course = {
  id_course: string
  adresse_depart: string
  adresse_arrivee: string
  montant: number
  statut: StatutCourse
  idlivreur: string
  date_creation: string
  date_prise_en_charge: string
  date_livraison: string
  date_annulation: string
}

export type Livreur = {
  idlivreur: string
  nom: string
  prenom: string
  telephone: string
}

const courses = ref<Course[]>([
  { id_course: 'ED001', adresse_depart: 'Lomé', adresse_arrivee: 'Agoè', montant: 15000, statut: 'Livrée', idlivreur: 'LIV001', date_creation: '2026-09-25', date_prise_en_charge: '2026-09-25', date_livraison: '2026-09-25', date_annulation: '' },
  { id_course: 'ED002', adresse_depart: 'Lomé', adresse_arrivee: 'Bè', montant: 10000, statut: 'En attente', idlivreur: '', date_creation: '2026-09-26', date_prise_en_charge: '', date_livraison: '', date_annulation: '' },
  { id_course: 'ED003', adresse_depart: 'Lomé', adresse_arrivee: 'Adidogomé', montant: 20000, statut: 'Prise en charge', idlivreur: 'LIV002', date_creation: '2026-09-27', date_prise_en_charge: '2026-09-27', date_livraison: '', date_annulation: '' },
  { id_course: 'ED004', adresse_depart: 'Lomé', adresse_arrivee: 'Tokoin', montant: 12000, statut: 'En attente', idlivreur: '', date_creation: '2026-09-27', date_prise_en_charge: '', date_livraison: '', date_annulation: '' },
])

const livreurs = ref<Livreur[]>([
  { idlivreur: 'LIV001', nom: 'Koffi', prenom: 'Jean', telephone: '90000001' },
  { idlivreur: 'LIV002', nom: 'Ama', prenom: 'Marie', telephone: '90000002' },
  { idlivreur: 'LIV003', nom: 'Mensah', prenom: 'Paul', telephone: '90000003' },
])

const nowDate = () => new Date().toISOString().slice(0, 10)
const prochainId = (prefix: string, liste: { length: number }) =>
  `${prefix}${String(liste.length + 1).padStart(3, '0')}`

// --- Lecture dérivée ---

const livreurDe = (idCourse: string) => {
  const course = courses.value.find(c => c.id_course === idCourse)
  if (!course?.idlivreur) return undefined
  return livreurs.value.find(l => l.idlivreur === course.idlivreur)
}

// RG2 : dérivé des courses, rien n'est stocké sur le livreur.
const estLivreurEnCourse = (idLivreur: string) =>
  courses.value.some(
    c => c.idlivreur === idLivreur && (c.statut === 'En attente' || c.statut === 'Prise en charge'),
  )

const statutLivreur = (idLivreur: string) => (estLivreurEnCourse(idLivreur) ? 'En course' : 'Disponible')

// --- Actions : RG1 à RG5 + III appliquées ici, un seul endroit ---

const creerCourse = (payload: { adresse_depart: string; adresse_arrivee: string; montant: number; idlivreur?: string }) => {
  courses.value.push({
    id_course: prochainId('ED', courses.value),
    adresse_depart: payload.adresse_depart,
    adresse_arrivee: payload.adresse_arrivee,
    montant: payload.montant,
    statut: 'En attente',
    idlivreur: payload.idlivreur ?? '', // III : "affectée ou non dès sa création"
    date_creation: nowDate(),
    date_prise_en_charge: '',
    date_livraison: '',
    date_annulation: '',
  })
}

// III "Réaffecter une course en attente" : uniquement autorisé tant que le
// statut est "En attente". Affecter NE change PAS le statut — c'est une
// action distincte ("Prendre en charge") qui le fait.
const affecterCourse = (idCourse: string, idLivreur: string) => {
  const course = courses.value.find(c => c.id_course === idCourse)
  if (!course) return { ok: false, raison: 'Course introuvable.' }
  if (course.statut !== 'En attente') {
    return { ok: false, raison: 'Cette course a déjà été prise en charge, elle ne peut plus être réaffectée.' }
  }
  course.idlivreur = idLivreur
  return { ok: true }
}

// Action distincte : le livreur assigné démarre la course.
const prendreEnCharge = (idCourse: string) => {
  const course = courses.value.find(c => c.id_course === idCourse)
  if (!course || course.statut !== 'En attente' || !course.idlivreur) return false
  course.statut = 'Prise en charge'
  course.date_prise_en_charge = nowDate()
  return true
}

const validerCourse = (idCourse: string) => {
  const course = courses.value.find(c => c.id_course === idCourse)
  if (!course || course.statut !== 'Prise en charge') return false // RG1
  course.statut = 'Livrée'
  course.date_livraison = nowDate()
  return true
}

const annulerCourse = (idCourse: string) => {
  const course = courses.value.find(c => c.id_course === idCourse)
  if (!course || (course.statut !== 'En attente' && course.statut !== 'Prise en charge')) return false
  course.statut = 'Annulée' // RG4 : reste consultable, exclue du CA
  course.date_annulation = nowDate()
  return true
}

const modifierMontant = (idCourse: string, montant: number) => {
  const course = courses.value.find(c => c.id_course === idCourse)
  if (!course || course.statut === 'Livrée') return false // RG3
  course.montant = montant
  return true
}

const peutRetirerLivreur = (idLivreur: string) => !estLivreurEnCourse(idLivreur) // RG2

const retirerLivreur = (idLivreur: string) => {
  if (!peutRetirerLivreur(idLivreur)) return false
  livreurs.value = livreurs.value.filter(l => l.idlivreur !== idLivreur)
  return true
}

const ajouterLivreur = (payload: { nom: string; prenom: string; telephone: string }) => {
  livreurs.value.push({ idlivreur: prochainId('LIV', livreurs.value), ...payload })
}

// III "modifier un livreur" (Essentielle).
const modifierLivreur = (idLivreur: string, payload: { nom: string; prenom: string; telephone: string }) => {
  const livreur = livreurs.value.find(l => l.idlivreur === idLivreur)
  if (!livreur) return false
  livreur.nom = payload.nom
  livreur.prenom = payload.prenom
  livreur.telephone = payload.telephone
  return true
}

// RG4 + RG5 : uniquement les courses livrées, sur la période donnée.
const coursesLivreesPeriode = (periodeDebut?: string, periodeFin?: string) =>
  courses.value
    .filter(c => c.statut === 'Livrée')
    .filter(c => !periodeDebut || !periodeFin || (c.date_livraison >= periodeDebut && c.date_livraison <= periodeFin))

const chiffreAffaires = (periodeDebut?: string, periodeFin?: string) =>
  coursesLivreesPeriode(periodeDebut, periodeFin).reduce((total, c) => total + c.montant, 0)

export const useFlotte = () => ({
  courses,
  livreurs,
  livreurDe,
  estLivreurEnCourse,
  statutLivreur,
  creerCourse,
  affecterCourse,
  prendreEnCharge,
  validerCourse,
  annulerCourse,
  modifierMontant,
  peutRetirerLivreur,
  retirerLivreur,
  ajouterLivreur,
  modifierLivreur,
  coursesLivreesPeriode,
  chiffreAffaires,
})