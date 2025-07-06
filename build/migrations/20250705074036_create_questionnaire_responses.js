"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('questionnaire_responses', function (table) {
        table.uuid('id').primary().notNullable();
        table.string('name', 255).notNullable();
        table.integer('age').notNullable();
        table.enum('gender', ['Laki-laki', 'Perempuan']).notNullable();
        table.enum('digital_proficiency', ['Pemula', 'Menengah', 'Mahir']).notNullable();
        table.json('responses').notNullable();
        table.bigInteger("created_at");
        table.bigInteger("updated_at");
    });
}
async function down(knex) {
    await knex.schema.dropTable('questionnaire_responses');
}
//# sourceMappingURL=20250705074036_create_questionnaire_responses.js.map