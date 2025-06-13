<script>
	import '../app.css';
	import { LeftMenuBar, LoginModal } from '$lib';
	import { showLoginModal, closeLoginModal } from '$lib/stores/auth';
	
	let { children } = $props();
	
	// Menu state management
	let isMenuOpen = $state(false);
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	function handleCloseLoginModal() {
		closeLoginModal();
	}
</script>

<div class="min-h-screen bg-transparent">
	<!-- Left Menu Bar -->
	<LeftMenuBar bind:isOpen={isMenuOpen} onToggle={toggleMenu} />
	
	<!-- Main Content Area -->
	<main class="lg:ml-80 transition-all duration-300">
		{@render children()}
	</main>
	
	<!-- Login Modal -->
	<LoginModal isOpen={$showLoginModal} onClose={handleCloseLoginModal} />
</div>
