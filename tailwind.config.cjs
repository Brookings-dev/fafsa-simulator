module.exports = {
	prefix: 'bi-',
	important: true,
	content: ['./src/**/*.{html,js,svelte,ts}', './src/lib/data/copy.json', './index.html'],
	plugins: [require('@tailwindcss/typography')],
	safelist: [
		'bi-bg-bi-red',
		'bi-bg-bi-yellow',
		'bi-bg-bi-gray',
		'bi-bg-bi-blue',
		'bi-border-bi-gray-light',
		'bi-bg-bi-gray-light',
		'bi-bg-bi-gray-xLight',
		'bi-fill-bi-blue',
		'peer-checked:bi-bg-bi-gray-dark',
		'peer-checked:bi-bg-[#16659D]',
		'peer-checked:bi-bg-[#FDDB46]',
		'peer-checked:bi-bg-[#B3B3B3]',
		'peer-checked:bi-bg-[#F55D5B]',
		'peer-checked:bi-bg-[#00649f]',
		'peer-checked:bi-bg-[#8BC6FD]',
		'peer-checked:bi-bg-[#2FA5B2]',
		'peer-checked:bi-bg-[#FEDB31]',
		'peer-checked:bi-bg-[#C7A70A]',
		'peer-checked:bi-bg-[#F25D00]',
		'peer-checked:bi-bg-[#F25D00]',
		'first:bi-bg-bi-gray-dark',
		'bi-bg-[#16659D]',
		'bi-bg-[#FDDB46]',
		'bi-bg-[#B3B3B3]',
		'bi-bg-[#F55D5B]',
		'bi-bg-[#00649f]',
		'bi-bg-[#8BC6FD]',
		'bi-bg-[#2FA5B2]',
		'bi-bg-[#FEDB31]',
		'bi-bg-[#C7A70A]',
		'bi-bg-[#F25D00]',
		'bi-bg-{#0D659D]',
		'bi-bg-[#5EAEF3]',
		'peer-checked:bi-ring-bi-gray-border'
	  ],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		fontSize: {
			xxs: ['0.6rem'],
			xs: ['0.75rem'],
			sm: ['0.875rem'],
			base: ['1rem'],
			lg: ['1.125rem'],
			xl: ['1.3125rem'],
			'2xl': ['1.12/5rem'],
			'3xl': ['2rem'],
			'4xl': ['2.25rem'],
			'5xl': ['3rem'],
			'6xl': ['4rem'],
			'7xl': ['4.5rem'],
			'8xl': ['6rem'],
			'9xl': ['8rem']
		},
		fontFamily: {
			sans: ['Roboto', 'sans-serif']
		},
		extend: {
			colors: require('./src/lib/colors.json')
		}
	}
};
