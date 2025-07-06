"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return (req, res, next) => {
        if (!req.session) {
            req.session = {};
        }
        next();
    };
};
//# sourceMappingURL=session.js.map