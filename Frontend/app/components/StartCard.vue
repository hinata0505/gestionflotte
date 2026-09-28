<template>
  <div class="group rounded-xl border border-[#D5E0E6] bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
    <div class="mb-3 flex items-center justify-between">
      <p class="text-sm text-[#6B7F88]">{{ title }}</p>
      <span v-if="icon" class="flex h-10 w-10 items-center justify-center rounded-lg text-lg" :class="colorClasses[color || 'blue']">
        {{ icon }}
      </span>
    </div>
    <p class="text-3xl font-bold text-[#173B4A]">{{ value }}</p>
    <p v-if="unit" class="mt-1 text-sm text-[#6B7F88]">{{ unit }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  unit?: string
  icon?: string
  color?: 'blue' | 'green' | 'orange' | 'purple'
}>()

const colorClasses: Record<string, string> = {
  blue: 'bg-[#4BAFC8]/10 text-[#4BAFC8]',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
}
</script>