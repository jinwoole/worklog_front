<script>
	import { Typography, Button } from '$lib';
	import { isAuthenticated, user, logout, openLoginModal } from '$lib/stores/auth';
	
	/** @type {boolean} */
	export let isOpen = false;
	
	/** @type {() => void} */
	export let onToggle = () => {};

	// Navigation items - Todo 앱에 맞게 구조화
	const navItems = [
		{
			id: 'today',
			label: 'Today',
			icon: '📋',
			href: '/',
			active: true
		},
		{
			id: 'upcoming',
			label: 'Upcoming',
			icon: '📅',
			href: '/upcoming',
			active: false
		},
		{
			id: 'completed',
			label: 'Completed',
			icon: '✅',
			href: '/completed',
			active: false
		},
		{
			id: 'categories',
			label: 'Categories',
			icon: '🏷️',
			href: '/categories',
			active: false
		}
	];

	function handleLogin() {
		openLoginModal();
	}

	function handleLogout() {
		logout();
	}
</script>

<!-- Backdrop for mobile -->
{#if isOpen}
	<div 
		class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
		on:click={onToggle}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Escape' && onToggle()}
	></div>
{/if}

<!-- Left Menu Bar -->
<aside 
	class="fixed left-0 top-0 h-full w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out
		{isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
	<div class="flex flex-col h-full p-6">
		<!-- Logo/Brand Section -->
		<div class="flex items-center gap-3 mb-8">
			<div class="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center text-gray-700 text-xl font-bold shadow-lg">
				W
			</div>
			<Typography tag="h2" variant="title" color="primary" weight="bold">
				WorkLog
			</Typography>
		</div>

		<!-- User Profile Section / Login Section -->
		{#if $isAuthenticated && $user}
			<!-- Authenticated User Profile -->
			<div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6 shadow-lg">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 bg-white/25 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-gray-700 text-xl shadow-inner">
						{$user.avatar}
					</div>
					<div class="flex-1 min-w-0">
						<Typography tag="p" variant="body" color="primary" weight="semibold">
							{$user.name}
						</Typography>
						<Typography tag="p" variant="caption" color="muted">
							{$user.email}
						</Typography>
					</div>
					<button 
						on:click={handleLogout}
						class="w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200"
						title="Logout"
					>
						🚪
					</button>
				</div>
			</div>
		{:else}
			<!-- Login Section -->
			<div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6 shadow-lg">
				<div class="text-center space-y-3">
					<div class="w-12 h-12 bg-white/25 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-gray-700 text-xl shadow-inner mx-auto">
						👤
					</div>
					<div>
						<Typography tag="p" variant="body" color="primary" weight="semibold">
							Welcome to WorkLog
						</Typography>
						<Typography tag="p" variant="caption" color="muted">
							Sign in to access your tasks
						</Typography>
					</div>
					<Button 
						variant="primary" 
						size="sm" 
						onclick={handleLogin}
						class="w-full"
					>
						Sign In
					</Button>
				</div>
			</div>
		{/if}

		<!-- Navigation Menu -->
		<nav class="flex-1 space-y-2">
			<Typography tag="p" variant="overline" color="muted" weight="medium">
				Navigation
			</Typography>
			
			{#each navItems as item}
				<a 
					href={item.href}
					class="nav-item group {item.active ? 'nav-item-active' : ''}"
				>
					<span class="nav-icon">{item.icon}</span>
					<Typography tag="span" variant="body" weight="medium">
						{item.label}
					</Typography>
					
					{#if item.active}
						<div class="nav-indicator"></div>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Quick Actions Section -->
		{#if $isAuthenticated}
			<div class="mt-6 pt-6 border-t border-white/15">
				<Typography tag="p" variant="overline" color="muted" weight="medium">
					Quick Actions
				</Typography>
				
				<div class="space-y-2 mt-3">
					<button class="nav-item group">
						<span class="nav-icon">➕</span>
						<Typography tag="span" variant="body" weight="medium">
							Add Task
						</Typography>
					</button>
					
					<button class="nav-item group">
						<span class="nav-icon">🏷️</span>
						<Typography tag="span" variant="body" weight="medium">
							New Category
						</Typography>
					</button>
				</div>
			</div>

			<!-- Stats Section -->
			<div class="mt-6 pt-6 border-t border-white/15">
				<Typography tag="p" variant="overline" color="muted" weight="medium">
					Today's Progress
				</Typography>
				
				<div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mt-3 shadow-lg">
					<div class="flex justify-between items-center mb-2">
						<Typography tag="span" variant="caption" color="muted">
							Completed
						</Typography>
						<Typography tag="span" variant="caption" color="primary" weight="semibold">
							5 / 12
						</Typography>
					</div>
					<div class="w-full bg-white/20 rounded-full h-2">
						<div class="bg-gradient-to-r from-gray-400 to-gray-600 h-2 rounded-full shadow-inner" style="width: 42%"></div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Guest Information -->
			<div class="mt-6 pt-6 border-t border-white/15">
				<div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg text-center">
					<Typography tag="p" variant="body" color="muted" align="center">
						Sign in to start managing your tasks and track your progress.
					</Typography>
				</div>
			</div>
		{/if}

		<!-- Footer Actions -->
		<div class="mt-6 pt-6 border-t border-white/15 space-y-2">
			<button class="nav-item group">
				<span class="nav-icon">⚙️</span>
				<Typography tag="span" variant="body" weight="medium">
					Settings
				</Typography>
			</button>
		</div>
	</div>
</aside>

<!-- Mobile Menu Toggle Button -->
<button 
	on:click={onToggle}
	class="fixed top-6 left-6 z-50 lg:hidden bg-white/15 backdrop-blur-sm border border-white/25 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
>
	<span class="text-gray-700 text-xl">
		{isOpen ? '✕' : '☰'}
	</span>
</button>
