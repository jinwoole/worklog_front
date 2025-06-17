## 시간
```
// 현재 시간 (밀리초)
const now = BigInt(Date.now())

// 또는 더 명시적으로
const now = BigInt(new Date().getTime())

// BigInt → Date 객체
const date = new Date(Number(user.createdAt))

// BigInt → ISO 문자열
const isoString = new Date(Number(user.createdAt)).toISOString()
```

```
// 사용자 생성 시
const userData: CreateUser = {
  id: crypto.randomUUID(),
  name: "홍길동",
  email: "hong@example.com",
  createdAt: BigInt(Date.now()),
  updatedAt: BigInt(Date.now())
}

// 30분 후 계정 잠금 해제
const lockUntil = BigInt(Date.now() + 30 * 60 * 1000)
await userRepo.lockUser(userId, lockUntil)

// 잠금 확인
const isLocked = user.lockedUntil && user.lockedUntil > BigInt(Date.now())
```

```
// 유틸리티 함수 추가
export const timeUtils = {
  now: () => BigInt(Date.now()),
  addMinutes: (minutes: number) => BigInt(Date.now() + minutes * 60 * 1000),
  toDate: (bigint: bigint) => new Date(Number(bigint)),
  isExpired: (bigint: bigint) => bigint < BigInt(Date.now())
}
```