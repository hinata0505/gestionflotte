<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#173B4A]">Courses</h1>
        <p class="mt-1 text-[#6B7F88]">Gestion des courses de livraison</p>
      </div>
      <button class="rounded-lg bg-[#4BAFC8] px-5 py-3 font-medium text-white" @click="ouvrirFormulaire">
        + Nouvelle course
      </button>
    </div>

    <div v-if="message" class="mb-6 rounded-lg border border-[#D5E0E6] bg-white px-5 py-4 text-[#173B4A]">
      {{ message }}
    </div>

    <div v-if="formulaireOuvert" class="mb-8 rounded-xl bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-[#173B4A]">Nouvelle course</h2>
        <p class="mt-1 text-sm text-[#6B7F88]">Renseignez les informations de la course.</p>
      </div>

      <form class="grid grid-cols-1 gap-6 md:grid-cols-2" @submit.prevent="soumettreCourse">
        <div>
          <label class="mb-2 block text-sm font-medium text-[#173B4A]">Adresse de départ</label>
          <input v-model="nouvelleCourse.adresse_depart" type="text" placeholder="Ex : Lomé"
            class="w-full rounded-lg border border-[#D5E0E6] px-4 py-3 outline-none focus:border-[#4BAFC8]" required />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-[#173B4A]">Adresse d'arrivée</label>
          <input v-model="nouvelleCourse.adresse_arrivee" type="text" placeholder="Ex : Agoè"
            class="w-full rounded-lg border border-[#D5E0E6] px-4 py-3 outline-none focus:border-[#4BAFC8]" required />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-[#173B4A]">Montant</label>
          <input v-model.number="nouvelleCourse.montant" type="number" min="0" placeholder="Ex : 15000"
            class="w-full rounded-lg border border-[#D5E0E6] px-4 py-3 outline-none focus:border-[#4BAFC8]" required />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-[#173B4A]">Livreur (optionnel)</label>
          <select v-model="nouvelleCourse.idlivreur"
            class="w-full rounded-lg border border-[#D5E0E6] bg-white px-4 py-3 outline-none focus:border-[#4BAFC8]">
            <option value="">Aucun pour l'instant</option>
            <option v-for="l in livreurs" :key="l.idlivreur" :value="l.idlivreur">{{ l.nom }} {{ l.prenom }}</option>
          </select>
        </div>
        <div class="flex gap-3 md:col-span-2">
          <button type="submit" class="rounded-lg bg-[#4BAFC8] px-5 py-3 font-medium text-white">Créer la course</button>
          <button type="button" class="rounded-lg border border-[#D5E0E6] px-5 py-3 font-medium text-[#173B4A]" @click="fermerFormulaire">
            Annuler
          </button>
        </div>
      </form>
    </div>

    <div class="overflow-hidden rounded-xl bg-white shadow-sm">
      <div class="grid grid-cols-9 gap-4 border-b border-[#D5E0E6] px-6 py-4 text-sm font-semibold text-[#6B7F88]">
        <div>ID</div><div>Départ</div><div>Arrivée</div><div>Montant</div><div>Statut</div>
        <div>Créée le</div><div>Prise en charge</div><div>Livreur</div><div>Actions</div>
      </div>

      <div v-for="course in courses" :key="course.id_course"
        class="grid grid-cols-9 items-center gap-4 border-b border-[#D5E0E6] px-6 py-5 last:border-b-0">
        <div class="font-medium text-[#173B4A]">{{ course.id_course }}</div>
        <div class="text-[#6B7F88]">{{ course.adresse_depart }}</div>
        <div class="text-[#6B7F88]">{{ course.adresse_arrivee }}</div>
        <div class="font-medium text-[#173B4A]">{{ course.montant }} FCFA</div>
        <div><span class="rounded-full px-3 py-1 text-sm" :class="getStatutClass(course.statut)">{{ course.statut }}</span></div>
        <div class="text-sm text-[#6B7F88]">{{ course.date_creation }}</div>
        <div class="text-sm text-[#6B7F88]">{{ course.date_prise_en_charge || '—' }}</div>
        <div class="text-sm text-[#6B7F88]">{{ getLivreurLabel(course.id_course) }}</div>
        <div class="flex flex-wrap gap-2">
          <button v-if="course.statut === 'En attente' && course.idlivreur"
            class="rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm font-medium text-[#173B4A] hover:bg-[#F3F7F9]"
            @click="onPrendreEnCharge(course.id_course)">
            Prendre en charge
          </button>
          <button v-if="course.statut === 'Prise en charge'"
            class="rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm font-medium text-[#173B4A] hover:bg-[#F3F7F9]"
            @click="onValider(course.id_course)">
            Valider livraison
          </button>
          <button v-if="course.statut !== 'Livrée'"
            class="rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm font-medium text-[#173B4A] hover:bg-[#F3F7F9]"
            @click="onModifierMontant(course.id_course, course.montant)">
            Modifier montant
          </button>
          <button v-if="course.statut === 'En attente' || course.statut === 'Prise en charge'"
            class="rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm font-medium text-[#173B4A] hover:bg-[#F3F7F9]"
            @click="onAnnuler(course.id_course)">
            Annuler
          </button>
          <span v-if="course.statut === 'Livrée'" class="text-sm text-[#6B7F88]">Terminée</span>
          <span v-if="course.statut === 'Annulée'" class="text-sm text-[#6B7F88]">Annulée</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { courses, livreurs, livreurDe, creerCourse, prendreEnCharge, validerCourse, annulerCourse, modifierMontant } = useFlotte()

const formulaireOuvert = ref(false)
const message = ref('')
const nouvelleCourse = ref({ adresse_depart: '', adresse_arrivee: '', montant: 0, idlivreur: '' })

const afficherMessage = (texte: string) => {
  message.value = texte
  setTimeout(() => { message.value = '' }, 3000)
}

const ouvrirFormulaire = () => {
  nouvelleCourse.value = { adresse_depart: '', adresse_arrivee: '', montant: 0, idlivreur: '' }
  formulaireOuvert.value = true
}
const fermerFormulaire = () => { formulaireOuvert.value = false }

const soumettreCourse = () => {
  creerCourse(nouvelleCourse.value)
  afficherMessage('Course créée avec succès.')
  fermerFormulaire()
}

const getLivreurLabel = (idCourse: string) => {
  const l = livreurDe(idCourse)
  return l ? `${l.nom} ${l.prenom}` : '—'
}

const onPrendreEnCharge = (idCourse: string) => {
  afficherMessage(prendreEnCharge(idCourse) ? `Course ${idCourse} prise en charge.` : "Impossible : aucun livreur affecté.")
}

const onValider = (idCourse: string) => {
  if (!window.confirm(`Valider la livraison de ${idCourse} ?`)) return
  afficherMessage(validerCourse(idCourse) ? `Course ${idCourse} livrée.` : 'Cette course ne peut pas être livrée dans son état actuel.')
}

const onAnnuler = (idCourse: string) => {
  if (!window.confirm(`Annuler la course ${idCourse} ?`)) return
  afficherMessage(annulerCourse(idCourse) ? `Course ${idCourse} annulée. Elle reste consultable.` : 'Cette course ne peut plus être annulée.')
}

const onModifierMontant = (idCourse: string, montantActuel: number) => {
  const saisie = window.prompt('Nouveau montant (FCFA) :', String(montantActuel))
  if (saisie === null) return
  const montant = Number(saisie)
  if (Number.isNaN(montant) || montant < 0) {
    afficherMessage('Montant invalide.')
    return
  }
  afficherMessage(modifierMontant(idCourse, montant) ? 'Montant mis à jour.' : 'Impossible : cette course est déjà livrée.')
}

const getStatutClass = (statut: string) => {
  if (statut === 'Livrée') return 'bg-[#D5E0E6] text-[#173B4A]'
  if (statut === 'Prise en charge') return 'bg-[#77C2D4] text-white'
  return 'bg-[#F3F7F9] text-[#6B7F88]'
}
</script>