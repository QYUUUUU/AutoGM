const fs = require('fs');
const schemaPath = 'app/prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model Faveur')) {
schema += `
model Faveur {
  id          Int      @id @default(autoincrement())
  nom         String
  domaine     String
  type        String   @default("Mineure")
  stade       String   @default("Rencontre")
  description String   @db.Text
}
`;
fs.writeFileSync(schemaPath, schema);
}
