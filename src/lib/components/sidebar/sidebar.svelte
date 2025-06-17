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
  class="fixed left-0 top-0 h-screen w-72 z-40 transition-transform duration-700 ease-out"
  class:-translate-x-full={!isOpen}
>
  <!-- 배경 블러 레이어 -->
  <div class="absolute inset-0 backdrop-blur-2xl"></div>
  
  <!-- 다층 유리 효과 -->
  <div class="relative h-full">
    <!-- 첫 번째 유리층 - 기본 구조 -->
    <div 
      class="absolute inset-0"
      style="
        background: rgba(255, 255, 255, 0.02);
        border-right: 1px solid rgba(255, 255, 255, 0.08);
      "
    ></div>
    
    <!-- 두 번째 유리층 - 빛의 굴절 -->
    <div 
      class="absolute inset-0 opacity-40"
      style="
        background: radial-gradient(
          ellipse at {mouseX * 100}% {mouseY * 100}%,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 70%
        );
        will-change: background;
      "
    ></div>
    
    <!-- 주황색 액센트 (매우 미묘하게) -->
    <div 
      class="absolute inset-0 opacity-[0.05]"
      style="
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(251, 146, 60, 0.1) 50%,
          transparent 100%
        );
      "
    ></div>
    
    <!-- 노이즈 텍스처 -->
    <div 
      class="absolute inset-0 opacity-[0.01]"
      style="
        background-image: 
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px);
      "
    ></div>
    
    <!-- 엣지 하이라이트 -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- 상단 하이라이트 -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <!-- 우측 소프트 섀도우 -->
      <div class="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent"></div>
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
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
    on:click={() => isOpen = false}
    on:keydown={(e) => e.key === 'Escape' && (isOpen = false)}
    role="button"
    tabindex="0"
  ></div>
{/if}

<style>
  /* 커스텀 스크롤바 */
  aside ::-webkit-scrollbar {
    width: 5px;
  }
  
  aside ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  aside ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2.5px;
  }
  
  aside ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  /* Firefox 스크롤바 */
  aside {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
  }
</style>