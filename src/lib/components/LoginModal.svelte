<script>
	import { Button, Typography } from '$lib';
	import { login, closeLoginModal } from '$lib/stores/auth';
	
	/** @type {boolean} */
	export let isOpen = false;
	
	/** @type {() => void} */
	export let onClose = () => {};
	
	let username = '';
	let passkey = '';
	let isLoading = false;
	let error = '';
	let isSignupMode = false;
	
	async function handleSubmit() {
		if (!username || !passkey) {
			error = 'Please fill in all fields';
			return;
		}
		
		isLoading = true;
		error = '';
		
		try {
			const result = await login(username, passkey);
			if (!result.success) {
				error = result.error || 'Login failed';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	function handleSignup() {
		// 임시로 회원가입도 같은 로직 사용
		handleSubmit();
	}
	
	function toggleMode() {
		isSignupMode = !isSignupMode;
		error = '';
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
				handleSignup();
			} else {
				handleSubmit();
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop with Oil Painting Effect -->
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-6"
		style="background: radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.04) 0%, transparent 40%), 
		       radial-gradient(circle at 70% 60%, rgba(255, 134, 89, 0.03) 0%, transparent 35%), 
		       radial-gradient(circle at 40% 80%, rgba(255, 107, 53, 0.02) 0%, transparent 30%), 
		       radial-gradient(circle at 85% 20%, rgba(229, 90, 43, 0.025) 0%, transparent 25%), 
		       radial-gradient(circle at 10% 70%, rgba(255, 107, 53, 0.015) 0%, transparent 20%), 
		       rgba(255, 255, 255, 0.85);"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="login-title"
	>
		<!-- Login Modal -->
		<div class="bg-white/95 backdrop-blur-sm border-2 border-orange-200/40 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
			 style="box-shadow: 0 25px 50px rgba(255, 107, 53, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1);"
		>
			<!-- Decorative Orange Drops -->
			<div class="absolute top-4 right-8 w-3 h-3 bg-orange-300/30 rounded-full blur-sm"></div>
			<div class="absolute top-12 right-16 w-2 h-2 bg-orange-400/20 rounded-full blur-sm"></div>
			<div class="absolute bottom-16 left-6 w-4 h-4 bg-orange-200/25 rounded-full blur-sm"></div>
			<div class="absolute bottom-8 left-20 w-2 h-2 bg-orange-300/20 rounded-full blur-sm"></div>
			<!-- Header -->
			<div class="text-center mb-8 relative z-10">
				<Typography tag="h2" variant="headline" color="primary" weight="bold" align="center" id="login-title">
					{isSignupMode ? 'Join WorkLog' : 'Welcome Back'}
				</Typography>
				<Typography tag="p" variant="body" color="secondary" align="center">
					{isSignupMode ? 'Create your account to get started' : 'Sign in to your account'}
				</Typography>
			</div>
			
			<!-- Form -->
			<form on:submit|preventDefault={isSignupMode ? handleSignup : handleSubmit} class="space-y-6 relative z-10">
				<!-- Username Field -->
				<div class="space-y-2">
					<Typography tag="label" variant="body" color="primary" weight="medium">
						Username
					</Typography>
					<input
						type="text"
						bind:value={username}
						placeholder="Enter your username"
						class="auth-input"
						disabled={isLoading}
						required
					/>
				</div>
				
				<!-- Passkey Field -->
				<div class="space-y-2">
					<Typography tag="label" variant="body" color="primary" weight="medium">
						Passkey
					</Typography>
					<input
						type="password"
						bind:value={passkey}
						placeholder="Enter your passkey"
						class="auth-input"
						disabled={isLoading}
						required
					/>
				</div>
				
				<!-- Error Message -->
				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-xl p-3">
						<Typography tag="p" variant="caption" color="danger" align="center">
							{error}
						</Typography>
					</div>
				{/if}
				
				<!-- Submit Button -->
				<Button 
					variant="primary" 
					size="lg" 
					type="submit"
					disabled={isLoading}
					onclick={isSignupMode ? handleSignup : handleSubmit}
				>
					{#if isLoading}
						Signing {isSignupMode ? 'Up' : 'In'}...
					{:else}
						{isSignupMode ? 'Create Account' : 'Sign In'}
					{/if}
				</Button>
				
				<!-- Toggle Mode -->
				<div class="text-center pt-4 border-t border-orange-200/30">
					<Typography tag="p" variant="body" color="secondary" align="center">
						{isSignupMode ? 'Already have an account?' : "Don't have an account?"}
					</Typography>
					<button 
						type="button"
						on:click={toggleMode}
						class="modal-toggle-btn mt-2 text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
						disabled={isLoading}
					>
						{isSignupMode ? 'Sign In' : 'Sign Up'}
					</button>
				</div>
			</form>
			
			<!-- Close Button -->
			<button 
				on:click={onClose}
				class="modal-close-btn absolute top-4 right-4 z-20 w-8 h-8 bg-orange-100/50 hover:bg-orange-200/60 border border-orange-200/50 rounded-lg flex items-center justify-center text-orange-600 hover:text-orange-700 transition-all duration-200"
				disabled={isLoading}
			>
				✕
			</button>
		</div>
	</div>
{/if}
