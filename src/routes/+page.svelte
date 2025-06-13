<script>
	import { Button, Typography } from '$lib';
	import { isAuthenticated, user, openLoginModal } from '$lib/stores/auth';
	
	function handleGetStarted() {
		openLoginModal();
	}
</script>

<div class="min-h-screen p-6">
	<div class="max-w-6xl mx-auto">
		<!-- Welcome Section -->
		<div class="glass-card rounded-2xl p-8 mb-8">
			<div class="text-center space-y-6">
				<Typography tag="h1" variant="display" color="gradient" align="center">
					Work<span class="text-orange-500">Log</span>
				</Typography>
				
				{#if $isAuthenticated && $user}
					<Typography tag="p" variant="subtitle" color="secondary" weight="light" align="center">
						Welcome back, {$user.name}! Ready to be productive today?
					</Typography>
					
					<div class="flex gap-4 justify-center mt-8">
						<Button variant="primary" size="md">
							Add New Task
						</Button>
						
						<Button variant="secondary" size="md">
							View Today's Tasks
						</Button>
					</div>
				{:else}
					<Typography tag="p" variant="subtitle" color="secondary" weight="light" align="center">
						Your personal todo companion with beautiful glass aesthetics and intuitive design.
					</Typography>
					
					<div class="flex gap-4 justify-center mt-8">
						<Button variant="primary" size="md" onclick={handleGetStarted}>
							Get Started
						</Button>
						
						<Button variant="secondary" size="md">
							Learn More
						</Button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Component Demo Sections -->
		<div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
			<!-- Typography Demo Section -->
			<div class="glass-card rounded-2xl p-6">
				<Typography tag="h2" variant="title" color="secondary" align="center">
					Typography System
				</Typography>
				
				<div class="space-y-6 mt-6">
					<!-- Headings -->
					<div class="space-y-3">
						<Typography tag="h3" variant="subtitle" color="accent" weight="semibold">
							Headings
						</Typography>
						<Typography tag="h1" variant="display" color="primary">
							Display Text
						</Typography>
						<Typography tag="h2" variant="headline" color="primary">
							Headline Text
						</Typography>
						<Typography tag="h3" variant="title" color="primary">
							Title Text
						</Typography>
						<Typography tag="h4" variant="subtitle" color="primary">
							Subtitle Text
						</Typography>
					</div>
					
					<!-- Body Text & Colors -->
					<div class="space-y-3">
						<Typography tag="h3" variant="subtitle" color="accent" weight="semibold">
							Body Text & Colors
						</Typography>
						<Typography tag="p" variant="body" color="primary">
							Primary text for main content
						</Typography>
						<Typography tag="p" variant="body" color="secondary">
							Secondary text for supporting info
						</Typography>
						<Typography tag="p" variant="body" color="muted">
							Muted text for less important details
						</Typography>
						<Typography tag="p" variant="caption" color="muted">
							Caption text for metadata
						</Typography>
						<div class="flex gap-3 flex-wrap mt-3">
							<Typography tag="span" variant="body" color="success">Success</Typography>
							<Typography tag="span" variant="body" color="warning">Warning</Typography>
							<Typography tag="span" variant="body" color="danger">Danger</Typography>
							<Typography tag="span" variant="body" color="gradient" weight="semibold">Gradient</Typography>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Button Demo Section -->
			<div class="glass-card rounded-2xl p-6">
				<Typography tag="h2" variant="title" color="secondary" align="center">
					Button System
				</Typography>
				
				<div class="space-y-6 mt-6">
					<!-- Size Variants -->
					<div>
						<Typography tag="h3" variant="subtitle" color="accent" weight="semibold" align="center">
							Sizes
						</Typography>
						<div class="flex gap-3 justify-center items-center mt-3">
							<Button variant="primary" size="sm">Small</Button>
							<Button variant="primary" size="md">Medium</Button>
							<Button variant="primary" size="lg">Large</Button>
						</div>
					</div>
					
					<!-- Color Variants -->
					<div>
						<Typography tag="h3" variant="subtitle" color="accent" weight="semibold" align="center">
							Variants
						</Typography>
						<div class="flex gap-3 justify-center items-center flex-wrap mt-3">
							<Button variant="primary">Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="success">Success</Button>
							<Button variant="danger">Danger</Button>
						</div>
					</div>
					
					<!-- Disabled State -->
					<div>
						<Typography tag="h3" variant="subtitle" color="accent" weight="semibold" align="center">
							States
						</Typography>
						<div class="flex gap-3 justify-center items-center mt-3">
							<Button variant="primary" disabled>Disabled Primary</Button>
							<Button variant="secondary" disabled>Disabled Secondary</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- 배경 장식 요소들 -->
<div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
	<div class="absolute top-1/4 right-1/4 w-32 h-32 versace-bg rounded-full opacity-10 blur-3xl animate-pulse"></div>
	<div class="absolute bottom-1/3 right-1/3 w-24 h-24 versace-bg rounded-full opacity-15 blur-2xl animate-pulse" style="animation-delay: 2s;"></div>
	<div class="absolute top-2/3 right-1/2 w-16 h-16 versace-bg rounded-full opacity-20 blur-xl animate-pulse" style="animation-delay: 4s;"></div>
</div>
