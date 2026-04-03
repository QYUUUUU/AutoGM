const fs = require('fs');

let schema = fs.readFileSync('app/prisma/schema.prisma', 'utf8');

// remove previous bad append
let lines = schema.split('\n');
let newLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('model Adversary {')) {
        skip = true;
    }
    if (!skip) {
        newLines.push(lines[i]);
    }
}
schema = newLines.join('\n');

// Add Adversary relation to User
if (!schema.includes('Adversary Adversary[]')) {
    schema = schema.replace('FavoriteCharacter FavoriteCharacter[]', 'FavoriteCharacter FavoriteCharacter[]\n    Adversary Adversary[]');
}

const adversaryModel = `
model Adversary {
    id                  Int       @id @default(autoincrement())
    name                String
    description         String?   @db.Text
    type                String?   @default("Humain")
    menace              String?   @default("Mineure")
    experience          String?   @default("Débutant")
    role                String?   @default("Mineur")
    attaque             String?   @default("3D")
    contact             String?   @default("5/7")
    action              String?   @default("3D")
    specialite          String?   @default("4D")
    specialite_details  String?   @db.Text
    relances            String?   @default("0D")
    reserve             String?   @default("0D")
    reaction            String?   @default("3D")
    arme                String?   @db.VarChar(255)
    armure              String?   @db.VarChar(255)
    blessuresLegeres    Int       @default(2)
    blessuresGraves     Int       @default(3)
    blessuresMortelles  Int       @default(4)
    capacites           String?   @db.Text
    userId              Int?
    User                User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
`;

schema += adversaryModel;
fs.writeFileSync('app/prisma/schema.prisma', schema);
console.log('Fixed schema.');

