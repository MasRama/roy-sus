import { Request, Response } from "../../type";

/**
 * Session middleware untuk menginisialisasi objek session pada request
 * Middleware ini memastikan bahwa request.session selalu tersedia sebagai objek
 */
export default () => {
    return (req: Request, res: Response, next: () => void) => {
        // Inisialisasi session sebagai objek kosong jika belum ada
        if (!req.session) {
            req.session = {};
        }
        
        next();
    };
};