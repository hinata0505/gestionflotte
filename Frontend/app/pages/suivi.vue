<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[#173B4A]">Suivi des courses</h1>
      <p class="mt-1 text-[#6B7F88]">État des courses et chiffre d'affaires sur une période</p>
    </div>

    <div class="mb-6 flex flex-wrap items-end gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label class="mb-2 block text-sm font-medium text-[#173B4A]">Du</label>
        <input v-model="periodeDebut" type="date" class="rounded-lg border border-[#D5E0E6] px-4 py-2 outline-none focus:border-[#4BAFC8]" />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-[#173B4A]">Au</label>
        <input v-model="periodeFin" type="date" class="rounded-lg border border-[#D5E0E6] px-4 py-2 outline-none focus:border-[#4BAFC8]" />
      </div>
      <button class="rounded-lg border border-[#D5E0E6] px-4 py-2 text-sm font-medium text-[#173B4A] hover:bg-[#F3F7F9]" @click="reinitialiser">
        Toutes les périodes
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">En attente</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ totalEnAttente }}</p>
      </div>
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">Prise en charge</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ totalEnCours }}</p>
      </div>
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">Livrées {{ periodeActive ? '(période)' : '' }}</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ coursesPeriode.length }}</p>
      </div>
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">CA {{ periodeActive ? '(période)' : '' }}</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ formatMontant(ca) }} FCFA</p>
      </div>
    </div>

    <!-- Résultat de la période : uniquement les courses livrées dans l'intervalle -->
    <div v-if="periodeActive" class="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <h2 class="mb-1 text-lg font-semibold text-[#173B4A]">Courses livrées entre le {{ periodeDebut }} et le {{ periodeFin }}</h2>
      <p class="mb-6 text-sm text-[#6B7F88]">Historique des courses effectuées sur cette période.</p>

      <p v-if="coursesPeriode.length === 0" class="rounded-lg bg-[#F3F7F9] px-4 py-8 text-center text-[#6B7F88]">
        Aucune course effectuée dans cette période.
      </p>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-[#D5E0E6]">
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Course</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Trajet</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Montant</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Date livraison</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Livreur</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in coursesPeriode" :key="course.id_course" class="border-b border-[#D5E0E6] last:border-0">
              <td class="px-4 py-4 font-semibold text-[#173B4A]">{{ course.id_course }}</td>
              <td class="px-4 py-4 text-sm text-[#6B7F88]">{{ course.adresse_depart }} → {{ course.adresse_arrivee }}</td>
              <td class="px-4 py-4 font-medium text-[#173B4A]">{{ formatMontant(course.montant) }} FCFA</td>
              <td class="px-4 py-4 text-sm text-[#6B7F88]">{{ course.date_livraison }}</td>
              <td class="px-4 py-4">
                <span v-if="livreurDe(course.id_course)" class="font-medium text-[#173B4A]">
                  {{ livreurDe(course.id_course)?.nom }} {{ livreurDe(course.id_course)?.prenom }}
                </span>
                <span v-else class="text-sm text-[#6B7F88]">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vue générale : toutes les courses, tous statuts confondus -->
    <div v-else class="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <h2 class="mb-6 text-lg font-semibold text-[#173B4A]">État des courses</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-[#D5E0E6]">
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Course</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Départ</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Arrivée</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Livreur</th>
              <th class="px-4 py-3 text-sm text-[#6B7F88]">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id_course" class="border-b border-[#D5E0E6] last:border-0">
              <td class="px-4 py-4 font-semibold text-[#173B4A]">{{ course.id_course }}</td>
              <td class="px-4 py-4 text-sm text-[#6B7F88]">{{ course.adresse_depart }}</td>
              <td class="px-4 py-4 text-sm text-[#6B7F88]">{{ course.adresse_arrivee }}</td>
              <td class="px-4 py-4">
                <span v-if="livreurDe(course.id_course)" class="font-medium text-[#173B4A]">
                  {{ livreurDe(course.id_course)?.nom }} {{ livreurDe(course.id_course)?.prenom }}
                </span>
                <span v-else class="text-sm text-[#6B7F88]">Non affectée</span>
              </td>
              <td class="px-4 py-4">
                <span class="rounded-full px-3 py-1 text-xs font-medium" :class="statutClass(course.statut)">
                  {{ course.statut }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { courses, livreurDe, coursesLivreesPeriode, chiffreAffaires } = useFlotte()

const periodeDebut = ref('')
const periodeFin = ref('')

const periodeActive = computed(() => !!periodeDebut.value && !!periodeFin.value)

const reinitialiser = () => { periodeDebut.value = ''; periodeFin.value = '' }

// Sans période : toutes les courses en_attente / prise_en_charge, peu importe leur date.
// Avec période : uniquement celles créées dans l'intervalle choisi.
const dansLaPeriode = (dateCreation: string) => {
  if (!periodeActive.value) return true
  return dateCreation >= periodeDebut.value && dateCreation <= periodeFin.value
}

const totalEnAttente = computed(() =>
  courses.value.filter(c => c.statut === 'En attente' && dansLaPeriode(c.date_creation)).length,
)
const totalEnCours = computed(() =>
  courses.value.filter(c => c.statut === 'Prise en charge' && dansLaPeriode(c.date_creation)).length,
)

// Livrées : filtrées sur la date de livraison (RG5), pas la date de création.
const coursesPeriode = computed(() =>
  coursesLivreesPeriode(periodeDebut.value || undefined, periodeFin.value || undefined),
)

const ca = computed(() => chiffreAffaires(periodeDebut.value || undefined, periodeFin.value || undefined))

const formatMontant = (montant: number) => new Intl.NumberFormat('fr-FR').format(montant)

const statutClass = (statut: string) => {
  if (statut === 'Livrée') return 'bg-[#77C2D4] text-white'
  if (statut === 'Prise en charge') return 'bg-[#4BAFC8] text-white'
  if (statut === 'Annulée') return 'bg-[#D5E0E6] text-[#173B4A]'
  return 'bg-[#F3F7F9] text-[#173B4A]'
}
</script>