<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-[#173B4A]">Tableau de bord</h1>
      <p class="mt-1 text-[#6B7F88]">
        {{ periode.active.value ? `Vue de la période ${periode.debut.value} → ${periode.fin.value}` : "Vue d'ensemble de votre flotte de livraison" }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Courses" :value="totalCourses" icon="🚚" color="blue" />
      <StatCard title="Courses livrées" :value="totalLivrees" icon="✅" color="green" />
      <StatCard title="En attente" :value="totalEnAttente" icon="⏳" color="orange" />
      <StatCard title="Chiffre d'affaires" :value="ca" unit="FCFA" icon="₣" color="purple" />
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div class="rounded-xl border border-[#D5E0E6] bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-[#173B4A]">Évolution des courses</h2>
        <div class="mt-6 flex h-64 items-center justify-center rounded-lg bg-[#F3F7F9]">
          <p class="text-[#6B7F88]">Graphique à venir</p>
        </div>
      </div>

      <div class="rounded-xl border border-[#D5E0E6] bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-[#173B4A]">
            {{ periode.active.value ? 'Courses de la période' : 'Courses récentes' }}
          </h2>
          <NuxtLink to="/courses" class="text-sm font-medium text-[#4BAFC8]">Voir tout</NuxtLink>
        </div>

        <p v-if="coursesAffichees.length === 0" class="mt-6 rounded-lg bg-[#F3F7F9] px-4 py-8 text-center text-[#6B7F88]">
          Aucune course sur cette période.
        </p>

        <div v-else class="mt-6 space-y-4">
          <div
            v-for="course in coursesAffichees"
            :key="course.id_course"
            class="flex items-center justify-between border-b border-[#D5E0E6] pb-4 last:border-b-0"
          >
            <div>
              <p class="font-medium text-[#173B4A]">Course {{ course.id_course }}</p>
              <p class="text-sm text-[#6B7F88]">{{ course.adresse_depart }} → {{ course.adresse_arrivee }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-medium" :class="statutClass(course.statut)">
              {{ course.statut }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { courses, chiffreAffaires } = useFlotte()
const periode = usePeriode()

// Sans période : basé sur la date de création. Livrées : toujours sur date_livraison (RG5).
const dansPeriode = (dateCreation: string) => {
  if (!periode.active.value) return true
  return dateCreation >= periode.debut.value && dateCreation <= periode.fin.value
}

const coursesAffichees = computed(() => courses.value.filter(c => dansPeriode(c.date_creation)))

const totalCourses = computed(() => coursesAffichees.value.length)
const totalEnAttente = computed(() => coursesAffichees.value.filter(c => c.statut === 'En attente').length)

const totalLivrees = computed(() =>
  periode.active.value
    ? courses.value.filter(c => c.statut === 'Livrée' && c.date_livraison >= periode.debut.value && c.date_livraison <= periode.fin.value).length
    : courses.value.filter(c => c.statut === 'Livrée').length,
)

const ca = computed(() => chiffreAffaires(periode.debut.value || undefined, periode.fin.value || undefined))

const statutClass = (statut: string) => {
  if (statut === 'Livrée') return 'bg-green-100 text-green-700'
  if (statut === 'Prise en charge') return 'bg-[#4BAFC8]/15 text-[#4BAFC8]'
  if (statut === 'Annulée') return 'bg-[#D5E0E6] text-[#173B4A]'
  return 'bg-orange-100 text-orange-700'
}
</script>