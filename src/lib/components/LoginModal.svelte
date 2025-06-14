<script>
	import { Button, Typography } from '$lib';
	import { 
		loginStart, 
		registerStart, 
		registerData, 
		loginData,
		closeLoginModal 
	} from '$lib/stores/auth';
	
	export let isOpen = false;
	export let onClose;
	
	let name = '';
	let email = '';
	let isLoading = false;
	let error = '';
	let isSignupMode = false;
	
	// WebAuthn 지원 확인
	$: webAuthnSupported = typeof navigator !== 'undefined' && 
		!!(navigator.credentials && navigator.credentials.create);
	
	async function handlePasskeyLogin() {
		if (!name) {
			error = 'Please enter your name';
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			// loginData store 업데이트
			loginData.set({ name });
			await loginStart();
			onClose();
		} catch (err) {
			error = 'An error occurred during authentication: ' + err.message;
		} finally {
			isLoading = false;
		}
	}
	
	async function handlePasskeyRegistration() {
		if (!name || !email) {
			error = 'Please fill in all fields';
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			// registerData store 업데이트
			registerData.set({ name, email });
			await registerStart();
			onClose();
		} catch (err) {
			error = 'An error occurred during registration: ' + err.message;
		} finally {
			isLoading = false;
		}
	}
	
	function toggleMode() {
		isSignupMode = !isSignupMode;
		error = '';
		name = '';
		email = '';
	}
	
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}
	
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			onClose();
		}
		if (event.key === 'Enter' && !isLoading) {
			if (isSignupMode) {
				handlePasskeyRegistration();
			} else {
				handlePasskeyLogin();
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="login-title"
		tabindex="-1"
	>
		<div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
			<div class="text-center mb-8">
				<Typography tag="h2" variant="headline" color="primary" weight="bold" align="center" id="login-title">
					{isSignupMode ? 'Create Your Account' : 'Welcome Back'}
				</Typography>
				<Typography tag="p" variant="body" color="secondary" align="center">
					{isSignupMode ? 'Register with your passkey' : 'Sign in with your passkey'}
				</Typography>
				{#if !webAuthnSupported}
					<div class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
						<Typography tag="p" variant="caption" color="warning" align="center">
							⚠️ Your browser doesn't support passkeys.
						</Typography>
					</div>
				{/if}
			</div>
			
			<div class="space-y-6">
				<div class="space-y-2">
					<Typography tag="label" variant="body" color="primary" weight="medium">
						Name
					</Typography>
					<input
						type="text"
						bind:value={name}
						placeholder="Enter your name"
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
						disabled={isLoading}
						required
					/>
				</div>
				
				{#if isSignupMode}
					<div class="space-y-2">
						<Typography tag="label" variant="body" color="primary" weight="medium">
							Email
						</Typography>
						<input
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
							disabled={isLoading}
							required
						/>
					</div>
				{/if}
				
				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-xl p-3">
						<Typography tag="p" variant="caption" color="danger" align="center">
							{error}
						</Typography>
					</div>
				{/if}
				
				<div class="flex justify-center">
					{#if isSignupMode}
						<Button 
							variant="primary"
							size="lg" 
							onclick={handlePasskeyRegistration}
							disabled={isLoading || !webAuthnSupported}
							style="width: 100%;"
						>
							{#if isLoading}
								Creating Passkey...
							{:else}
								🔐 Create Passkey
							{/if}
						</Button>
					{:else}
						<Button 
							variant="primary" 
							size="lg" 
							onclick={handlePasskeyLogin}
							disabled={isLoading || !webAuthnSupported}
							style="width: 100%;"
						>
							{#if isLoading}
								Authenticating...
							{:else}
								🔐 Sign In with Passkey
							{/if}
						</Button>
					{/if}
				</div>
				
				<div class="text-center pt-4 border-t border-gray-200">
					<Typography tag="p" variant="body" color="secondary" align="center">
						{isSignupMode ? 'Already have a passkey?' : "Don't have a passkey?"}
					</Typography>
					<button 
						on:click={toggleMode}
						disabled={isLoading}
						class="mt-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
					>
						{isSignupMode ? 'Sign In' : 'Create Account'}
					</button>
				</div>
			</div>
			
			<button 
				on:click={onClose}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
				disabled={isLoading}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
		</div>
	</div>
{/if}

