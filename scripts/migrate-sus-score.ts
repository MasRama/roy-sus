/**
 * SUS Score Migration Script
 * 
 * This script provides safe execution of SUS score migration with:
 * - Dry-run option for testing
 * - Pre-migration validation
 * - Safety checks
 * - Detailed logging
 */

import DB from '../app/services/DB';
import SUSService from '../app/services/SUSService';

interface MigrationOptions {
    dryRun?: boolean;
    verbose?: boolean;
    backupFirst?: boolean;
}

class SUSScoreMigrator {
    private options: MigrationOptions;

    constructor(options: MigrationOptions = {}) {
        this.options = {
            dryRun: false,
            verbose: false,
            backupFirst: true,
            ...options
        };
    }

    /**
     * Validate existing data before migration
     */
    async validateExistingData(): Promise<{isValid: boolean, issues: string[]}> {
        console.log('🔍 Validating existing data...');
        
        const issues: string[] = [];
        
        try {
            // Check if table exists
            const tableExists = await DB.schema.hasTable('questionnaire_responses');
            if (!tableExists) {
                issues.push('questionnaire_responses table does not exist');
                return { isValid: false, issues };
            }

            // Get all responses
            const responses = await DB.from('questionnaire_responses').select('*');
            console.log(`📊 Found ${responses.length} records to validate`);

            let validCount = 0;
            let invalidCount = 0;

            for (const response of responses) {
                try {
                    // Try to parse responses JSON
                    const parsedResponses = JSON.parse(response.responses);
                    
                    // Validate structure
                    let hasAllQuestions = true;
                    for (let i = 1; i <= 10; i++) {
                        const questionKey = `q${i}`;
                        const value = parseInt(parsedResponses[questionKey]);
                        
                        if (isNaN(value) || value < 1 || value > 5) {
                            hasAllQuestions = false;
                            issues.push(`Record ${response.id}: Invalid response for ${questionKey} (value: ${parsedResponses[questionKey]})`);
                        }
                    }
                    
                    if (hasAllQuestions) {
                        validCount++;
                    } else {
                        invalidCount++;
                    }
                    
                } catch (error) {
                    invalidCount++;
                    issues.push(`Record ${response.id}: Invalid JSON in responses field`);
                }
            }

            console.log(`✅ Valid records: ${validCount}`);
            console.log(`❌ Invalid records: ${invalidCount}`);

            return {
                isValid: invalidCount === 0,
                issues: issues.slice(0, 10) // Limit to first 10 issues for readability
            };

        } catch (error) {
            issues.push(`Database validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return { isValid: false, issues };
        }
    }

    /**
     * Perform dry-run analysis
     */
    async performDryRun(): Promise<void> {
        console.log('🧪 Performing dry-run analysis...');
        
        try {
            const responses = await DB.from('questionnaire_responses').select('*');
            
            const analysis = {
                totalRecords: responses.length,
                validRecords: 0,
                invalidRecords: 0,
                scoreDistribution: {} as Record<number, number>,
                errors: [] as string[]
            };

            for (const response of responses) {
                try {
                    const susScore = SUSService.calculateScore(JSON.parse(response.responses));
                    
                    if (susScore >= 0 && susScore <= 100) {
                        analysis.validRecords++;
                        
                        // Group scores by 10-point ranges
                        const scoreRange = Math.floor(susScore / 10) * 10;
                        analysis.scoreDistribution[scoreRange] = (analysis.scoreDistribution[scoreRange] || 0) + 1;
                    } else {
                        analysis.invalidRecords++;
                        analysis.errors.push(`Invalid score calculated for record ${response.id}: ${susScore}`);
                    }
                    
                } catch (error) {
                    analysis.invalidRecords++;
                    analysis.errors.push(`Error processing record ${response.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }

            // Display analysis results
            console.log('\n📋 Dry-Run Analysis Results:');
            console.log('============================');
            console.log(`📊 Total records: ${analysis.totalRecords}`);
            console.log(`✅ Valid records: ${analysis.validRecords}`);
            console.log(`❌ Invalid records: ${analysis.invalidRecords}`);
            
            console.log('\n📈 Score Distribution:');
            Object.entries(analysis.scoreDistribution)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .forEach(([range, count]) => {
                    console.log(`   ${range}-${parseInt(range) + 9}: ${count} records`);
                });

            if (analysis.errors.length > 0) {
                console.log('\n❌ Errors (first 5):');
                analysis.errors.slice(0, 5).forEach(error => {
                    console.log(`   - ${error}`);
                });
            }

            console.log(`\n🎯 Migration would process ${analysis.validRecords} records successfully`);
            console.log(`⚠️  ${analysis.invalidRecords} records would need manual attention`);

        } catch (error) {
            console.error('💥 Dry-run failed:', error);
            throw error;
        }
    }

    /**
     * Execute the migration
     */
    async executeMigration(): Promise<void> {
        console.log('🚀 Executing SUS Score migration...');
        
        if (this.options.dryRun) {
            await this.performDryRun();
            console.log('\n✅ Dry-run completed. Use --execute to run the actual migration.');
            return;
        }

        // Validate data first
        const validation = await this.validateExistingData();
        if (!validation.isValid) {
            console.error('❌ Data validation failed:');
            validation.issues.forEach(issue => console.error(`   - ${issue}`));
            throw new Error('Data validation failed. Please fix issues before running migration.');
        }

        // Run the actual migration
        console.log('🔄 Running knex migration...');
        
        try {
            // Use knex migrate:latest to run the migration
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            
            const { stdout, stderr } = await execAsync('npx knex migrate:latest');
            
            if (this.options.verbose) {
                console.log('Migration output:', stdout);
            }
            
            if (stderr) {
                console.error('Migration stderr:', stderr);
            }
            
            console.log('✅ Migration completed successfully!');
            
        } catch (error) {
            console.error('💥 Migration execution failed:', error);
            throw error;
        }
    }

    /**
     * Rollback the migration
     */
    async rollbackMigration(): Promise<void> {
        console.log('🔄 Rolling back SUS Score migration...');
        
        try {
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            
            const { stdout, stderr } = await execAsync('npx knex migrate:rollback');
            
            if (this.options.verbose) {
                console.log('Rollback output:', stdout);
            }
            
            if (stderr) {
                console.error('Rollback stderr:', stderr);
            }
            
            console.log('✅ Rollback completed successfully!');
            
        } catch (error) {
            console.error('💥 Rollback failed:', error);
            throw error;
        }
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    
    const options: MigrationOptions = {
        dryRun: args.includes('--dry-run'),
        verbose: args.includes('--verbose'),
        backupFirst: !args.includes('--no-backup')
    };

    const migrator = new SUSScoreMigrator(options);

    try {
        if (args.includes('--rollback')) {
            await migrator.rollbackMigration();
        } else if (args.includes('--validate')) {
            const validation = await migrator.validateExistingData();
            if (validation.isValid) {
                console.log('✅ All data is valid and ready for migration');
            } else {
                console.log('❌ Data validation issues found:');
                validation.issues.forEach(issue => console.log(`   - ${issue}`));
                process.exit(1);
            }
        } else {
            await migrator.executeMigration();
        }
        
    } catch (error) {
        console.error('💥 Script failed:', error);
        process.exit(1);
    }
}

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🔧 SUS Score Migration Script

Usage: npx ts-node scripts/migrate-sus-score.ts [options]

Options:
  --dry-run       Perform analysis without making changes
  --execute       Execute the actual migration
  --rollback      Rollback the migration
  --validate      Validate data only
  --verbose       Show detailed output
  --no-backup     Skip automatic backup
  --help, -h      Show this help message

Examples:
  npx ts-node scripts/migrate-sus-score.ts --dry-run
  npx ts-node scripts/migrate-sus-score.ts --validate
  npx ts-node scripts/migrate-sus-score.ts --execute
  npx ts-node scripts/migrate-sus-score.ts --rollback
    `);
    process.exit(0);
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

export default SUSScoreMigrator; 