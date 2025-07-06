#!/usr/bin/env ts-node

/**
 * Validation Script for SUS Score Migration
 * 
 * This script validates that the migration was successful by:
 * 1. Checking that all records have sus_score values
 * 2. Verifying that calculated scores match the stored scores
 * 3. Ensuring data integrity
 * 4. Generating a validation report
 */

import DB from '../app/services/DB';
import SUSService from '../app/services/SUSService';

interface ValidationResult {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    missingScores: number;
    scoreDiscrepancies: Array<{
        id: string;
        name: string;
        storedScore: number;
        calculatedScore: number;
        difference: number;
    }>;
    errors: string[];
}

class MigrationValidator {
    
    async validateMigration(): Promise<ValidationResult> {
        console.log('🔍 Starting SUS Score Migration Validation...\n');
        
        const result: ValidationResult = {
            totalRecords: 0,
            validRecords: 0,
            invalidRecords: 0,
            missingScores: 0,
            scoreDiscrepancies: [],
            errors: []
        };

        try {
            // Get all questionnaire responses
            const responses = await DB.from('questionnaire_responses').select('*');
            result.totalRecords = responses.length;
            
            console.log(`📊 Found ${result.totalRecords} records to validate`);
            
            for (const response of responses) {
                try {
                    // Check if sus_score exists
                    if (response.sus_score === null || response.sus_score === undefined) {
                        result.missingScores++;
                        result.errors.push(`Record ${response.id} (${response.name}): Missing sus_score`);
                        continue;
                    }
                    
                    // Parse responses and calculate SUS score
                    const parsedResponses = JSON.parse(response.responses);
                    const calculatedScore = SUSService.calculateScore(parsedResponses);
                    const storedScore = parseFloat(response.sus_score);
                    
                    // Check for discrepancies (allow small floating point differences)
                    const difference = Math.abs(calculatedScore - storedScore);
                    if (difference > 0.01) {
                        result.scoreDiscrepancies.push({
                            id: response.id,
                            name: response.name,
                            storedScore: storedScore,
                            calculatedScore: calculatedScore,
                            difference: difference
                        });
                    }
                    
                    // Validate score range
                    if (calculatedScore < 0 || calculatedScore > 100) {
                        result.invalidRecords++;
                        result.errors.push(`Record ${response.id} (${response.name}): Invalid score range ${calculatedScore}`);
                    } else {
                        result.validRecords++;
                    }
                    
                } catch (error) {
                    result.invalidRecords++;
                    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                    result.errors.push(`Record ${response.id}: ${errorMsg}`);
                }
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Validation failed:', error);
            result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return result;
        }
    }
    
    generateReport(result: ValidationResult): void {
        console.log('\n📋 Migration Validation Report');
        console.log('===============================\n');
        
        // Summary statistics
        console.log('📊 Summary Statistics:');
        console.log(`   Total Records: ${result.totalRecords}`);
        console.log(`   Valid Records: ${result.validRecords}`);
        console.log(`   Invalid Records: ${result.invalidRecords}`);
        console.log(`   Missing Scores: ${result.missingScores}`);
        console.log(`   Score Discrepancies: ${result.scoreDiscrepancies.length}`);
        
        // Success rate
        const successRate = result.totalRecords > 0 ? 
            ((result.validRecords / result.totalRecords) * 100).toFixed(2) : '0';
        console.log(`   Success Rate: ${successRate}%\n`);
        
        // Score discrepancies
        if (result.scoreDiscrepancies.length > 0) {
            console.log('⚠️  Score Discrepancies Found:');
            result.scoreDiscrepancies.forEach(discrepancy => {
                console.log(`   - ${discrepancy.name} (${discrepancy.id}): Stored=${discrepancy.storedScore}, Calculated=${discrepancy.calculatedScore}, Diff=${discrepancy.difference.toFixed(2)}`);
            });
            console.log('');
        }
        
        // Errors
        if (result.errors.length > 0) {
            console.log('❌ Errors Found:');
            result.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
            console.log('');
        }
        
        // Overall status
        const isSuccess = result.invalidRecords === 0 && 
                         result.missingScores === 0 && 
                         result.scoreDiscrepancies.length === 0 && 
                         result.errors.length === 0;
        
        if (isSuccess) {
            console.log('✅ Migration Validation: PASSED');
            console.log('🎉 All SUS scores are calculated correctly and data integrity is maintained!');
        } else {
            console.log('❌ Migration Validation: FAILED');
            console.log('⚠️  Please review the errors above and consider running corrective actions.');
        }
        
        console.log('\n' + '='.repeat(50));
    }
    
    async checkDatabaseSchema(): Promise<void> {
        console.log('🔍 Checking Database Schema...');
        
        try {
            // Check if sus_score column exists
            const hasColumn = await DB.schema.hasColumn('questionnaire_responses', 'sus_score');
            if (hasColumn) {
                console.log('✅ sus_score column exists');
            } else {
                console.log('❌ sus_score column missing');
                return;
            }
            
            // Check if index exists
            const tableInfo = await DB.raw("PRAGMA index_list('questionnaire_responses')");
            const hasIndex = tableInfo.some((index: any) => 
                index.name === 'idx_questionnaire_responses_sus_score'
            );
            
            if (hasIndex) {
                console.log('✅ sus_score index exists');
            } else {
                console.log('⚠️  sus_score index missing');
            }
            
            // Check column constraints
            const columnInfo = await DB.raw("PRAGMA table_info('questionnaire_responses')");
            const susScoreColumn = columnInfo.find((col: any) => col.name === 'sus_score');
            
            if (susScoreColumn) {
                console.log(`✅ sus_score column type: ${susScoreColumn.type}`);
                console.log(`✅ sus_score column nullable: ${susScoreColumn.notnull === 0 ? 'YES' : 'NO'}`);
            }
            
        } catch (error) {
            console.error('❌ Schema check failed:', error);
        }
        
        console.log('');
    }
}

// Main execution
async function main() {
    const validator = new MigrationValidator();
    
    try {
        // Check database schema
        await validator.checkDatabaseSchema();
        
        // Validate migration
        const result = await validator.validateMigration();
        
        // Generate report
        validator.generateReport(result);
        
        // Exit with appropriate code
        const hasErrors = result.invalidRecords > 0 || 
                         result.missingScores > 0 || 
                         result.scoreDiscrepancies.length > 0 || 
                         result.errors.length > 0;
        
        process.exit(hasErrors ? 1 : 0);
        
    } catch (error) {
        console.error('💥 Validation script failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export default MigrationValidator; 