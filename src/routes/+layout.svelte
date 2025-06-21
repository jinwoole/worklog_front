<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { userStore, updateUser } from '$lib/stores/user';
  import { page } from '$app/stores';
  import UserSection from '$lib/components/topbar/user_section.svelte';
  import '../app.css';
  
  export let data;
  
  // 서버에서 받은 초기 사용자 데이터를 스토어에 설정
  $: {
    // data가 변경될 때마다 사용자 정보 업데이트
    console.log('Layout data changed:', data?.user);
    if (data?.user !== undefined) {
      updateUser(data.user);
      console.log('User store updated:', data.user);
    }
  }
  
  // 성능 최적화된 마우스 위치 스토어 (throttled)
  const mousePosition = writable({ x: 0.5, y: 0.5 });
  setContext('mousePosition', mousePosition);
  
  let containerElement: HTMLElement;
  
  onMount(() => {
    let throttleTimer: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimer) return;
      
      throttleTimer = window.setTimeout(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        mousePosition.set({ x, y });
        throttleTimer = 0;
      }, 16); // 60fps throttle
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  });
  
  // 네비게이션 항목들
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/settings', label: 'Settings' }
  ];
</script>

<div class="app-container" bind:this={containerElement}>
  <!-- 애플 스타일 상단 네비게이션 -->
  <nav class="top-nav">
    <div class="nav-content">
      <!-- 로고 섹션 -->
      <div class="logo-section">
        <a href="/" class="logo-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="logo-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="logo-text">WorkLog</span>
        </a>
      </div>
      
      <!-- 중앙 네비게이션 -->
      <div class="nav-links">
        {#each navItems as item}
          <a 
            href={item.href} 
            class="nav-link"
            class:active={$page.url.pathname === item.href}
          >
            {item.label}
          </a>
        {/each}
      </div>
      
      <!-- 사용자 섹션 -->
      <div class="user-section">
        <UserSection />
      </div>
    </div>
  </nav>
  
  <!-- 메인 콘텐츠 -->
  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #ffffff;
    color: #1d1d1f;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* 애플 스타일 상단 네비게이션 */
  .top-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
  }
  
  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* 로고 섹션 */
  .logo-section {
    display: flex;
    align-items: center;
  }
  
  .logo-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #1d1d1f;
    font-weight: 600;
    font-size: 18px;
    transition: opacity 0.2s ease;
  }
  
  .logo-link:hover {
    opacity: 0.8;
  }
  
  .logo-icon {
    color: #1d1d1f;
  }
  
  .logo-text {
    letter-spacing: -0.02em;
  }
  
  /* 중앙 네비게이션 */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  
  .nav-link {
    position: relative;
    text-decoration: none;
    color: #1d1d1f;
    font-weight: 400;
    font-size: 17px;
    padding: 8px 0;
    transition: all 0.2s ease;
    opacity: 0.8;
  }
  
  .nav-link:hover {
    opacity: 1;
  }
  
  .nav-link.active {
    opacity: 1;
    font-weight: 500;
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #007aff;
    border-radius: 1px;
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  
  /* 사용자 섹션 */
  .user-section {
    display: flex;
    align-items: center;
  }
  
  /* 메인 콘텐츠 */
  .main-content {
    flex: 1;
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  /* 모바일 반응형 */
  @media (max-width: 768px) {
    .nav-content {
      padding: 0 16px;
      height: 56px;
    }
    
    .nav-links {
      gap: 24px;
    }
    
    .nav-link {
      font-size: 16px;
    }
    
    .logo-text {
      font-size: 16px;
    }
    
    .main-content {
      padding: 20px 16px;
    }
  }
  
  @media (max-width: 640px) {
    .nav-links {
      gap: 16px;
    }
    
    .nav-link {
      font-size: 15px;
    }
  }
  
  /* 성능 최적화 */
  .top-nav {
    will-change: transform;
  }
  
  .nav-link {
    will-change: opacity;
  }
  
  /* 접근성 */
  @media (prefers-reduced-motion: reduce) {
    .nav-link,
    .logo-link {
      transition: none;
    }
    
    .nav-link.active::after {
      animation: none;
    }
  }
  
  /* 다크 모드 지원 (선택사항) */
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background: #000000;
      color: #f5f5f7;
    }
    
    .top-nav {
      background: rgba(0, 0, 0, 0.8);
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
    
    .logo-link,
    .nav-link {
      color: #f5f5f7;
    }
    
    .logo-icon {
      color: #f5f5f7;
    }
  }
</style>