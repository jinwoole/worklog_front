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
  <div class="relative ice-button-container">
    <!-- 빛 효과가 끊기지 않도록 하는 외부 컨테이너 -->
    <div class="absolute inset-0 rounded-xl overflow-visible">
      <!-- 터키석-코랄 반사 효과 (버튼 경계 밖으로 확장) -->
      <div 
        class="absolute -inset-2 pointer-events-none transition-all duration-500"
        style="
          background: radial-gradient(
            circle at {$mousePosition.x * 100}% {$mousePosition.y * 100}%,
            rgba(6, 182, 212, {isHovering ? 0.12 : 0.05}) 0%,
            rgba(20, 184, 166, {isHovering ? 0.08 : 0.03}) 25%,
            rgba(34, 197, 94, {isHovering ? 0.06 : 0.02}) 50%,
            rgba(251, 146, 60, {isHovering ? 0.04 : 0.01}) 75%,
            transparent 100%
          );
          opacity: {isHovering ? 1 : 0.6};
          filter: blur(8px);
        "
      ></div>
    </div>
    
    <!-- 입체적 얼음 버튼 베이스 -->
    <div 
      class="relative px-4 py-2.5 rounded-xl transition-all duration-300 ice-button"
      style="
        background: {active 
          ? 'rgba(6, 182, 212, 0.08)' 
          : 'rgba(255, 255, 255, 0.12)'};
        backdrop-filter: blur(20px) saturate(1.2);
        -webkit-backdrop-filter: blur(20px) saturate(1.2);
        border: 1px solid {active 
          ? 'rgba(6, 182, 212, 0.25)' 
          : 'rgba(255, 255, 255, 0.30)'};
        box-shadow: 
          inset 0 1px 3px rgba(255, 255, 255, 0.4),
          inset 0 -0.5px 1px rgba(0, 0, 0, 0.02),
          0 2px 6px rgba(0, 0, 0, 0.04),
          0 1px 3px rgba(0, 0, 0, 0.02),
          0 0 12px rgba({active ? '6, 182, 212' : '255, 255, 255'}, {active ? 0.08 : 0.03});
        transform: {isHovering 
          ? 'translateY(-1px) scale(1.01)' 
          : 'translateY(0) scale(1)'};
      "
    >
      <!-- 아름다운 투명도 기반 반사 -->
      <div 
        class="absolute -inset-1 pointer-events-none transition-all duration-400 rounded-xl"
        style="
          background: radial-gradient(
            circle at {$mousePosition.x * 100}% {$mousePosition.y * 100}%,
            rgba(255, 255, 255, {isHovering ? 0.20 : 0.08}) 0%,
            rgba(255, 255, 255, {isHovering ? 0.12 : 0.04}) 40%,
            rgba(255, 255, 255, {isHovering ? 0.06 : 0.02}) 70%,
            transparent 100%
          );
          opacity: {isHovering ? 0.9 : 0.6};
        "
      ></div>
      
      <!-- 액티브 상태 색상 힌트 -->
      {#if active}
        <div 
          class="absolute inset-0 pointer-events-none transition-all duration-300 rounded-xl"
          style="
            background: rgba(6, 182, 212, {isHovering ? 0.06 : 0.03});
            opacity: {isHovering ? 0.8 : 0.5};
          "
        ></div>
      {/if}
      
      <!-- 호버 시 부드러운 글로우 -->
      {#if isHovering}
        <div 
          class="absolute inset-0 pointer-events-none rounded-xl"
          style="
            background: rgba(255, 255, 255, 0.08);
            animation: gentle-glow 2s ease-in-out infinite;
          "
        ></div>
      {/if}
      
      <!-- 상단 하이라이트 -->
      <div 
        class="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
        style="
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
          border-radius: 12px 12px 0 0;
        "
      ></div>
      
      <!-- 텍스트 콘텐츠 -->
      <div 
        class="relative z-20 font-medium transition-all duration-200"
        style="
          color: {active 
            ? 'rgba(6, 182, 212, 0.92)' 
            : 'rgba(30, 30, 30, 0.85)'};
          text-shadow: 0 0.5px 1px rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        "
        class:group-hover:text-slate-800={!active}
        class:group-hover:text-cyan-600={active}
      >
        <slot />
      </div>
    </div>
    
    <!-- 액티브 상태 미묘한 글로우 -->
    {#if active}
      <div 
        class="absolute -inset-2 rounded-xl pointer-events-none -z-10"
        style="
          background: rgba(6, 182, 212, 0.04);
          filter: blur(12px);
          opacity: 0.7;
        "
      ></div>
    {/if}
  </div>
</a>

<style>
  /* 버튼 기본 스타일 */
  .ice-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 부드러운 포커스 효과 */
  a:focus-visible {
    outline: none;
  }
  
  a:focus-visible .ice-button::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 14px;
    border: 1.5px solid rgba(59, 130, 246, 0.5);
    opacity: 0;
    animation: focus-fade 0.2s ease-out forwards;
  }
  
  @keyframes focus-fade {
    to {
      opacity: 1;
    }
  }
  
  /* 클릭 애니메이션 */
  a:active .ice-button {
    transform: translateY(0px) scale(0.99) !important;
    box-shadow: 
      inset 0 1px 2px rgba(255, 255, 255, 0.5),
      inset 0 -0.5px 1px rgba(0, 0, 0, 0.03),
      0 1px 3px rgba(0, 0, 0, 0.06) !important;
  }
  
  /* 호버 텍스트 스타일 */
  .group-hover\:text-slate-800:hover {
    color: rgba(30, 41, 59, 0.9) !important;
  }
  
  .group-hover\:text-cyan-600:hover {
    color: rgba(8, 145, 178, 0.95) !important;
  }
  
  /* 부드러운 글로우 애니메이션 */
  @keyframes gentle-glow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  /* 버튼 컨테이너 오버플로우 설정 */
  .ice-button-container {
    overflow: visible;
  }
  
  /* 모션 감소 설정 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
    
    .ice-button {
      transform: none !important;
    }
  }
</style>