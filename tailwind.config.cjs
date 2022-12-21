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
		'fill-bi-blue',
		'bg-[#16659D]',
		'bg-[#FDDB46]',
		'bg-[#B3B3B3]',
		'bg-[#F55D5B]',
		'peer-checked:bg-[#16659D]'
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
			display: ['Roboto', 'sans-serif']
		},
		extend: {
			colors: require('./src/lib/colors.json')
		}
	}
};
