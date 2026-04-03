const fs = require('fs');
const path = 'app/prisma/schema.prisma';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/    Character               Character\[\]\n\}/, '    Character               Character[]\n    WorldState          WorldState?\n}');
code = code.replace(/    encombrement String\? @db\.Text\n\n\n\}/, '    encombrement String? @db.Text\n    Groupe       Groupe? @relation(fields: [groupeId], references: [id], onDelete: Cascade)\n    groupeId     Int?    @unique\n}');
code = code.replace(/    id          Int     @id @default\(1\)/, '    id          Int     @id @default(autoincrement())');

fs.writeFileSync(path, code);
