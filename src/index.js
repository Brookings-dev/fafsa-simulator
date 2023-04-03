import './app.postcss';

// https://www.npmjs.com/package/svelte-lazy-loader
import { Image } from 'svelte-lazy-loader';

// create images on-the-fly with vite-imagetools
// https://www.npmjs.com/package/vite-imagetools
// import ImagePlaceholder from '$lib/assets/san-felipe-del-morro-castle.jpg?w=100&png&blur=5';
// import ImageSrc from '$lib/assets/san-felipe-del-morro-castle.jpg?w=650&webp';
// import ImageSrcset from '$lib/assets/san-felipe-del-morro-castle.jpg?w=300;600;900&webp&srcset';

// viz components
import BarsDiverge from '$lib/components/charts/BarsDiverge.svelte';

// an array of our components, mapped to match the <figure data-cmsvelte=""> elements in index.html
const components = [

	{
		chartID: 'fafsa',
		Component: BarsDiverge
	}

];

// add objects in the cmsFiles array to mimic styles and scripts in your CMS while developing. These scripts aren't included in production mode.
const cmsFiles = [
	// {
	// 	tag: 'link',
	// 	attributes: {
	// 		href: 'https://www.site.com/path/to.css',
	// 		rel: 'stylesheet',
	// 		type: 'text/css'
	// 	}
	// },
	// {
	// 	tag: 'script',
	// 	attributes: {
	// 		src: 'https://www.site.com/path/to.js',
	// 		async: 'true',
	// 		type: 'text/javascript'
	// 	}
	// }
];

// add files in the format below to
if (import.meta.env.DEV && cmsFiles.length > 0) {
	const head = document.head;

	cmsFiles.forEach(({ tag, attributes }) => {
		const el = document.createElement(tag);

		Object.entries(attributes).forEach(([key, value]) => (el[key] = value));

		head.appendChild(el);
	});
}

function mountComponent({
	Component,
	id,
	selector = `#svelte-${id}`,
	target = document.querySelector(selector),
	props: clientProps = {},
	...svelteOptions
}) {
	if (!Component) {
		console.trace('Missing required parameter: Component');
		return null;
	}
	if (!target) {
		console.trace('⚠️ No element found for svelte component:', selector);
		return null;
	}
	const props = {
		...clientProps
		// ...inlineProps,
	};
	return new Component({
		target,
		props,
		...svelteOptions
	});
}

components.forEach((comp) => {
	const { chartID, Component, props } = comp;
	const target = document.querySelector(`[data-cmsvelte="${chartID}"]`);
	mountComponent({
		Component,
		target,
		props
	});
});

// export { default } from './Slider.svelte';
