import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, "../../../registry/effects");
const OUTPUT_PATH = path.join(__dirname, "../public/r");

async function buildRegistry() {
  console.log("Building registry...");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  const index = {
    items: [],
  };

  // Walk through registry directories
  const categories = fs.readdirSync(REGISTRY_PATH);

  for (const category of categories) {
    const categoryPath = path.join(REGISTRY_PATH, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const effects = fs.readdirSync(categoryPath);

    for (const effect of effects) {
      const effectPath = path.join(categoryPath, effect);
      if (!fs.statSync(effectPath).isDirectory()) continue;

      const registryJsonPath = path.join(effectPath, "registry.json");
      if (!fs.existsSync(registryJsonPath)) {
        console.warn(`No registry.json found for ${effect}, skipping...`);
        continue;
      }

      // Read registry metadata
      const registryJson = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"));

      // Find component files
      const files = fs
        .readdirSync(effectPath)
        .filter((f) => f.endsWith(".jsx") || f.endsWith(".js"))
        .filter((f) => f !== "registry.json");

      const fileContents = files.map((fileName) => {
        const filePath = path.join(effectPath, fileName);
        const content = fs.readFileSync(filePath, "utf-8");

        return {
          path: fileName,
          type: "registry:component",
          target: `components/effects/${fileName}`,
          content,
        };
      });

      // Build the full registry item
      const registryItem = {
        name: registryJson.name,
        type: registryJson.type || "registry:component",
        title: registryJson.title,
        description: registryJson.description,
        category: registryJson.category || category,
        dependencies: registryJson.dependencies || [],
        registryDependencies: registryJson.registryDependencies || [],
        files: fileContents,
      };

      // Write individual effect JSON
      const outputFile = path.join(OUTPUT_PATH, `${registryJson.name}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(registryItem, null, 2));
      console.log(`  Created ${registryJson.name}.json`);

      // Add to index
      index.items.push({
        name: registryJson.name,
        title: registryJson.title,
        description: registryJson.description,
        category: registryJson.category || category,
        dependencies: registryJson.dependencies || [],
      });
    }
  }

  // Write index
  const indexFile = path.join(OUTPUT_PATH, "index.json");
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
  console.log("  Created index.json");

  console.log(`\nRegistry built successfully! ${index.items.length} effects.`);
}

buildRegistry().catch(console.error);
