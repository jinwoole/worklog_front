<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { userStore, updateUser } from '$lib/stores/user';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import SidebarSection from '$lib/components/sidebar/sidebar_section.svelte';
  import UserSection from '$lib/components/sidebar/user_section.svelte';
  import '../app.css';
  
  export let data;
  
  // 서버에서 받은 초기 사용자 데이터를 스토어에 설정
  $: if (data?.user !== undefined) {
    updateUser(data.user);
  }
  
  // 성능 최적화된 마우스 위치 스토어 (throttled)
  const mousePosition = writable({ x: 0.5, y: 0.5 });
  setContext('mousePosition', mousePosition);
  
  let containerElement: HTMLElement;
  let sidebarOpen = true; // 기본적으로 사이드바 열림
  
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
</script>

<div class="glass-container flex" bind:this={containerElement}>
  <!-- 화이트 배경 레이어들 -->
  <div class="fixed inset-0 -z-50">
    <!-- 기본 백색 배경 -->
    <div 
      class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"
    ></div>
    
    <!-- 동적 기하학적 패턴 1 -->
    <div 
      class="absolute inset-0 dynamic-pattern pattern-1"
      style="
        background-image: 
          radial-gradient(circle at 20% 20%, rgba(0,0,0,0.015) 1px, transparent 1px),
          radial-gradient(circle at 80% 80%, rgba(0,0,0,0.015) 1px, transparent 1px);
        background-size: 60px 60px, 40px 40px;
        transform: translate({$mousePosition.x * 8}px, {$mousePosition.y * 8}px);
      "
    ></div>
    
    <!-- 동적 기하학적 패턴 2 -->
    <div 
      class="absolute inset-0 dynamic-pattern pattern-2"
      style="
        background-image: 
          linear-gradient(45deg, rgba(0,0,0,0.01) 1px, transparent 1px),
          linear-gradient(-45deg, rgba(0,0,0,0.01) 1px, transparent 1px);
        background-size: 25px 25px;
        transform: translate({$mousePosition.x * -4}px, {$mousePosition.y * -4}px) rotate({$mousePosition.x * 0.3}deg);
      "
    ></div>
    
    <!-- 미묘한 노이즈 텍스처 -->
    <div 
      class="absolute inset-0 noise-texture"
      style="
        background-image: 
          radial-gradient(circle at {$mousePosition.x * 100}% {$mousePosition.y * 100}%, 
            rgba(0,0,0,0.012) 0%, 
            transparent 25%);
        background-size: 150px 150px;
      "
    ></div>
    
    <!-- 부드러운 그라데이션 오버레이 -->
    <div class="absolute inset-0 gradient-overlay"></div>
  </div>
  
  <!-- 사이드바 -->
  <Sidebar bind:isOpen={sidebarOpen}>
    <SidebarSection href="/">
      Home
    </SidebarSection>
    <SidebarSection href="/login">
      Login
    </SidebarSection>
    <SidebarSection href="/dashboard">
      Dashboard
    </SidebarSection>
    <SidebarSection href="/settings">
      Settings
    </SidebarSection>
    
    <!-- 유저 섹션 - 사이드바 최하단 -->
    <UserSection />
  </Sidebar>
  
  <!-- 메인 콘텐츠 영역 -->
  <main class="main-content flex-1" class:sidebar-open={sidebarOpen}>
    <!-- 콘텐츠 글래스 패널 -->
    <div class="content-glass">
      <!-- 미묘한 빛 반사 효과 -->
      <div 
        class="absolute inset-0 pointer-events-none opacity-60 rounded-[24px] glass-reflection"
        style="
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 25%,
            transparent 75%,
            rgba(255, 255, 255, 0.2) 100%
          );
        "
      ></div>
      
      <!-- 실제 콘텐츠 -->
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: #ffffff;
  }
  
  .glass-container {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  /* 동적 패턴 애니메이션 */
  .dynamic-pattern {
    transition: transform 0.1s ease-out;
    will-change: transform;
  }
  
  .pattern-1 {
    animation: patternFloat1 15s ease-in-out infinite;
  }
  
  .pattern-2 {
    animation: patternFloat2 20s ease-in-out infinite;
  }
  
  .noise-texture {
    animation: noiseShift 12s linear infinite;
  }
  
  /* 그라데이션 오버레이 */
  .gradient-overlay {
    background: 
      linear-gradient(45deg, transparent 30%, rgba(0,0,0,0.003) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.002) 60%, transparent 80%);
    animation: gradientShimmer 25s linear infinite;
  }
  
  @keyframes patternFloat1 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    25% { 
      transform: translate(2px, -1px) rotate(0.2deg) scale(1.01);
    }
    50% { 
      transform: translate(-1px, 2px) rotate(-0.1deg) scale(0.99);
    }
    75% { 
      transform: translate(-2px, -1px) rotate(0.1deg) scale(1.005);
    }
  }
  
  @keyframes patternFloat2 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    33% { 
      transform: translate(-1px, 1px) rotate(-0.15deg) scale(1.005);
    }
    66% { 
      transform: translate(1px, -2px) rotate(0.1deg) scale(0.995);
    }
  }
  
  @keyframes noiseShift {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-1px, 1px); }
    50% { transform: translate(1px, -1px); }
    75% { transform: translate(-1px, -1px); }
    100% { transform: translate(0, 0); }
  }
  
  @keyframes gradientShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .main-content {
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    transition: margin-left 0.3s ease-out;
  }
  
  .main-content.sidebar-open {
    margin-left: 14rem; /* 사이드바 너비(14rem = 224px) 만큼 밀어냄 */
  }
  
  .content-glass {
    position: relative;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(20px) saturate(1.1);
    -webkit-backdrop-filter: blur(20px) saturate(1.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 24px;
    padding: 2rem;
    min-height: calc(100vh - 4rem);
    box-shadow: 
      inset 0 1px 1px rgba(255, 255, 255, 0.8),
      0 20px 40px rgba(0, 0, 0, 0.06),
      0 4px 12px rgba(0, 0, 0, 0.02);
    overflow: hidden;
  }
  
  /* 글래스 반사 효과 */
  .glass-reflection {
    animation: glassReflection 4s ease-in-out infinite;
  }
  
  @keyframes glassReflection {
    0%, 100% { 
      opacity: 0.4;
      transform: translateX(0) rotate(0deg);
    }
    50% { 
      opacity: 0.7;
      transform: translateX(2px) rotate(0.5deg);
    }
  }
  
  /* 콘텐츠 글래스 상단 하이라이트 */
  .content-glass::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
  }
  
  /* 글로벌 텍스트 스타일 - 더 어두운 텍스트 */
  :global(*) {
    color: rgba(15, 15, 15, 0.9);
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    color: rgba(10, 10, 10, 0.95);
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  
  :global(a) {
    color: rgba(25, 25, 25, 0.8);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  :global(a:hover) {
    color: rgba(10, 10, 10, 1);
  }
  
  /* 모바일 전용 스타일 */
  @media (max-width: 1023px) {
    .main-content.sidebar-open {
      margin-left: 0; /* 모바일에서는 오버레이 방식 */
    }
    
    .main-content {
      padding: 1rem;
    }
    
    .content-glass {
      padding: 1.5rem;
      border-radius: 16px;
    }
  }
  
  /* 데스크톱에서만 사이드바 공간 확보 */
  @media (min-width: 1024px) {
    .main-content.sidebar-open {
      margin-left: 14rem;
    }
  }
  
  /* 성능 최적화 */
  .dynamic-pattern,
  .gradient-overlay,
  .glass-reflection {
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      animation: none !important;
      transition: none !important;
    }
    
    .dynamic-pattern {
      transform: none !important;
    }
  }
</style>