import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('questionnaire_responses', function (table) {
        table.uuid('id').primary().notNullable()
        table.string('name', 255).notNullable()
        table.integer('age').notNullable()
        table.enum('gender', ['Laki-laki', 'Perempuan']).notNullable()
        table.enum('digital_proficiency', ['Pemula', 'Menengah', 'Mahir']).notNullable()
        table.json('responses').notNullable()
        
        /**
         * Uses bigInteger for timestamps to match existing pattern
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('questionnaire_responses')
}

