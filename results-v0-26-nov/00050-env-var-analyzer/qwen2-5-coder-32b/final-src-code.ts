
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import fs from 'npm:fs@0.0.1-security';
import os from 'node:os';

type CONFIG = {};
type INPUTS = { env_file_path?: string, include_system_vars?: boolean };
type ENV_VARIABLES = Record<string, string>;
type OUTPUT = {
    envVariables: ENV_VARIABLES;
    explanation: string[];
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const envFilePath = inputs.env_file_path;
    const includeSystemVars = inputs.include_system_vars ?? false;

    let envVariables: ENV_VARIABLES = {};

    if (envFilePath) {
        try {
            const fileContent = await fs.promises.readFile(envFilePath, 'utf-8');
            envVariables = parseEnvFile(fileContent);
        } catch (error) {
            throw new Error(`Failed to read environment file at ${envFilePath}: ${error.message}`);
        }
    }

    if (includeSystemVars) {
        envVariables = { ...envVariables, ...process.env };
    }

    const explanation = generateExplanation(envVariables);

    return {
        envVariables,
        explanation
    };
}

function parseEnvFile(content: string): ENV_VARIABLES {
    const lines = content.split('\n');
    const envVars: ENV_VARIABLES = {};

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const [key, ...values] = trimmedLine.split('=');
        const value = values.join('=').trim();

        if (key && value !== undefined) {
            envVars[key] = value;
        }
    }

    return envVars;
}

function generateExplanation(envVariables: ENV_VARIABLES): string[] {
    const explanations: string[] = [];

    for (const [key, value] of Object.entries(envVariables)) {
        explanations.push(`The environment variable ${key} is set to "${value}".`);
    }

    if (Object.keys(envVariables).length === 0) {
        explanations.push('No environment variables were found.');
    }

    return explanations;
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"env_file_path":".env","include_system_vars":true}')
  
  try {
    const program_result = await run({}, {"env_file_path":".env","include_system_vars":true});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

