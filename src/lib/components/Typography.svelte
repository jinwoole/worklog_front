<script>
	/**
	 * @typedef {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'} TypographyTag
	 * @typedef {'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'caption' | 'overline'} TypographyVariant
	 * @typedef {'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning' | 'danger' | 'gradient'} TypographyColor
	 * @typedef {'light' | 'normal' | 'medium' | 'semibold' | 'bold'} TypographyWeight
	 */

	/** @type {TypographyTag} */
	export let tag = 'p';
	
	/** @type {TypographyVariant} */
	export let variant = 'body';
	
	/** @type {TypographyColor} */
	export let color = 'primary';
	
	/** @type {TypographyWeight} */
	export let weight = 'normal';
	
	/** @type {boolean} */
	export let gradient = false;
	
	/** @type {string} */
	export let align = 'left';

	$: textClasses = [
		getVariantClasses(variant),
		getColorClasses(color, gradient),
		getWeightClasses(weight),
		getAlignClasses(align),
		'transition-colors duration-200'
	].join(' ');

	/**
	 * @param {TypographyVariant} variant
	 * @returns {string}
	 */
	function getVariantClasses(variant) {
		const variants = {
			display: 'text-5xl leading-tight font-bold tracking-tight',
			headline: 'text-4xl leading-tight font-bold tracking-tight',
			title: 'text-2xl leading-snug font-semibold',
			subtitle: 'text-xl leading-relaxed font-medium',
			body: 'text-base leading-relaxed',
			caption: 'text-sm leading-normal',
			overline: 'text-xs leading-normal uppercase tracking-wide'
		};
		return variants[variant] || variants.body;
	}

	/**
	 * @param {TypographyColor} color
	 * @param {boolean} gradient
	 * @returns {string}
	 */
	function getColorClasses(color, gradient) {
		if (gradient) {
			return 'bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent';
		}
		
		const colors = {
			primary: 'text-gray-900',
			secondary: 'text-gray-700',
			accent: 'text-orange-500',
			muted: 'text-gray-500',
			success: 'text-green-600',
			warning: 'text-yellow-600',
			danger: 'text-red-600',
			gradient: 'bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent'
		};
		return colors[color] || colors.primary;
	}

	/**
	 * @param {TypographyWeight} weight
	 * @returns {string}
	 */
	function getWeightClasses(weight) {
		const weights = {
			light: 'font-light',
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold'
		};
		return weights[weight] || weights.normal;
	}

	/**
	 * @param {string} align
	 * @returns {string}
	 */
	function getAlignClasses(align) {
		const alignments = {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
			justify: 'text-justify'
		};
		return alignments[align] || alignments.left;
	}
</script>

<svelte:element this={tag} class={textClasses} {...$$restProps}>
	<slot />
</svelte:element>
