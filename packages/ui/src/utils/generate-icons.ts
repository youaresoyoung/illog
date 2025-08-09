import { readdirSync, write, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = join(__dirname, "../../src/assets/svg");
const files = readdirSync(dir).filter((file) => file.endsWith(".svg"));

const imports = files
  .map((file) => {
    const name = file.replace(".svg", "");
    return `import ${name} from './${file}?react';`;
  })
  .join("\n");

const iconNames = files
  .map((file) => `'${file.replace(".svg", "")}'`)
  .join(" | ");
const iconExports = files
  .map((file) => {
    const name = file.replace(".svg", "");
    return `  ${name}`;
  })
  .join(",\n");

const iconNameType = `export type IconName = ${iconNames};\n`;
const iconDefaultExport = `export default {\n${iconExports}\n};\n`;

writeFileSync(
  join(__dirname, "../../src/assets/svg/index.ts"),
  `${imports}\n\n${iconDefaultExport}`
);
writeFileSync(
  join(__dirname, "../../src/components/Icon/types.ts"),
  `${iconNameType}`
);
