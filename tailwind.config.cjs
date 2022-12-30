module.exports = {
	// prefix: 'cmsvelte-',
	important: true,
	content: ['./src/**/*.{html,js,svelte,ts}', './src/lib/data/copy.json', './index.html'],
	plugins: [require('@tailwindcss/typography')],
	safelist: [
		'bg-bi-red',
		'bg-bi-yellow',
		'bg-bi-gray',
		'bg-bi-blue',
		'border-bi-gray-light',
		'bg-bi-gray-light',
		'bg-bi-gray-xLight',
		'fill-bi-blue',
		'peer-checked:bg-bi-gray-dark',
		'peer-checked:bg-[#16659D]',
		'peer-checked:bg-[#FDDB46]',
		'peer-checked:bg-[#B3B3B3]',
		'peer-checked:bg-[#F55D5B]',
		'peer-checked:bg-[#00649f]',
		'peer-checked:bg-[#8BC6FD]',
		'peer-checked:bg-[#2FA5B2]',
		'peer-checked:bg-[#FEDB31]',
		'peer-checked:bg-[#C7A70A]',
		'peer-checked:bg-[#F25D00]',
		'first:bg-bi-gray-dark',
		'bg-[#16659D]',
		'bg-[#FDDB46]',
		'bg-[#B3B3B3]',
		'bg-[#F55D5B]',
		'bg-[#00649f]',
		'bg-[#8BC6FD]',
		'bg-[#2FA5B2]',
		'bg-[#FEDB31]',
		'bg-[#C7A70A]',
		'bg-[#F25D00]',
		'bg-{#0D659D]',
		'bg-[#5EAEF3]',
		'peer-checked:ring-bi-gray-border'
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
