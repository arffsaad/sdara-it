export default defineAppConfig({
    ui: {
        primary: 'blue',
        strategy: 'override',
        button: {
            color: {
                gray: {
                    ghost: 'uppercase text-black hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400'
                }
            }
        },
    }
})