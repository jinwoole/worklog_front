<!-- src/lib/components/sidebar/sidebar_section.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  
  export let href: string | undefined = undefined;
  export let onClick: (() => void) | undefined = undefined;
  export let disabled = false;
  export let active = false;
  
  // 전역 마우스 위치
  const mousePosition = getContext<Readable<{ x: number; y: number }>>('mousePosition') || 
    { subscribe: () => () => {} };
  
  let isHovering = false;
  let element: HTMLElement;
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };
</script>

<a 
  {href}
  bind:this={element}
  on:click={handleClick}
  on:mouseenter={() => isHovering = true}
  on:mouseleave={() => isHovering = false}
  class="block relative group"
  class:pointer-events-none={disabled}
  class:opacity-30={disabled}
>
  <div class="relative">
    <!-- 메인 유리 패널 -->
    <div 
      class="relative px-5 py-3.5 rounded-2xl overflow-hidden transition-all duration-300"
      style="
        background: {active 
          ? 'rgba(251, 146, 60, 0.08)' 
          : 'rgba(255, 255, 255, 0.04)'};
        backdrop-filter: blur(20px) saturate(1.2);
        -webkit-backdrop-filter: blur(20px) saturate(1.2);
        border: 1px solid {active 
          ? 'rgba(251, 146, 60, 0.2)' 
          : 'rgba(255, 255, 255, 0.1)'};
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.1),
          0 2px 8px rgba(0, 0, 0, 0.05);
        transform: {isHovering ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)'};
      "
    >
      <!-- 전역 빛 반사 효과 -->
      <div 
        class="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style="
          background: radial-gradient(
            circle at {$mousePosition.x * 100}% {$mousePosition.y * 100}%,
            rgba(255, 255, 255, {isHovering ? 0.15 : 0.05}) 0%,
            transparent 100%
          );
          opacity: 0.8;
        "
      ></div>
      
      <!-- 호버 시 로컬 하이라이트 -->
      {#if isHovering}
        <div 
          class="absolute inset-0 pointer-events-none animate-pulse"
          style="
            background: radial-gradient(
              circle at center,
              {active ? 'rgba(251, 146, 60, 0.1)' : 'rgba(255, 255, 255, 0.08)'} 0%,
              transparent 70%
            );
          "
        ></div>
      {/if}
      
      <!-- 상단 광택 -->
      <div 
        class="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style="
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08) 0%,
            transparent 100%
          );
        "
      ></div>
      
      <!-- 텍스트 콘텐츠 -->
      <div 
        class="relative z-10 font-medium transition-all duration-300"
        style="
          color: {active 
            ? 'rgba(251, 146, 60, 0.95)' 
            : 'rgba(255, 255, 255, 0.7)'};
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        "
        class:group-hover:text-white={!active}
        class:group-hover:text-orange-400={active}
      >
        <slot />
      </div>
    </div>
    
    <!-- 액티브 상태 글로우 -->
    {#if active}
      <div 
        class="absolute -inset-1 rounded-2xl pointer-events-none -z-10"
        style="
          background: radial-gradient(
            circle at 50% 50%,
            rgba(251, 146, 60, 0.15) 0%,
            transparent 70%
          );
          filter: blur(16px);
        "
      ></div>
    {/if}
  </div>
</a>

<style>
  /* 부드러운 포커스 효과 */
  a:focus-visible {
    outline: none;
  }
  
  a:focus-visible > div::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 20px;
    border: 2px solid rgba(251, 146, 60, 0.5);
    opacity: 0;
    animation: focus-fade 0.3s ease-out forwards;
  }
  
  @keyframes focus-fade {
    to {
      opacity: 1;
    }
  }
  
  /* 클릭 애니메이션 */
  a:active > div > div:first-child {
    transform: scale(0.98) !important;
  }
  
  /* 호버 텍스트 스타일 */
  .group-hover\:text-white:hover {
    color: rgba(255, 255, 255, 0.9) !important;
  }
  
  .group-hover\:text-orange-400:hover {
    color: rgba(251, 146, 60, 1) !important;
  }
  
  /* 부드러운 펄스 애니메이션 */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* 모션 감소 설정 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
</style>