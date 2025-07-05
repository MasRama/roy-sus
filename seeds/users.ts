import { Knex } from "knex";
import { randomUUID } from "crypto";
import Authenticate from "../app/services/Authenticate";

export async function seed(knex: Knex): Promise<void> {
    // Check if admin user already exists
    const existingAdmin = await knex("users")
        .where("email", "admin@gmail.com")
        .first();

    // Only insert admin if it doesn't exist
    if (!existingAdmin) {
        const hashedPassword = await Authenticate.hash("123");
        const now = Date.now();

        await knex("users").insert({
            id: randomUUID(),
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            is_admin: true,
            is_verified: true,
            created_at: now,
            updated_at: now
        });

        console.log("Admin user created successfully");
    } else {
        console.log("Admin user already exists");
    }
};
