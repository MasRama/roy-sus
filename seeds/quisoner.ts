import { Knex } from "knex";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";

// Interface untuk data CSV
interface CSVRecord {
    [key: string]: string;
}

// Interface untuk data yang akan diinsert ke database
interface QuestionnaireResponse {
    id: string;
    name: string;
    age: number;
    gender: 'Laki-laki' | 'Perempuan';
    digital_proficiency: 'Pemula' | 'Menengah' | 'Mahir';
    responses: string;
    sus_score?: number;
    created_at: number;
    updated_at: number;
}

// Fungsi untuk parsing CSV
function parseCSV(filePath: string): CSVRecord[] {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            throw new Error('CSV file is empty');
        }
        
        const headers = lines[0].split(';').map(header => header.trim());
        
        return lines.slice(1).map((line, index) => {
            const values = line.split(';');
            const record: CSVRecord = {};
            
            headers.forEach((header, headerIndex) => {
                record[header] = values[headerIndex]?.trim() || '';
            });
            
            return record;
        }).filter(record => {
            // Filter out empty records
            return record['Nama Lengkap'] && record['Nama Lengkap'].trim() !== '';
        });
    } catch (error) {
        console.error('Error parsing CSV:', error);
        throw error;
    }
}

// Fungsi untuk normalisasi gender
function normalizeGender(gender: string): 'Laki-laki' | 'Perempuan' {
    const cleaned = gender.trim().toLowerCase();
    if (cleaned.includes('laki') || cleaned.includes('male')) {
        return 'Laki-laki';
    }
    return 'Perempuan';
}

// Fungsi untuk menghitung SUS Score
function calculateSUSScore(responses: { [key: string]: number }): number {
    let score = 0;
    
    for (let i = 1; i <= 10; i++) {
        const response = responses[`question_${i}`] || 1;
        
        if (i % 2 === 1) {
            // Pertanyaan ganjil (1, 3, 5, 7, 9)
            score += (response - 1) * 2.5;
        } else {
            // Pertanyaan genap (2, 4, 6, 8, 10)
            score += (5 - response) * 2.5;
        }
    }
    
    return Math.round(score * 100) / 100; // Round to 2 decimal places
}

// Fungsi untuk validasi record
function validateRecord(record: QuestionnaireResponse): boolean {
    return (
        record.name && record.name.trim() !== '' &&
        record.age >= 1 && record.age <= 120 &&
        ['Laki-laki', 'Perempuan'].includes(record.gender) &&
        record.responses && record.responses !== '{}'
    );
}

// Fungsi untuk transformasi data CSV ke format database
function transformData(csvRecord: CSVRecord, index: number): QuestionnaireResponse {
    const responses: { [key: string]: number } = {};
    
    // Extract responses dari kolom pertanyaan (kolom 5-14)
    for (let i = 1; i <= 10; i++) {
        const questionKey = Object.keys(csvRecord).find(key => 
            key.includes(`${i}.`) && key.includes('Saya')
        );
        
        if (questionKey && csvRecord[questionKey]) {
            const responseValue = parseInt(csvRecord[questionKey]) || 1;
            responses[`question_${i}`] = Math.max(1, Math.min(5, responseValue)); // Ensure 1-5 range
        } else {
            responses[`question_${i}`] = 1; // Default value
        }
    }
    
    const name = csvRecord['Nama Lengkap'] || '';
    const age = parseInt(csvRecord['Usia (Angka Saja)'] || '25') || 25;
    const gender = normalizeGender(csvRecord['Jenis Kelamin'] || 'Perempuan');
    const susScore = calculateSUSScore(responses);
    
    // Generate varied timestamps - spread over the last 30 days
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const randomOffset = Math.floor(Math.random() * (now - thirtyDaysAgo));
    const createdAt = thirtyDaysAgo + randomOffset;
    
    // Updated timestamp should be same or slightly after created
    const updatedAt = createdAt + Math.floor(Math.random() * (60 * 60 * 1000)); // Up to 1 hour later
    
    return {
        id: randomUUID(),
        name: name,
        age: age,
        gender: gender,
        digital_proficiency: 'Menengah', // Default value as per requirement
        responses: JSON.stringify(responses),
        sus_score: susScore,
        created_at: createdAt,
        updated_at: updatedAt
    };
}

export async function seed(knex: Knex): Promise<void> {
    try {
        console.log('Starting questionnaire responses seeding...');
        
        // Deletes ALL existing entries
        await knex('questionnaire_responses').del();
        console.log('Cleared existing questionnaire responses');
        
        // Parse CSV file
        const csvFilePath = '/home/ramaren/docs-project/roy/data.csv';
        console.log(`Reading CSV file: ${csvFilePath}`);
        
        const csvData = parseCSV(csvFilePath);
        console.log(`Parsed ${csvData.length} records from CSV`);
        
        // Transform data
        const transformedData = csvData.map((record, index) => transformData(record, index));
        console.log(`Transformed ${transformedData.length} records`);
        
        // Validate data
        const validData = transformedData.filter(validateRecord);
        console.log(`${validData.length} valid records out of ${transformedData.length}`);
        
        if (validData.length === 0) {
            console.warn('No valid data to insert');
            return;
        }
        
        // Insert data in batches (smaller batch size to avoid query length issues)
        console.log(`Inserting ${validData.length} questionnaire responses...`);
        await knex.batchInsert('questionnaire_responses', validData, 10);
        
        console.log('✅ Questionnaire responses seeded successfully!');
        console.log(`📊 Total records inserted: ${validData.length}`);
        
    } catch (error) {
        console.error('❌ Error seeding questionnaire responses:', error);
        throw error;
    }
};
