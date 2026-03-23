#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("hyperiux")
  .description("CLI for adding Hyperiux UI effects to your project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize Hyperiux in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(init);

program
  .command("add")
  .description("Add an effect to your project")
  .argument("<effect>", "The effect to add")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("--dry-run", "Show what would be installed without installing")
  .action(add);

program
  .command("list")
  .description("List all available effects")
  .action(list);

program.parse();
