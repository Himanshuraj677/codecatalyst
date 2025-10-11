"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var adapter_neon_1 = require("@prisma/adapter-neon");
var connectionString = "".concat(process.env.DATABASE_URL);
var adapter = new adapter_neon_1.PrismaNeon({ connectionString: connectionString });
exports.prisma = new client_1.PrismaClient({ adapter: adapter });
