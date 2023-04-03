const colors = require('./src/lib/colors.json');

module.exports = {
	prefix: 'bi-',
	important: true,
	content: ['./src/**/*.{html,js,svelte,ts}', './src/lib/data/copy.json'],
	plugins: [require('@tailwindcss/typography')],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif']
		},
		fontSize: {
			xs: ['0.75rem'],
			sm: ['0.875rem'],
			base: ['1rem'],
			lg: ['1.125rem'],
			xl: ['1.3125rem'],
			'2xl': ['1.75rem'],
			'3xl': ['2rem'],
			'4xl': ['2.25rem'],
			'5xl': ['3rem'],
			'6xl': ['4rem'],
			'7xl': ['4.5rem'],
			'8xl': ['6rem'],
			'9xl': ['8rem']
		},

		extend: {
			colors,
			textShadow: {
				DEFAULT: '-1px 1px amber, 1px 1px amber, 1px 1px amber, 1px -1px amber',
				xl: '-2px -2px 4px #f5f5f5, -2px -1px 4px #f5f5f5, -2px 0px 4px #f5f5f5, -2px 1px 4px #f5f5f5, -2px 2px 4px #f5f5f5, -1px -2px 4px #f5f5f5, -1px -1px 4px #f5f5f5, -1px 0px 4px #f5f5f5, -1px 1px 4px #f5f5f5, -1px 2px 4px #f5f5f5, 0px -2px 4px #f5f5f5, 0px -1px 4px #f5f5f5, 0px 1px 4px #f5f5f5, 0px 2px 4px #f5f5f5, 1px -2px 4px #f5f5f5, 1px -1px 4px #f5f5f5, 1px 0px 4px #f5f5f5, 1px 1px 4px #f5f5f5, 1px 2px 4px #f5f5f5, 2px -2px 4px #f5f5f5, 2px -1px 4px #f5f5f5, 2px 0px 4px #f5f5f5, 2px 1px 4px #f5f5f5, 2px 2px 4px #f5f5f5'
			}
		}
	}
};
