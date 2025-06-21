<!-- src/lib/components/sidebar/user_section.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { userStore, logout } from '$lib/stores/user';
  
  // prop 대신 스토어에서 사용자 정보를 가져옴
  $: user = $userStore;
  $: console.log('UserSection: user state changed:', user);
  
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

<style>
  .user-section {
    position: relative;
  }
  
  /* 로그인된 사용자 메뉴 */
  .user-menu {
    position: relative;
  }
  
  .user-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: none;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #1d1d1f;
    font-size: 15px;
    font-weight: 400;
  }
  
  .user-button:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #007aff, #5856d6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
  }
  
  .user-name {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .chevron {
    transition: transform 0.2s ease;
    opacity: 0.6;
  }
  
  .chevron.rotated {
    transform: rotate(180deg);
  }
  
  /* 드롭다운 메뉴 */
  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border: 0.5px solid rgba(0, 0, 0, 0.04);
    border-radius: 12px;
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.1),
      0 8px 32px rgba(0, 0, 0, 0.08);
    min-width: 160px;
    overflow: hidden;
    animation: dropdownSlide 0.2s ease;
    z-index: 1000;
  }
  
  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease;
    color: #1d1d1f;
    font-size: 15px;
    font-weight: 400;
  }
  
  .dropdown-item:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  
  .dropdown-item svg {
    opacity: 0.6;
  }
  
  /* 로그인되지 않은 상태 */
  .auth-buttons {
    display: flex;
    align-items: center;
  }
  
  .sign-in-button {
    padding: 8px 16px;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .sign-in-button:hover {
    background: #0056d3;
    transform: translateY(-1px);
  }
  
  .sign-in-button:active {
    transform: translateY(0);
  }
  
  /* 모바일 반응형 */
  @media (max-width: 640px) {
    .user-name {
      display: none;
    }
    
    .user-button {
      padding: 6px 8px;
    }
    
    .dropdown {
      right: -8px;
    }
  }
  
  /* 다크 모드 지원 */
  @media (prefers-color-scheme: dark) {
    .user-button {
      color: #f5f5f7;
    }
    
    .user-button:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    
    .dropdown {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .dropdown-item {
      color: #f5f5f7;
    }
    
    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
</style>
