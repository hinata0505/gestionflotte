<template>
  <div class="min-h-screen bg-[#F3F7F9]">
    <aside class="fixed left-0 top-0 h-screen w-64 bg-[#173B4A] text-white">
      <div class="flex h-20 items-center px-6">
        <h1 class="text-xl font-bold">Gestion Flotte</h1>
      </div>

      <nav class="px-4 space-y-1">
        <NuxtLink to="/" class="block rounded-lg px-4 py-3 transition hover:bg-white/10" active-class="bg-[#4BAFC8] hover:bg-[#4BAFC8]">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/courses" class="block rounded-lg px-4 py-3 transition hover:bg-white/10" active-class="bg-[#4BAFC8] hover:bg-[#4BAFC8]">
          Courses
        </NuxtLink>
        <NuxtLink to="/livreurs" class="block rounded-lg px-4 py-3 transition hover:bg-white/10" active-class="bg-[#4BAFC8] hover:bg-[#4BAFC8]">
          Livreurs
        </NuxtLink>
        <NuxtLink to="/affectations" class="block rounded-lg px-4 py-3 transition hover:bg-white/10" active-class="bg-[#4BAFC8] hover:bg-[#4BAFC8]">
          Affectations
        </NuxtLink>
        <NuxtLink to="/suivi" class="block rounded-lg px-4 py-3 transition hover:bg-white/10" active-class="bg-[#4BAFC8] hover:bg-[#4BAFC8]">
          Suivi
        </NuxtLink>
        <NuxtLink to="/rapports" class="block rounded-lg px-4 py-3 transition hover:bg-white/10" active-class="bg-[#4BAFC8] hover:bg-[#4BAFC8]">
          Rapports
        </NuxtLink>
      </nav>
    </aside>

    <div class="ml-64">
      <header class="relative flex h-20 items-center justify-between border-b border-[#D5E0E6] bg-white px-8">
        <div class="text-lg font-semibold text-[#173B4A]">Tableau de bord</div>

        <div class="flex items-center gap-6">
          <div class="relative">
            <button
              class="flex items-center gap-2 rounded-lg border border-[#D5E0E6] px-4 py-2 text-sm font-medium transition hover:border-[#4BAFC8]"
              :class="periode.active.value ? 'text-[#4BAFC8] border-[#4BAFC8] bg-[#4BAFC8]/5' : 'text-[#6B7F88]'"
              @click="panelOuvert = !panelOuvert"
            >
              📅 {{ periode.label.value }}
            </button>

            <div
              v-if="panelOuvert"
              class="absolute right-0 top-12 z-20 w-72 rounded-xl border border-[#D5E0E6] bg-white p-4 shadow-lg"
            >
              <p class="mb-3 text-sm font-semibold text-[#173B4A]">Filtrer par période</p>
              <div class="space-y-3">
                <div>
                  <label class="mb-1 block text-xs font-medium text-[#6B7F88]">Du</label>
                  <input v-model="periode.debut.value" type="date"
                    class="w-full rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm outline-none focus:border-[#4BAFC8]" />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-[#6B7F88]">Au</label>
                  <input v-model="periode.fin.value" type="date"
                    class="w-full rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm outline-none focus:border-[#4BAFC8]" />
                </div>
              </div>
              <div class="mt-4 flex gap-2">
                <button class="flex-1 rounded-lg bg-[#4BAFC8] px-3 py-2 text-sm font-medium text-white" @click="panelOuvert = false">
                  Appliquer
                </button>
                <button class="rounded-lg border border-[#D5E0E6] px-3 py-2 text-sm font-medium text-[#173B4A]" @click="periode.reset(); panelOuvert = false">
                  Effacer
                </button>
              </div>
            </div>
          </div>

          <div class="font-medium text-[#173B4A]">Personnel</div>
        </div>
      </header>

      <main class="p-8">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const periode = usePeriode()
const panelOuvert = ref(false)
</script>