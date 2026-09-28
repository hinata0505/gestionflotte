<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[#173B4A]">Affectations</h1>
      <p class="mt-1 text-[#6B7F88]">Affecter ou réaffecter les courses en attente</p>
    </div>

    <div class="rounded-xl bg-white p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-[#173B4A]">Courses</h2>
        <p class="mt-1 text-sm text-[#6B7F88]">Réaffectation possible uniquement tant que la course est "En attente".</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-[#D5E0E6]">
              <th class="px-4 py-3 text-sm font-medium text-[#6B7F88]">Course</th>
              <th class="px-4 py-3 text-sm font-medium text-[#6B7F88]">Trajet</th>
              <th class="px-4 py-3 text-sm font-medium text-[#6B7F88]">Montant</th>
              <th class="px-4 py-3 text-sm font-medium text-[#6B7F88]">Statut</th>
              <th class="px-4 py-3 text-sm font-medium text-[#6B7F88]">Livreur</th>
              <th class="px-4 py-3 text-sm font-medium text-[#6B7F88]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id_course" class="border-b border-[#D5E0E6] last:border-0">
              <td class="px-4 py-5">
                <div class="font-semibold text-[#173B4A]">{{ course.id_course }}</div>
                <div class="mt-1 text-xs text-[#6B7F88]">Créée le {{ course.date_creation }}</div>
              </td>
              <td class="px-4 py-5">
                <div class="text-sm font-medium text-[#173B4A]">{{ course.adresse_depart }}</div>
                <div class="my-1 text-xs text-[#6B7F88]">↓</div>
                <div class="text-sm font-medium text-[#173B4A]">{{ course.adresse_arrivee }}</div>
              </td>
              <td class="px-4 py-5">
                <span class="font-semibold text-[#173B4A]">{{ formatMontant(course.montant) }}</span>
                <span class="ml-1 text-xs text-[#6B7F88]">FCFA</span>
              </td>
              <td class="px-4 py-5">
                <span class="rounded-full px-3 py-1 text-xs font-medium" :class="statutClass(course.statut)">
                  {{ course.statut }}
                </span>
              </td>
              <td class="px-4 py-5">
                <div v-if="livreurDe(course.id_course)" class="font-medium text-[#173B4A]">
                  {{ livreurDe(course.id_course)?.nom }} {{ livreurDe(course.id_course)?.prenom }}
                </div>
                <div v-else class="text-sm text-[#6B7F88]">Non affectée</div>
              </td>
              <td class="px-4 py-5">
                <select
                  :disabled="course.statut !== 'En attente'"
                  class="w-full min-w-[180px] rounded-lg border border-[#D5E0E6] bg-white px-3 py-2 text-sm text-[#173B4A] outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  :value="course.idlivreur"
                  @change="changerLivreur(course.id_course, $event)"
                >
                  <option value="">Affecter un livreur</option>
                  <option v-for="livreur in livreurs" :key="livreur.idlivreur" :value="livreur.idlivreur">
                    {{ livreur.nom }} {{ livreur.prenom }}
                  </option>
                </select>
                <p v-if="course.statut !== 'En attente'" class="mt-2 text-xs text-[#6B7F88]">
                  {{ course.statut === 'Prise en charge' ? 'Déjà prise en charge' : 'Course verrouillée' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { courses, livreurs, livreurDe, estLivreurEnCourse, affecterCourse } = useFlotte()

const changerLivreur = (idCourse: string, event: Event) => {
  const idLivreur = (event.target as HTMLSelectElement).value
  if (!idLivreur) return

  const livreur = livreurs.value.find(l => l.idlivreur === idLivreur)
  if (!livreur) return

  if (estLivreurEnCourse(idLivreur)) {
    const confirmer = window.confirm(`${livreur.nom} ${livreur.prenom} est déjà en course. Confirmer l'affectation ?`)
    if (!confirmer) return
  }

  const resultat = affecterCourse(idCourse, idLivreur)
  if (!resultat.ok) window.alert(resultat.raison)
}

const formatMontant = (montant: number) => new Intl.NumberFormat('fr-FR').format(montant)

const statutClass = (statut: string) => {
  if (statut === 'Livrée') return 'bg-[#77C2D4] text-white'
  if (statut === 'Prise en charge') return 'bg-[#4BAFC8] text-white'
  if (statut === 'Annulée') return 'bg-[#D5E0E6] text-[#173B4A]'
  return 'bg-[#F3F7F9] text-[#173B4A]'
}
</script>