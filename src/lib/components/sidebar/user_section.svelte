<!-- src/lib/components/sidebar/user_section.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { userStore, logout } from '$lib/stores/user';
  
  // prop 대신 스토어에서 사용자 정보를 가져옴
  $: user = $userStore;
  
  let showDropdown = false;
  
  const handleLoginClick = () => {
    goto('/login');
  };
  
  const handleLogoutClick = async () => {
    const success = await logout();
    if (success) {
      goto('/login');
      showDropdown = false;
    }
  };
  
  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };
  
  // 외부 클릭시 드롭다운 닫기
  const handleClickOutside = (node) => {
    const handleClick = (event) => {
      if (!node.contains(event.target)) {
        showDropdown = false;
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  };
</script>

<div class="user-section" use:handleClickOutside>
  {#if user}
    <!-- 로그인된 상태 - 애플 스타일 -->
    <div class="user-menu">
      <button 
        class="user-button"
        on:click={toggleDropdown}
      >
        <div class="user-avatar">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span class="user-name">{user.name || 'User'}</span>
        <svg 
          class="chevron" 
          class:rotated={showDropdown}
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      
      {#if showDropdown}
        <div class="dropdown">
          <button class="dropdown-item" on:click={handleLogoutClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            Sign Out
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <!-- 로그인되지 않은 상태 -->
    <div class="auth-buttons">
      <button class="sign-in-button" on:click={handleLoginClick}>
        Sign In
      </button>
    </div>
  {/if}
</div> 
              ? 'translateY(-1px) scale(1.02)' 
              : 'translateY(0) scale(1)'};
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          "
        >
          <!-- 상단 하이라이트 -->
          <div 
            class="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
            style="
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, {isHovering ? 0.35 : 0.20}) 0%,
                rgba(255, 255, 255, {isHovering ? 0.18 : 0.10}) 50%,
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
          
          <!-- 유저 정보 콘텐츠 -->
          <div class="relative z-20 flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <!-- 유저 이름 -->
              <div 
                class="font-medium transition-all duration-200 truncate"
                style="
                  color: rgba(15, 15, 15, {isHovering ? 0.95 : 0.85});
                  text-shadow: 0 0.5px 1px rgba(255, 255, 255, 0.8);
                  font-size: 0.875rem;
                  font-weight: 500;
                "
              >
                {user?.name || user?.email || 'User'}
              </div>
              
              <!-- 상태 표시 -->
              <div 
                class="text-xs mt-1 transition-all duration-200"
                style="
                  color: rgba(15, 15, 15, {isHovering ? 0.75 : 0.55});
                  text-shadow: 0 0.5px 1px rgba(255, 255, 255, 0.6);
                "
              >
                Online
              </div>
            </div>
            
            <!-- 로그아웃 버튼 -->
            <button
              type="button"
              on:click={handleLogoutClick}
              on:mouseenter={() => isLogoutHovering = true}
              on:mouseleave={() => isLogoutHovering = false}
              class="ml-2 p-1 transition-all duration-200 logout-button"
              style="
                background: rgba(255, 255, 255, {isLogoutHovering ? 0.6 : 0.2});
                border: 1px solid rgba(255, 255, 255, {isLogoutHovering ? 0.7 : 0.3});
                border-radius: 4px;
                color: rgba(15, 15, 15, {isLogoutHovering ? 0.85 : 0.6});
                transform: {isLogoutHovering ? 'scale(1.1)' : 'scale(1)'};
                box-shadow: 
                  inset 0 1px 1px rgba(255, 255, 255, {isLogoutHovering ? 0.8 : 0.4}),
                  0 1px 3px rgba(0, 0, 0, {isLogoutHovering ? 0.15 : 0.05});
              "
              title="로그아웃"
            >
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                style="display: block;"
              >
                <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
                <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- 로그인되지 않은 상태 -->
    <button
      type="button"
      on:click={handleLoginClick}
      on:mouseenter={() => isHovering = true}
      on:mouseleave={() => isHovering = false}
      class="block w-full relative group"
    >
      <div class="relative transparent-button-container">
        <!-- 로그인 버튼 베이스 -->
        <div 
          class="relative px-4 py-3 transition-all duration-300 transparent-button blade-button"
          style="
            background: rgba(255, 255, 255, {isHovering ? 0.45 : 0.15});
            backdrop-filter: blur(12px) saturate(1.1);
            -webkit-backdrop-filter: blur(12px) saturate(1.1);
            border: 1px solid rgba(255, 255, 255, {isHovering ? 0.55 : 0.25});
            box-shadow: 
              inset 0 1px 2px rgba(255, 255, 255, {isHovering ? 0.65 : 0.30}),
              0 2px 8px rgba(0, 0, 0, {isHovering ? 0.10 : 0.03});
            transform: {isHovering 
              ? 'translateY(-2px) scale(1.03)' 
              : 'translateY(0) scale(1)'};
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          "
        >
          <!-- 상단 하이라이트 -->
          <div 
            class="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
            style="
              background: linear-gradient(
                180deg,
                rgba(255, 255, 255, {isHovering ? 0.35 : 0.15}) 0%,
                rgba(255, 255, 255, {isHovering ? 0.18 : 0.08}) 50%,
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
          
          <!-- 로그인 텍스트 -->
          <div class="relative z-20 flex items-center justify-center">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              class="mr-2"
              style="
                color: rgba(15, 15, 15, {isHovering ? 0.85 : 0.65});
                transform: {isHovering ? 'scale(1.1)' : 'scale(1)'};
                transition: all 0.2s ease;
              "
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span 
              class="font-medium transition-all duration-200"
              style="
                color: rgba(15, 15, 15, {isHovering ? 0.95 : 0.70});
                text-shadow: 0 0.5px 1px rgba(255, 255, 255, 0.8);
                font-size: 0.875rem;
                font-weight: 500;
                transform: {isHovering ? 'scale(1.02)' : 'scale(1)'};
              "
            >
              로그인
            </span>
          </div>
        </div>
      </div>
    </button>
  {/if}
</div>

<style>
  .user-section {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    padding: 1rem 0;
  }
  
  .transparent-button {
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
  }
  
  .blade-button {
    border-radius: 6px;
  }
  
  .logout-button {
    cursor: pointer;
    flex-shrink: 0;
  }
  
  .logout-button:hover {
    transform: scale(1.1);
  }
  
  @keyframes gentle-pulse {
    0%, 100% { 
      opacity: 0.06;
    }
    50% { 
      opacity: 0.12;
    }
  }
  
  /* 성능 최적화 */
  .transparent-button,
  .logout-button {
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  
  /* 모션 감소 설정 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
