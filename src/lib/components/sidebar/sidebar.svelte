<!-- src/lib/components/sidebar/sidebar.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  
  export let isOpen = false;
  
  // 부모에서 전달받은 마우스 위치 스토어
  const mousePosition = getContext<Readable<{ x: number; y: number }>>('mousePosition') || 
    { subscribe: () => () => {} };
  
  let mouseX = 0.5;
  let mouseY = 0.5;
  
  $: if ($mousePosition) {
    mouseX = $mousePosition.x;
    mouseY = $mousePosition.y;
  }
</script>

<aside 
  class="fixed left-0 top-0 h-screen w-56 z-40 transition-transform duration-700 ease-out"
  class:-translate-x-full={!isOpen}
>
  <!-- 다층 유리 효과 -->
  <div class="relative h-full">
    <!-- 남태평양 테마 배경 -->
    <div 
      class="absolute inset-0"
      style="
        background: linear-gradient(
          180deg,
          rgba(14, 165, 233, 0.06) 0%,
          rgba(6, 182, 212, 0.05) 30%,
          rgba(20, 184, 166, 0.04) 60%,
          rgba(34, 197, 94, 0.03) 100%
        );
      "
    ></div>
    
    <!-- 첫 번째 유리층 - 기본 구조 -->
    <div 
      class="absolute inset-0"
      style="
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(24px) saturate(1.2);
        -webkit-backdrop-filter: blur(24px) saturate(1.2);
        border-right: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.2),
          3px 0 20px rgba(0, 0, 0, 0.06);
      "
    ></div>
    
    <!-- 터키석 바다 반사 효과 -->
    <div 
      class="absolute inset-0 opacity-25"
      style="
        background: radial-gradient(
          ellipse at {mouseX * 100}% {mouseY * 100}%,
          rgba(6, 182, 212, 0.08) 0%,
          rgba(20, 184, 166, 0.06) 30%,
          rgba(34, 197, 94, 0.04) 60%,
          transparent 80%
        );
      "
    ></div>
    
    <!-- 산호초 따뜻한 액센트 -->
    <div 
      class="absolute inset-0 opacity-12"
      style="
        background: linear-gradient(
          135deg,
          transparent 0%,
          rgba(251, 146, 60, 0.02) 25%,
          rgba(245, 158, 11, 0.03) 50%,
          rgba(6, 182, 212, 0.02) 75%,
          transparent 100%
        );
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
    <div class="relative h-full px-4 py-6 overflow-y-auto overflow-x-hidden">
      <div class="space-y-2">
        <slot />
      </div>
    </div>
  </div>
</aside>

<!-- 모바일 배경 오버레이 -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
    on:click={() => isOpen = false}
    on:keydown={(e) => e.key === 'Escape' && (isOpen = false)}
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
</style>