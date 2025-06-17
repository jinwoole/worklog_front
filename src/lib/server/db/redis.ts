// lib/server/redis.ts
import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

// Redis 연결 에러 핸들링
redis.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

// Redis 연결 상태 추적
let isConnected = false

// Redis 연결
redis.connect()
  .then(() => {
    isConnected = true
    console.log('Redis connected successfully')
  })
  .catch((err) => {
    isConnected = false
    console.error('Redis Connection Error:', err)
    console.log('Redis is not available, will use in-memory session storage')
  })

export { redis, isConnected }