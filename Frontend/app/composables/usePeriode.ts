export const usePeriode = () => {
  const debut = useState<string>('periode-debut', () => '')
  const fin = useState<string>('periode-fin', () => '')
  const active = computed(() => !!debut.value && !!fin.value)
  const reset = () => { debut.value = ''; fin.value = '' }
  const label = computed(() =>
    active.value ? `${debut.value} → ${fin.value}` : 'Toutes les dates',
  )
  return { debut, fin, active, reset, label }
}