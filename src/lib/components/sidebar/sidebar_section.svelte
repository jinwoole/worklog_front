<!-- src/lib/components/sidebar/sidebar_section.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';
  import { page } from '$app/stores';
  import type { Readable } from 'svelte/store';
  
  export let href: string | undefined = undefined;
  export let onClick: (() => void) | undefined = undefined;
  export let disabled = false;
  export let active = false; // 수동 활성화용 (deprecated)
  
  // 전역 마우스 위치
  const mousePosition = getContext<Readable<{ x: number; y: number }>>('mousePosition') || 
    { subscribe: () => () => {} };
  
  let isHovering = false;
  let element: HTMLElement;
  
  // 현재 라우트에 기반한 활성 상태 자동 감지
  $: isActive = href ? $page.url.pathname === href : active;
  
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
  class="block relative group transition-opacity duration-300"
  class:pointer-events-none={disabled}
  class:opacity-30={disabled}
  class:opacity-40={!isActive && !isHovering && !disabled}
  class:opacity-100={isActive || isHovering}
>
  <div class="relative transparent-button-container">
    <!-- 투명 버튼 베이스 - 칼날같은 사각형 -->
    <div 
      class="relative px-4 py-3 transition-all duration-300 transparent-button blade-button"
      style="
        background: rgba(255, 255, 255, {isActive ? 0.75 : (isHovering ? 0.55 : 0.15)});
        backdrop-filter: blur(16px) saturate(1.2);
        -webkit-backdrop-filter: blur(16px) saturate(1.2);
        border: 1px solid rgba(255, 255, 255, {isActive ? 0.85 : (isHovering ? 0.65 : 0.25)});
        box-shadow: 
          inset 0 1px 2px rgba(255, 255, 255, {isActive ? 0.95 : (isHovering ? 0.75 : 0.30)}),
          0 2px 12px rgba(0, 0, 0, {isActive ? 0.20 : (isHovering ? 0.12 : 0.03)}),
          0 0 0 rgba(255, 255, 255, {isActive ? 0.6 : 0});
        transform: {isHovering || isActive
          ? 'translateY(-2px) scale(1.03)' 
          : 'translateY(0) scale(1)'};
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      "
    >      
      <!-- 활성 상태 좌측 인디케이터 -->
      {#if isActive}
        <div 
          class="absolute top-1/2 left-0 w-1 h-6 -translate-y-1/2 rounded-r-full transition-all duration-300"
          style="
            background: linear-gradient(
              180deg,
              rgba(245, 158, 11, 0.9) 0%,
              rgba(217, 119, 6, 0.9) 100%
            );
            box-shadow: 
              0 0 8px rgba(245, 158, 11, 0.5),
              inset 0 1px 1px rgba(255, 255, 255, 0.3);
          "
        ></div>
      {/if}
      
      <!-- 상단 하이라이트 - 칼날 효과 -->
      <div 
        class="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style="
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, {isActive ? 0.6 : (isHovering ? 0.45 : 0.15)}) 0%,
            rgba(255, 255, 255, {isActive ? 0.35 : (isHovering ? 0.25 : 0.08)}) 50%,
            transparent 100%
          );
        "
      ></div>
      
      <!-- 호버 시 추가 글로우 -->
      {#if isHovering}
        <div 
          class="absolute inset-0 pointer-events-none"
          style="
            background: rgba(255, 255, 255, 0.06);
            animation: gentle-pulse 2s ease-in-out infinite;
          "
        ></div>
      {/if}
      
      <!-- 텍스트 콘텐츠 -->
      <div 
        class="relative z-20 font-medium transition-all duration-200"
        style="
          color: rgba(15, 15, 15, {isActive ? 1.0 : (isHovering ? 0.95 : 0.65)});
          text-shadow: 0 0.5px 1px rgba(255, 255, 255, {isActive ? 1.0 : 0.8});
          font-size: 0.875rem;
          font-weight: {isActive ? 600 : 500};
          transform: {isHovering || isActive ? 'scale(1.02)' : 'scale(1)'};
        "
      >
        <slot />
      </div>
    </div>
    
    <!-- 액티브 상태 미묘한 외부 글로우 - 사각형 -->
    {#if isActive}
      <div 
        class="absolute -inset-1 pointer-events-none -z-10"
        style="
          background: rgba(255, 255, 255, 0.08);
          filter: blur(8px);
          opacity: 0.6;
        "
      ></div>
    {/if}
  </div>
</a>

<style>
  /* 버튼 기본 스타일 - 칼날같은 사각형 */
  .transparent-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .blade-button {
    border-radius: 0;
    position: relative;
  }
  
  /* 칼날 효과를 위한 미묘한 섀도우 */
  .blade-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 
      inset 1px 0 0 rgba(255, 255, 255, 0.3),
      inset -1px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(255, 255, 255, 0.2);
    pointer-events: none;
  }
  
  /* 부드러운 포커스 효과 */
  a:focus-visible {
    outline: none;
  }
  
  a:focus-visible .transparent-button::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 1.5px solid rgba(0, 0, 0, 0.2);
    opacity: 0;
    animation: focus-fade 0.2s ease-out forwards;
  }
  
  @keyframes focus-fade {
    to {
      opacity: 1;
    }
  }
  
  /* 클릭 애니메이션 - 더 극적인 투명도 변화 */
  a:active .transparent-button {
    transform: translateY(0px) scale(0.97) !important;
    background: rgba(255, 255, 255, 0.8) !important;
    box-shadow: 
      inset 0 1px 3px rgba(255, 255, 255, 0.9),
      0 1px 4px rgba(0, 0, 0, 0.06) !important;
  }
  
  /* 부드러운 펄스 애니메이션 */
  @keyframes gentle-pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  /* 버튼 컨테이너 오버플로우 설정 */
  .transparent-button-container {
    overflow: visible;
  }
  
  /* 모션 감소 설정 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
    
    .transparent-button {
      transform: none !important;
    }
  }
</style>