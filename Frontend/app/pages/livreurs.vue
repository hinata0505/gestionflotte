<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[#173B4A]">Rapports</h1>
      <p class="mt-1 text-[#6B7F88]">Chiffre d'affaires et statistiques des courses</p>
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

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">Courses livrées {{ periodeActive ? '(période)' : '' }}</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ coursesLivrees.length }}</p>
      </div>
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">Chiffre d'affaires {{ periodeActive ? '(période)' : '' }}</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ formatMontant(ca) }}</p>
        <p class="mt-1 text-sm text-[#6B7F88]">FCFA</p>
      </div>
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <p class="text-sm text-[#6B7F88]">Courses annulées</p>
        <p class="mt-2 text-3xl font-bold text-[#173B4A]">{{ coursesAnnulees.length }}</p>
      </div>
    </div>

    <div class="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-[#173B4A]">Courses livrées</h2>
      </div>

      <p v-if="coursesLivrees.length === 0" class="rounded-lg bg-[#F3F7F9] px-4 py-8 text-center text-[#6B7F88]">
        Aucune course livrée dans cette période.
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
            <tr v-for="course in coursesLivrees" :key="course.id_course" class="border-b border-[#D5E0E6] last:border-0">
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
  </div>
</template>

<script setup lang="ts">
const { courses, livreurDe, coursesLivreesPeriode, chiffreAffaires } = useFlotte()

const periodeDebut = ref('')
const periodeFin = ref('')

const periodeActive = computed(() => !!periodeDebut.value && !!periodeFin.value)
const reinitialiser = () => { periodeDebut.value = ''; periodeFin.value = '' }

const coursesLivrees = computed(() =>
  coursesLivreesPeriode(periodeDebut.value || undefined, periodeFin.value || undefined),
)
const coursesAnnulees = computed(() => courses.value.filter(c => c.statut === 'Annulée'))
const ca = computed(() => chiffreAffaires(periodeDebut.value || undefined, periodeFin.value || undefined))

const formatMontant = (montant: number) => new Intl.NumberFormat('fr-FR').format(montant)
</script>