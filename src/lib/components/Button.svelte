<script>
	/**
	 * @typedef {'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'purple'} ButtonVariant
	 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
	 */

	/** @type {ButtonVariant} */
	export let variant = 'primary';
	
	/** @type {ButtonSize} */
	export let size = 'md';
	
	/** @type {boolean} */
	export let disabled = false;
	
	/** @type {string} */
	export let type = 'button';
	
	/** @type {() => void} */
	export let onclick = () => {};

	$: buttonClasses = [
		'font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50',
		getVariantClasses(variant),
		getSizeClasses(size),
		disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
	].join(' ');

	/**
	 * @param {ButtonVariant} variant
	 * @returns {string}
	 */
	function getVariantClasses(variant) {
		const variants = {
			primary: 'glass-button text-white',
			secondary: 'glass-button-secondary',
			ghost: 'glass-button-ghost text-gray-700 hover:text-gray-900',
			danger: 'glass-button-danger text-white',
			success: 'glass-button-success text-white',
			purple: 'glass-button-purple text-white'
		};
		return variants[variant] || variants.primary;
	}

	/**
	 * @param {ButtonSize} size
	 * @returns {string}
	 */
	function getSizeClasses(size) {
		const sizes = {
			sm: 'px-4 py-2 text-sm rounded-lg',
			md: 'px-6 py-3 text-base rounded-xl',
			lg: 'px-8 py-4 text-lg rounded-xl'
		};
		return sizes[size] || sizes.md;
	}
</script>

<button 
	class="{buttonClasses} {$$restProps.class || ''}"
	{type}
	{disabled}
	on:click={onclick}
	{...$$restProps}
>
	<slot />
</button>
