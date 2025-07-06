"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
class RedisService {
    constructor() {
        this.client = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
        });
    }
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    async get(key) {
        return await this.client.get(key);
    }
    async set(key, value, ttl) {
        if (ttl) {
            return await this.client.set(key, value, 'EX', ttl);
        }
        return await this.client.set(key, value);
    }
    async del(key) {
        return await this.client.del(typeof key === 'string' ? [key] : key);
    }
    async hget(key, field) {
        return await this.client.hget(key, field);
    }
    async hset(key, field, value) {
        return await this.client.hset(key, field, value);
    }
    async hgetall(key) {
        return await this.client.hgetall(key);
    }
    async lpush(key, value) {
        return await this.client.lpush(key, ...(Array.isArray(value) ? value : [value]));
    }
    async rpush(key, value) {
        return await this.client.rpush(key, ...(Array.isArray(value) ? value : [value]));
    }
    async lrange(key, start, stop) {
        return await this.client.lrange(key, start, stop);
    }
    async sadd(key, value) {
        return await this.client.sadd(key, ...(Array.isArray(value) ? value : [value]));
    }
    async smembers(key) {
        return await this.client.smembers(key);
    }
    async exists(key) {
        return await this.client.exists(key);
    }
    async ttl(key) {
        return await this.client.ttl(key);
    }
    async expire(key, seconds) {
        return await this.client.expire(key, seconds);
    }
    async disconnect() {
        await this.client.quit();
    }
}
exports.default = RedisService.getInstance();
//# sourceMappingURL=Redis.js.map