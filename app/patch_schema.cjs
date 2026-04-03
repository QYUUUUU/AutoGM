const fs = require('fs');
const path = 'prisma/schema.prisma';
let code = fs.readFileSync(path, 'utf8');

const newFields = `    sinlaPhase   String  @default("Nouvelle")
    akhatState   String  @default("Eteinte")
    loisCoutumes String? @db.Text
    rations      Int?    @default(0)
    etatMontures String? @db.Text
    encombrement String? @db.Text
`;

code = code.replace(/    sinlaPhase  String  @default\("Nouvelle"\)\n    akhatState  String  @default\("Eteinte"\)/, newFields);
fs.writeFileSync(path, code);
