<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Sidebar from '$lib/components/sidebar/sidebar.svelte';
  import SidebarSection from '$lib/components/sidebar/sidebar_section.svelte';
  import '../app.css';
  
  // 전역 마우스 위치 스토어
  const mousePosition = writable({ x: 0.5, y: 0.5 });
  
  // 하위 컴포넌트에서 사용할 수 있도록 context 설정
  setContext('mousePosition', mousePosition);
  
  let containerElement: HTMLElement;
  
  onMount(() => {
    let rafId: number;
    let currentX = 0.5;
    let currentY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    };
    
    // 부드럽고 빠른 마우스 추적
    const updatePosition = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      // 거리가 가까우면 즉시 업데이트, 멀면 부드럽게
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance > 0.1 ? 0.15 : 0.25;
      
      currentX += dx * speed;
      currentY += dy * speed;
      
      // 매우 작은 차이는 무시 (성능 최적화)
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        mousePosition.set({ x: currentX, y: currentY });
      }
      
      rafId = requestAnimationFrame(updatePosition);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    updatePosition();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="glass-container" bind:this={containerElement}>
  <!-- 배경 레이어들 -->
  <div class="fixed inset-0 -z-50">
    <!-- 기본 어두운 배경 -->
    <div 
      class="absolute inset-0"
      style="
        background: linear-gradient(
          135deg,
          rgb(15, 15, 18) 0%,
          rgb(20, 20, 23) 50%,
          rgb(15, 15, 18) 100%
        );
      "
    ></div>
    
    <!-- 미묘한 주황색 액센트 -->
    <div 
      class="absolute inset-0 opacity-[0.02]"
      style="
        background: radial-gradient(
          ellipse at 30% 70%,
          rgba(251, 146, 60, 0.2) 0%,
          transparent 40%
        );
      "
    ></div>
    
    <!-- 움직이는 빛 (전체 화면) -->
    <div 
      class="absolute inset-0 opacity-50"
      style="
        background: radial-gradient(
          circle at {$mousePosition.x * 100}% {$mousePosition.y * 100}%,
          rgba(255, 255, 255, 0.12) 0%,
          rgba(251, 146, 60, 0.03) 25%,
          transparent 50%
        );
        filter: blur(40px);
        will-change: background;
        transform: translateZ(0);
      "
    ></div>
    
    <!-- 보조 빛 효과 -->
    <div 
      class="absolute inset-0 opacity-30"
      style="
        background: radial-gradient(
          circle at {(1 - $mousePosition.x) * 100}% {(1 - $mousePosition.y) * 100}%,
          rgba(255, 255, 255, 0.08) 0%,
          transparent 60%
        );
        filter: blur(80px);
        will-change: background;
        transform: translateZ(0);
      "
    ></div>
    
    <!-- 미세한 그레인 텍스처 -->
    <div 
      class="absolute inset-0 opacity-[0.02]"
      style="
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIC8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=');
      "
    ></div>
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
      <!-- 빛 반사 효과 (콘텐츠 영역) -->
      <div 
        class="absolute inset-0 pointer-events-none opacity-20 rounded-[24px]"
        style="
          background: radial-gradient(
            circle at {$mousePosition.x * 100}% {$mousePosition.y * 100}%,
            rgba(255, 255, 255, 0.08) 0%,
            transparent 60%
          );
          will-change: background;
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
    background: #0f0f12;
  }
  
  .glass-container {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  .main-content {
    margin-left: 18rem;
    min-height: 100vh;
    padding: 2rem;
    position: relative;
  }
  
  .content-glass {
    position: relative;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(40px) saturate(1.1);
    -webkit-backdrop-filter: blur(40px) saturate(1.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 2rem;
    min-height: calc(100vh - 4rem);
    box-shadow: 
      inset 0 1px 1px rgba(255, 255, 255, 0.05),
      0 20px 40px rgba(0, 0, 0, 0.3);
    overflow: hidden;
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
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
  
  /* 글로벌 텍스트 스타일 */
  :global(*) {
    color: rgba(255, 255, 255, 0.85);
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  
  :global(a) {
    color: rgba(251, 146, 60, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  :global(a:hover) {
    color: rgba(251, 146, 60, 0.9);
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
  * {
    will-change: auto;
  }
  
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      animation: none !important;
      transition: none !important;
    }
  }
</style>