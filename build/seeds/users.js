"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const crypto_1 = require("crypto");
const Authenticate_1 = __importDefault(require("../app/services/Authenticate"));
async function seed(knex) {
    const existingAdmin = await knex("users")
        .where("email", "admin@gmail.com")
        .first();
    if (!existingAdmin) {
        const hashedPassword = await Authenticate_1.default.hash("123");
        const now = Date.now();
        await knex("users").insert({
            id: (0, crypto_1.randomUUID)(),
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            is_admin: true,
            is_verified: true,
            created_at: now,
            updated_at: now
        });
        console.log("Admin user created successfully");
    }
    else {
        console.log("Admin user already exists");
    }
}
;
//# sourceMappingURL=users.js.map