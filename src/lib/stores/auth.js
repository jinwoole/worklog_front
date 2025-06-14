import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export const user = writable(null);
export const isAuthenticated = writable(false);
export const showLoginModal = writable(false);

// Backend URL
const backend = 'http://192.168.50.254:8080';

// 회원가입 데이터
export const registerData = writable({
    name: '',
    email: ''
});

// 로그인 데이터  
export const loginData = writable({
    name: ''
});

// 회원가입 시작
export async function registerStart() {
    // registerData store에서 값 가져오기
    let regData;
    registerData.subscribe(value => regData = value)();
    
    const { name, email } = regData;
    if (!name.length || !email.length) {
        alert('All fields need to be set!');
        return;
    }

    try {
        // call backend /register/start
        const res = await fetch(`${backend}/api/passkey/register/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Registration start error:', errorText);
            throw new Error(errorText || 'Registration failed');
        }

        const data = await res.json();
        console.log('Registration start response:', data); // 디버깅용
        console.log('Options structure:', JSON.stringify(data.options, null, 2)); // 구조 확인
        
        // authenticatorSelection 옵션 수정하여 외부 인증기 우선
        const modifiedOptions = {
            ...data.options.publicKey,
            authenticatorSelection: {
                ...data.options.publicKey.authenticatorSelection,
                authenticatorAttachment: 'cross-platform', // 외부 인증기 선호
                userVerification: 'preferred',
                requireResidentKey: false
            }
        };
        
        console.log('Modified options:', JSON.stringify(modifiedOptions, null, 2));
        
        const attestationResponse = await startRegistration(
            modifiedOptions
        ).catch((err) => {
            console.error('WebAuthn registration error:', err);
            console.error('Options that caused error:', JSON.stringify(modifiedOptions, null, 2));
            alert('WebAuthn registration failed: ' + String(err));
            return undefined;
        });
        
        if (!attestationResponse) return;

        return await registerFinish(attestationResponse, data.sid);
    } catch (err) {
        console.error('Registration start failed:', err);
        alert('Registration failed: ' + err.message);
    }
}

// 회원가입 완료
export async function registerFinish(attestationResponse, sessionId) {
    try {
        const verificationResponse = await fetch(
            `${backend}/api/passkey/register/finish`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-Session-Id': sessionId,
                },
                body: JSON.stringify(attestationResponse),
            },
        );

        const msg = await verificationResponse.json();
        
        if (verificationResponse.ok) {
            alert('Registration successful!');
            // 회원가입은 성공했지만 자동 로그인은 안함
            console.log('Registration completed:', msg);
        } else {
            alert('Registration failed: ' + JSON.stringify(msg, null, 2));
        }
        
        return msg;
    } catch (err) {
        console.error('Registration finish failed:', err);
        alert('Registration failed: ' + err.message);
    }
}

// 로그인 시작
export async function loginStart() {
    // loginData store에서 값 가져오기
    let logData;
    loginData.subscribe(value => logData = value)();
    
    const { name } = logData;
    if (!name.length) {
        alert('Name needs to be set!');
        return;
    }

    try {
        // call backend /login/start
        const res = await fetch(`${backend}/api/passkey/login/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Login start error:', errorText);
            throw new Error(errorText || 'Login failed');
        }

        const data = await res.json();
        console.log('Login start response:', data); // 디버깅용
        console.log('Login options structure:', JSON.stringify(data.options, null, 2)); // 구조 확인
        
        const attestationResponse = await startAuthentication(
            data.options.publicKey
        ).catch((err) => {
            console.error('WebAuthn authentication error:', err);
            console.error('Login options that caused error:', JSON.stringify(data.options.publicKey, null, 2));
            alert('WebAuthn authentication failed: ' + String(err));
            return undefined;
        });
        
        if (!attestationResponse) return;

        return await loginFinish(attestationResponse, data.sid);
    } catch (err) {
        console.error('Login start failed:', err);
        alert('Login failed: ' + err.message);
    }
}

// 로그인 완료
export async function loginFinish(attestationResponse, sessionId) {
    try {
        const verificationResponse = await fetch(
            `${backend}/api/passkey/login/finish`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-Session-Id': sessionId,
                },
                body: JSON.stringify(attestationResponse),
            },
        );

        const msg = await verificationResponse.json();
        
        if (verificationResponse.ok) {
            alert('Login successful!');
            // 세션 저장 및 인증 상태 업데이트
            sessionStorage.setItem('sid', msg.sid);
            isAuthenticated.set(true);
            showLoginModal.set(false);
            
            // 백엔드에서 사용자 정보를 리턴하지 않으므로 별도로 설정하지 않음
            console.log('Login successful, session ID:', msg.sid);
        } else {
            alert('Login failed: ' + JSON.stringify(msg, null, 2));
        }
        
        return msg;
    } catch (err) {
        console.error('Login finish failed:', err);
        alert('Login failed: ' + err.message);
    }
}

// 로그아웃
export function logout() {
    sessionStorage.removeItem('sid');
    user.set(null);
    isAuthenticated.set(false);
}

// 로그인 모달 제어
export function openLoginModal() {
    showLoginModal.set(true);
}

export function closeLoginModal() {
    showLoginModal.set(false);
}

// 인증 상태 초기화 (페이지 로드시)
export function initializeAuth() {
    if (!browser) return;
    
    const sid = sessionStorage.getItem('sid');
    if (sid) {
        isAuthenticated.set(true);
        // 필요하다면 사용자 정보를 가져오는 API 호출
    }
}
