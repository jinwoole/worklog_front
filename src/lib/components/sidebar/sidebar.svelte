<!-- src/lib/components/sidebar/sidebar.svelte -->
<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';
  
  export let isOpen = false;
  
  // 부모에서 전달받은 마우스 위치 스토어
  const mousePosition = getContext<Readable<{ x: number; y: number }>>('mousePosition') || 
    { subscribe: () => () => {} };
  
  let mouseX = 0.5;
  let mouseY = 0.5;
  let isMobile = false;
  
  $: if ($mousePosition) {
    mouseX = $mousePosition.x;
    mouseY = $mousePosition.y;
  }
  
  // 화면 크기 감지
  onMount(() => {
    const checkScreenSize = () => {
      isMobile = window.innerWidth < 1024; // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  });
  
  const toggleSidebar = () => {
    isOpen = !isOpen;
  };
</script>

<!-- 사이드바가 닫혀있을 때만 보이는 햄버거 버튼 -->
{#if !isOpen}
  <button
    on:click={toggleSidebar}
    class="fixed top-6 left-6 z-50 p-3 rounded-xl transition-all duration-300 hover:scale-110"
    style="
      background: rgba(255, 245, 230, 0.85);
      backdrop-filter: blur(16px) saturate(1.2);
      -webkit-backdrop-filter: blur(16px) saturate(1.2);
      border: 1px solid rgba(255, 235, 210, 0.7);
      box-shadow: 
        0 8px 24px rgba(160, 100, 40, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.9);
    "
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      class="text-amber-800/80 transition-all duration-300"
    >
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
{/if}

<aside 
  class="fixed left-0 top-0 h-screen w-56 z-40 transition-transform duration-300 ease-out"
  class:-translate-x-full={!isOpen}
>
  <!-- 다층 유리 효과 -->
  <div class="relative h-full">
    <!-- 동적 안개 배경 - 더 강화된 주황빛 베이스 -->
    <div 
      class="absolute inset-0"
      style="
        background: linear-gradient(
          180deg,
          rgba(255, 235, 210, 0.45) 0%,
          rgba(250, 230, 200, 0.40) 30%,
          rgba(245, 225, 190, 0.35) 60%,
          rgba(240, 220, 180, 0.30) 100%
        );
      "
    ></div>
    
    <!-- 첫 번째 유리층 - 더 강화된 주황빛 구조 -->
    <div 
      class="absolute inset-0"
      style="
        background: rgba(255, 240, 220, 0.50);
        backdrop-filter: blur(22px) saturate(1.4);
        -webkit-backdrop-filter: blur(22px) saturate(1.4);
        border-right: 1px solid rgba(255, 230, 200, 0.65);
        box-shadow: 
          inset 0 1px 1px rgba(255, 235, 210, 0.8),
          3px 0 25px rgba(160, 100, 40, 0.12);
      "
    ></div>
    
    <!-- 동적 안개 효과 1 - 더 강화된 맑은 하늘색 안개 -->
    <div 
      class="absolute inset-0 opacity-55 fog-layer-1"
      style="
        background: radial-gradient(
          ellipse 400px 300px at 30% 20%,
          rgba(200, 235, 255, 0.35) 0%,
          rgba(180, 225, 250, 0.25) 25%,
          rgba(160, 215, 245, 0.18) 50%,
          transparent 70%
        );
      "
    ></div>
    
    <!-- 동적 안개 효과 2 - 강화된 자주빛 안개 -->
    <div 
      class="absolute inset-0 opacity-40 fog-layer-2"
      style="
        background: radial-gradient(
          ellipse 350px 250px at 70% 80%,
          rgba(240, 220, 255, 0.22) 0%,
          rgba(230, 200, 250, 0.15) 30%,
          rgba(220, 180, 245, 0.10) 50%,
          transparent 65%
        );
      "
    ></div>
    
    <!-- 강화된 에메랄드 안개 -->
    <div 
      class="absolute inset-0 opacity-35 fog-layer-3"
      style="
        background: radial-gradient(
          ellipse 300px 200px at 50% 50%,
          rgba(200, 255, 230, 0.20) 0%,
          rgba(180, 250, 220, 0.14) 25%,
          rgba(160, 245, 210, 0.10) 45%,
          transparent 60%
        );
      "
    ></div>
    
    <!-- 강화된 노이즈 안개 - 생생한 톤 -->
    <div 
      class="absolute inset-0 opacity-30 noise-fog"
      style="
        background-image: 
          radial-gradient(circle at 25% 25%, rgba(230, 220, 255, 0.08) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(255, 230, 220, 0.07) 1px, transparent 1px),
          radial-gradient(circle at 50% 10%, rgba(220, 255, 230, 0.06) 1px, transparent 1px);
        background-size: 35px 35px, 25px 25px, 20px 20px;
      "
    ></div>
    
    <!-- 엣지 하이라이트 -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- 상단 하이라이트 -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <!-- 좌측 하이라이트 -->
      <div class="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"></div>
      <!-- 우측 소프트 섀도우 -->
      <div class="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-black/5 via-black/2 to-transparent"></div>
    </div>
    
    <!-- 콘텐츠 영역 -->
    <div class="relative h-full px-4 py-6 overflow-y-auto overflow-x-hidden flex flex-col">
      <!-- 사이드바 내부 헤더 (닫기 버튼 포함) -->
      <div class="flex justify-between items-center mb-6 -mx-1">
        <!-- 로고/타이틀 영역 -->
        <div class="flex items-center space-x-2">
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            style="
              background: linear-gradient(135deg, rgba(255, 240, 220, 0.8) 0%, rgba(255, 235, 210, 0.6) 100%);
              border: 1px solid rgba(255, 230, 200, 0.8);
              box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9);
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-amber-700">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <span class="text-sm font-semibold text-amber-800/90 tracking-wide">WorkLog</span>
        </div>
        
        <!-- 닫기 버튼 -->
        <button
          on:click={toggleSidebar}
          class="p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
          style="
            background: rgba(255, 240, 220, 0.6);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 230, 200, 0.7);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8);
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="text-amber-800/70 group-hover:text-amber-800 transition-colors duration-200"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="space-y-2 flex-1">
        <slot />
      </div>
    </div>
  </div>
</aside>

<!-- 모바일 배경 오버레이 -->
{#if isMobile && isOpen}
  <div 
    class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30"
    on:click={toggleSidebar}
    on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
    role="button"
    tabindex="0"
  ></div>
{/if}

<style>
  /* 커스텀 스크롤바 - 화이트 테마용 */
  aside ::-webkit-scrollbar {
    width: 4px;
  }
  
  aside ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  aside ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 2px;
  }
  
  aside ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.12);
  }
  
  /* Firefox 스크롤바 */
  aside {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.08) transparent;
  }
  
  /* 동적 안개 효과 애니메이션 */
  .fog-layer-1 {
    animation: fogDrift1 20s ease-in-out infinite;
    transform-origin: 30% 20%;
  }
  
  .fog-layer-2 {
    animation: fogDrift2 25s ease-in-out infinite;
    animation-delay: -10s;
    transform-origin: 70% 80%;
  }
  
  .fog-layer-3 {
    animation: fogDrift3 18s ease-in-out infinite;
    animation-delay: -5s;
    transform-origin: 50% 50%;
  }
  
  .noise-fog {
    animation: noiseFog 30s linear infinite;
  }
  
  @keyframes fogDrift1 {
    0%, 100% { 
      transform: translate(0, 0) scale(1);
      opacity: 0.45;
    }
    25% { 
      transform: translate(-3px, -2px) scale(1.05);
      opacity: 0.60;
    }
    50% { 
      transform: translate(2px, 3px) scale(0.95);
      opacity: 0.35;
    }
    75% { 
      transform: translate(-1px, -3px) scale(1.02);
      opacity: 0.50;
    }
  }
  
  @keyframes fogDrift2 {
    0%, 100% { 
      transform: translate(0, 0) scale(1);
      opacity: 0.40;
    }
    33% { 
      transform: translate(2px, -1px) scale(1.03);
      opacity: 0.55;
    }
    66% { 
      transform: translate(-3px, 2px) scale(0.97);
      opacity: 0.30;
    }
  }
  
  @keyframes fogDrift3 {
    0%, 100% { 
      transform: translate(0, 0) scale(1) rotate(0deg);
      opacity: 0.35;
    }
    40% { 
      transform: translate(1px, -2px) scale(1.04) rotate(0.5deg);
      opacity: 0.50;
    }
    80% { 
      transform: translate(-2px, 1px) scale(0.96) rotate(-0.3deg);
      opacity: 0.40;
    }
  }
  
  @keyframes noiseFog {
    0% { 
      background-position: 0px 0px, 0px 0px, 0px 0px;
      opacity: 0.30;
    }
    25% { 
      background-position: 8px -3px, -5px 6px, 3px -2px;
      opacity: 0.40;
    }
    50% { 
      background-position: -4px 8px, 6px -2px, -3px 5px;
      opacity: 0.25;
    }
    75% { 
      background-position: 5px -6px, -8px 4px, 2px -4px;
      opacity: 0.35;
    }
    100% { 
      background-position: 0px 0px, 0px 0px, 0px 0px;
      opacity: 0.30;
    }
  }
  
  /* 성능 최적화 */
  .fog-layer-1,
  .fog-layer-2,
  .fog-layer-3,
  .noise-fog {
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  
  /* 모션 감소 설정 */
  @media (prefers-reduced-motion: reduce) {
    .fog-layer-1,
    .fog-layer-2,
    .fog-layer-3,
    .noise-fog {
      animation: none !important;
      transform: none !important;
    }
  }
</style>