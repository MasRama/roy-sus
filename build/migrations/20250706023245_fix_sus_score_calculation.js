"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function calculateSUSScore(responses) {
    try {
        const parsed = typeof responses === 'string' ? JSON.parse(responses) : responses;
        if (!parsed || typeof parsed !== 'object') {
            console.error('Invalid responses object:', responses);
            return 0;
        }
        let totalScore = 0;
        let hasAllQuestions = true;
        for (let i = 1; i <= 10; i++) {
            const questionKey = `q${i}`;
            const value = parseInt(parsed[questionKey]);
            if (isNaN(value) || value < 1 || value > 5) {
                console.error(`Invalid response for ${questionKey}:`, value);
                hasAllQuestions = false;
                break;
            }
            if (i % 2 === 1) {
                totalScore += (value - 1) * 2.5;
            }
            else {
                totalScore += (5 - value) * 2.5;
            }
        }
        return hasAllQuestions ? Math.max(0, Math.min(100, totalScore)) : 0;
    }
    catch (error) {
        console.error('Error calculating SUS score:', error);
        return 0;
    }
}
async function up(knex) {
    console.log('🚀 Starting SUS Score calculation fix migration...');
    try {
        console.log('📊 Adding sus_score column to questionnaire_responses table...');
        const hasColumn = await knex.schema.hasColumn('questionnaire_responses', 'sus_score');
        if (!hasColumn) {
            await knex.schema.table('questionnaire_responses', function (table) {
                table.decimal('sus_score', 5, 2).nullable().comment('Calculated SUS Score (0-100)');
                table.index('sus_score', 'idx_questionnaire_responses_sus_score');
            });
            console.log('✅ sus_score column added successfully');
        }
        else {
            console.log('ℹ️  sus_score column already exists');
        }
        console.log('💾 Creating backup table...');
        const backupTableName = `questionnaire_responses_backup_${Date.now()}`;
        await knex.raw(`CREATE TABLE ${backupTableName} AS SELECT * FROM questionnaire_responses`);
        console.log(`✅ Backup created: ${backupTableName}`);
        console.log('📋 Fetching all existing questionnaire responses...');
        const allResponses = await knex('questionnaire_responses').select('*');
        console.log(`📊 Found ${allResponses.length} responses to process`);
        let processedCount = 0;
        let errorCount = 0;
        const errors = [];
        console.log('🔄 Processing responses and calculating SUS scores...');
        for (const response of allResponses) {
            try {
                const susScore = calculateSUSScore(response.responses);
                await knex('questionnaire_responses')
                    .where('id', response.id)
                    .update({
                    sus_score: susScore,
                    updated_at: Date.now()
                });
                processedCount++;
                if (processedCount % 10 === 0) {
                    console.log(`📈 Processed ${processedCount}/${allResponses.length} responses...`);
                }
            }
            catch (error) {
                errorCount++;
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                errors.push({
                    id: response.id,
                    error: errorMsg
                });
                console.error(`❌ Error processing response ${response.id}:`, errorMsg);
                await knex('questionnaire_responses')
                    .where('id', response.id)
                    .update({
                    sus_score: 0,
                    updated_at: Date.now()
                });
            }
        }
        console.log('🔍 Validating migration results...');
        const nullScoreCount = await knex('questionnaire_responses')
            .whereNull('sus_score')
            .count('* as count')
            .first();
        const totalRecords = await knex('questionnaire_responses')
            .count('* as count')
            .first();
        console.log('\n📋 Migration Report:');
        console.log('==================');
        console.log(`✅ Total records: ${totalRecords?.count || 0}`);
        console.log(`✅ Successfully processed: ${processedCount}`);
        console.log(`❌ Errors encountered: ${errorCount}`);
        console.log(`⚠️  Records with null sus_score: ${nullScoreCount?.count || 0}`);
        console.log(`💾 Backup table: ${backupTableName}`);
        if (errors.length > 0) {
            console.log('\n❌ Error Details:');
            errors.forEach(err => {
                console.log(`   - ID: ${err.id}, Error: ${err.error}`);
            });
        }
        if (nullScoreCount?.count && Number(nullScoreCount.count) > 0) {
            console.log('🔧 Setting remaining null scores to 0...');
            await knex('questionnaire_responses')
                .whereNull('sus_score')
                .update({ sus_score: 0 });
        }
        console.log('🔒 Adding NOT NULL constraint to sus_score column...');
        await knex.schema.alterTable('questionnaire_responses', function (table) {
            table.decimal('sus_score', 5, 2).notNullable().alter();
        });
        console.log('🎉 Migration completed successfully!');
        console.log(`📊 Final statistics: ${processedCount} records processed, ${errorCount} errors`);
    }
    catch (error) {
        console.error('💥 Migration failed:', error);
        throw error;
    }
}
async function down(knex) {
    console.log('🔄 Rolling back SUS Score calculation fix migration...');
    try {
        const tables = await knex.raw(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name LIKE 'questionnaire_responses_backup_%'
            ORDER BY name DESC
            LIMIT 1
        `);
        const backupTable = tables[0]?.name;
        if (backupTable) {
            console.log(`📋 Found backup table: ${backupTable}`);
            console.log('🔄 Restoring data from backup...');
            await knex('questionnaire_responses').del();
            await knex.raw(`
                INSERT INTO questionnaire_responses (id, name, age, gender, digital_proficiency, responses, created_at, updated_at)
                SELECT id, name, age, gender, digital_proficiency, responses, created_at, updated_at
                FROM ${backupTable}
            `);
            console.log('✅ Data restored from backup');
        }
        else {
            console.log('⚠️  No backup table found, skipping data restoration');
        }
        const hasColumn = await knex.schema.hasColumn('questionnaire_responses', 'sus_score');
        if (hasColumn) {
            console.log('🗑️  Removing sus_score column...');
            await knex.schema.table('questionnaire_responses', function (table) {
                table.dropColumn('sus_score');
            });
            console.log('✅ sus_score column removed');
        }
        if (backupTable) {
            console.log(`🗑️  Cleaning up backup table: ${backupTable}`);
            await knex.schema.dropTableIfExists(backupTable);
            console.log('✅ Backup table cleaned up');
        }
        console.log('🎉 Rollback completed successfully!');
    }
    catch (error) {
        console.error('💥 Rollback failed:', error);
        throw error;
    }
}
//# sourceMappingURL=20250706023245_fix_sus_score_calculation.js.map