import redis from 'ioredis';

export const redisEmailToken = new redis({ db: 1 });
