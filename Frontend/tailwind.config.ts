import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: [],
    theme: {
    extend: {
        colors: {
        primary: '#77C2D4',
        'primary-dark': '#4BAFC8',
        background: '#F3F7F9',
        'text-main': '#173B4A',
        'text-secondary': '#6B7F88',
        accent: '#FFD83D',
        border: '#D5E0E6',
        },
    },
    },
}