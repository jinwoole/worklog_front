<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import SidebarSection from '$lib/components/sidebar/sidebar_section.svelte';
  import '../app.css';
  
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
</script>

<div class="glass-container" bind:this={containerElement}>
  <!-- 화이트 배경 레이어들 -->
  <div class="fixed inset-0 -z-50">
    <!-- 기본 백색 배경 -->
    <div 
      class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"
    ></div>
    
    <!-- 바닷물 반사 효과 1 - 큰 파동 -->
    <div 
      class="absolute inset-0 ocean-reflection ocean-wave-1"
      style="
        background: radial-gradient(
          ellipse 800px 400px at {$mousePosition.x * 100}% {$mousePosition.y * 100}%,
          rgba(59, 130, 246, 0.08) 0%,
          rgba(147, 197, 253, 0.04) 30%,
          transparent 60%
        );
      "
    ></div>
    
    <!-- 바닷물 반사 효과 2 - 작은 파동 -->
    <div 
      class="absolute inset-0 ocean-reflection ocean-wave-2"
      style="
        background: radial-gradient(
          ellipse 600px 300px at {($mousePosition.x * 0.8 + 0.2) * 100}% {($mousePosition.y * 0.7 + 0.3) * 100}%,
          rgba(34, 197, 94, 0.06) 0%,
          rgba(187, 247, 208, 0.03) 40%,
          transparent 70%
        );
      "
    ></div>
    
    <!-- 바닷물 반사 효과 3 - 미세한 반짝임 */
    <div 
      class="absolute inset-0 ocean-sparkle"
      style="
        background: radial-gradient(
          circle 200px at {($mousePosition.x * 1.2 - 0.1) * 100}% {($mousePosition.y * 1.1 - 0.05) * 100}%,
          rgba(16, 185, 129, 0.12) 0%,
          rgba(110, 231, 183, 0.06) 25%,
          transparent 50%
        );
      "
    ></div>
    
    <!-- 햇빛 캐스케이드 효과 -->
    <div class="absolute inset-0 light-cascade"></div>
  </div>
  
  <!-- 사이드바 -->
  <Sidebar isOpen={true}>
    <SidebarSection href="/" active={true}>
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
  </Sidebar>
  
  <!-- 메인 콘텐츠 영역 -->
  <main class="main-content">
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
    background: #fafafa;
  }
  
  .glass-container {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  /* 바닷물 반사 효과 애니메이션 */
  .ocean-reflection {
    animation: oceanFlow 8s ease-in-out infinite;
    transform-origin: center;
  }
  
  .ocean-wave-1 {
    animation-delay: 0s;
    animation-duration: 12s;
  }
  
  .ocean-wave-2 {
    animation-delay: -4s;
    animation-duration: 16s;
  }
  
  .ocean-sparkle {
    animation: sparkle 6s ease-in-out infinite;
    animation-delay: -2s;
  }
  
  /* 햇빛 캐스케이드 효과 */
  .light-cascade {
    background: 
      linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.02) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 40%, rgba(16, 185, 129, 0.015) 60%, transparent 80%);
    animation: lightShimmer 20s linear infinite;
  }
  
  @keyframes oceanFlow {
    0%, 100% { 
      transform: translateX(0) translateY(0) scale(1);
      opacity: 0.8;
    }
    25% { 
      transform: translateX(10px) translateY(-5px) scale(1.02);
      opacity: 1;
    }
    50% { 
      transform: translateX(-5px) translateY(8px) scale(0.98);
      opacity: 0.9;
    }
    75% { 
      transform: translateX(-8px) translateY(-3px) scale(1.01);
      opacity: 0.95;
    }
  }
  
  @keyframes sparkle {
    0%, 100% { 
      transform: scale(1) rotate(0deg);
      opacity: 0.6;
    }
    33% { 
      transform: scale(1.1) rotate(120deg);
      opacity: 1;
    }
    66% { 
      transform: scale(0.9) rotate(240deg);
      opacity: 0.8;
    }
  }
  
  @keyframes lightShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .main-content {
    margin-left: 14rem;
    min-height: 100vh;
    padding: 2rem;
    position: relative;
  }
  
  .content-glass {
    position: relative;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(1.1);
    -webkit-backdrop-filter: blur(20px) saturate(1.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    padding: 2rem;
    min-height: calc(100vh - 4rem);
    box-shadow: 
      inset 0 1px 1px rgba(255, 255, 255, 0.6),
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 4px 12px rgba(59, 130, 246, 0.05);
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
  
  /* 글로벌 텍스트 스타일 - 어두운 텍스트로 변경 */
  :global(*) {
    color: rgba(30, 30, 30, 0.9);
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    color: rgba(15, 15, 15, 0.95);
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  
  :global(a) {
    color: rgba(59, 130, 246, 0.8);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  :global(a:hover) {
    color: rgba(59, 130, 246, 1);
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      padding: 1rem;
    }
    
    .content-glass {
      padding: 1.5rem;
      border-radius: 16px;
    }
  }
  
  /* 성능 최적화 */
  .ocean-reflection,
  .light-cascade,
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
  }
</style>