import type { Knex } from "knex";

/**
 * Migration: Fix SUS Score Calculation
 * 
 * This migration ensures data consistency for SUS score calculations by:
 * 1. Adding a sus_score column for performance optimization
 * 2. Recalculating all existing SUS scores using the correct formula
 * 3. Validating and fixing any inconsistent response data
 * 4. Creating backup for rollback purposes
 */

// SUS Score calculation function (mirroring SUSService logic)
function calculateSUSScore(responses: any): number {
    try {
        // Parse responses if it's a string
        const parsed = typeof responses === 'string' ? JSON.parse(responses) : responses;
        
        // Validate responses object
        if (!parsed || typeof parsed !== 'object') {
            console.error('Invalid responses object:', responses);
            return 0;
        }

        let totalScore = 0;
        let hasAllQuestions = true;
        
        // Calculate SUS score using the standard formula
        for (let i = 1; i <= 10; i++) {
            const questionKey = `q${i}`;
            const value = parseInt(parsed[questionKey]);
            
            // Validate response value
            if (isNaN(value) || value < 1 || value > 5) {
                console.error(`Invalid response for ${questionKey}:`, value);
                hasAllQuestions = false;
                break;
            }
            
            if (i % 2 === 1) {
                // Odd questions (1,3,5,7,9): (response - 1) * 2.5
                totalScore += (value - 1) * 2.5;
            } else {
                // Even questions (2,4,6,8,10): (5 - response) * 2.5
                totalScore += (5 - value) * 2.5;
            }
        }
        
        // Return 0 if not all questions are answered or invalid
        return hasAllQuestions ? Math.max(0, Math.min(100, totalScore)) : 0;
        
    } catch (error) {
        console.error('Error calculating SUS score:', error);
        return 0;
    }
}

export async function up(knex: Knex): Promise<void> {
    console.log('🚀 Starting SUS Score calculation fix migration...');
    
    try {
        // Step 1: Add sus_score column for performance optimization
        console.log('📊 Adding sus_score column to questionnaire_responses table...');
        
        const hasColumn = await knex.schema.hasColumn('questionnaire_responses', 'sus_score');
        if (!hasColumn) {
            await knex.schema.table('questionnaire_responses', function (table) {
                table.decimal('sus_score', 5, 2).nullable().comment('Calculated SUS Score (0-100)');
                table.index('sus_score', 'idx_questionnaire_responses_sus_score');
            });
            console.log('✅ sus_score column added successfully');
        } else {
            console.log('ℹ️  sus_score column already exists');
        }

        // Step 2: Create backup table for rollback purposes
        console.log('💾 Creating backup table...');
        
        const backupTableName = `questionnaire_responses_backup_${Date.now()}`;
        await knex.raw(`CREATE TABLE ${backupTableName} AS SELECT * FROM questionnaire_responses`);
        console.log(`✅ Backup created: ${backupTableName}`);

        // Step 3: Get all existing responses
        console.log('📋 Fetching all existing questionnaire responses...');
        
        const allResponses = await knex('questionnaire_responses').select('*');
        console.log(`📊 Found ${allResponses.length} responses to process`);

        // Step 4: Process each response and calculate SUS score
        let processedCount = 0;
        let errorCount = 0;
        const errors: Array<{id: string, error: string}> = [];

        console.log('🔄 Processing responses and calculating SUS scores...');
        
        for (const response of allResponses) {
            try {
                // Calculate SUS score using the correct formula
                const susScore = calculateSUSScore(response.responses);
                
                // Update the record with calculated SUS score
                await knex('questionnaire_responses')
                    .where('id', response.id)
                    .update({
                        sus_score: susScore,
                        updated_at: Date.now()
                    });
                
                processedCount++;
                
                // Log progress every 10 records
                if (processedCount % 10 === 0) {
                    console.log(`📈 Processed ${processedCount}/${allResponses.length} responses...`);
                }
                
            } catch (error) {
                errorCount++;
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                errors.push({
                    id: response.id,
                    error: errorMsg
                });
                
                console.error(`❌ Error processing response ${response.id}:`, errorMsg);
                
                // Set sus_score to 0 for problematic records
                await knex('questionnaire_responses')
                    .where('id', response.id)
                    .update({
                        sus_score: 0,
                        updated_at: Date.now()
                    });
            }
        }

        // Step 5: Validation - ensure all records have sus_score
        console.log('🔍 Validating migration results...');
        
        const nullScoreCount = await knex('questionnaire_responses')
            .whereNull('sus_score')
            .count('* as count')
            .first();

        const totalRecords = await knex('questionnaire_responses')
            .count('* as count')
            .first();

        // Step 6: Generate migration report
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

        // Step 7: Update any remaining null scores to 0
        if (nullScoreCount?.count && Number(nullScoreCount.count) > 0) {
            console.log('🔧 Setting remaining null scores to 0...');
            await knex('questionnaire_responses')
                .whereNull('sus_score')
                .update({ sus_score: 0 });
        }

        // Step 8: Add NOT NULL constraint after data is clean
        console.log('🔒 Adding NOT NULL constraint to sus_score column...');
        await knex.schema.alterTable('questionnaire_responses', function (table) {
            table.decimal('sus_score', 5, 2).notNullable().alter();
        });

        console.log('🎉 Migration completed successfully!');
        console.log(`📊 Final statistics: ${processedCount} records processed, ${errorCount} errors`);
        
    } catch (error) {
        console.error('💥 Migration failed:', error);
        throw error;
    }
}

export async function down(knex: Knex): Promise<void> {
    console.log('🔄 Rolling back SUS Score calculation fix migration...');
    
    try {
        // Step 1: Find the most recent backup table
        const tables = await knex.raw(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name LIKE 'questionnaire_responses_backup_%'
            ORDER BY name DESC
            LIMIT 1
        `);
        
        const backupTable = tables[0]?.name;
        
        if (backupTable) {
            console.log(`📋 Found backup table: ${backupTable}`);
            
            // Step 2: Restore data from backup (excluding sus_score)
            console.log('🔄 Restoring data from backup...');
            
            // Clear current table
            await knex('questionnaire_responses').del();
            
            // Restore from backup
            await knex.raw(`
                INSERT INTO questionnaire_responses (id, name, age, gender, digital_proficiency, responses, created_at, updated_at)
                SELECT id, name, age, gender, digital_proficiency, responses, created_at, updated_at
                FROM ${backupTable}
            `);
            
            console.log('✅ Data restored from backup');
            
        } else {
            console.log('⚠️  No backup table found, skipping data restoration');
        }
        
        // Step 3: Remove sus_score column
        const hasColumn = await knex.schema.hasColumn('questionnaire_responses', 'sus_score');
        if (hasColumn) {
            console.log('🗑️  Removing sus_score column...');
            await knex.schema.table('questionnaire_responses', function (table) {
                table.dropColumn('sus_score');
            });
            console.log('✅ sus_score column removed');
        }
        
        // Step 4: Clean up backup table
        if (backupTable) {
            console.log(`🗑️  Cleaning up backup table: ${backupTable}`);
            await knex.schema.dropTableIfExists(backupTable);
            console.log('✅ Backup table cleaned up');
        }
        
        console.log('🎉 Rollback completed successfully!');
        
    } catch (error) {
        console.error('💥 Rollback failed:', error);
        throw error;
    }
}

