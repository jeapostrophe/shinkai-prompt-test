
  // These environment variables are required, before any import.
  // Do not remove them, as they set environment variables for the Shinkai Tools.
  Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  Deno.env.set('BEARER', "debug");
  Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  Deno.env.set('HOME', "results/typescript/typescript-00009-benchmark-store-website/qwen2-5-coder-32b/editor/home");
  Deno.env.set('MOUNT', "results/typescript/typescript-00009-benchmark-store-website/qwen2-5-coder-32b/editor/mount");
  Deno.env.set('ASSETS', "results/typescript/typescript-00009-benchmark-store-website/qwen2-5-coder-32b/editor/assets");
  
import { getHomePath } from './shinkai-local-support.ts';
import { shinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { content: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const homePath = getHomePath();
    const databaseName = 'default';
    
    // Create table if it doesn't exist
    await shinkaiSqliteQueryExecutor(databaseName, `
        CREATE TABLE IF NOT EXISTS website_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            content TEXT NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Fetch the website content
    const response = await fetch(inputs.url);
    if (!response.ok) {
        throw new Error(`Failed to fetch the website: ${inputs.url}`);
    }
    const content = await response.text();

    // Insert or update the website content in the database
    await shinkaiSqliteQueryExecutor(databaseName, `
        INSERT INTO website_content (url, content)
        VALUES (?, ?)
        ON CONFLICT(url) DO UPDATE SET content=excluded.content, last_updated=CURRENT_TIMESTAMP;
    `, [inputs.url, content]);

    // Retrieve the entire table
    const result = await shinkaiSqliteQueryExecutor(databaseName, 'SELECT * FROM website_content;');
    
    return { content: JSON.stringify(result.result) };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"url":"https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html"}')
  
  try {
    const program_result = await run({}, {"url":"https://raw.githubusercontent.com/acedward/expert-octo-computing-machine/main/test.html"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

