
  if (!Deno.env.has('SHINKAI_NODE_LOCATION')) Deno.env.set('SHINKAI_NODE_LOCATION', "http://localhost:9950");
  if (!Deno.env.has('BEARER')) Deno.env.set('BEARER', "debug");
  if (!Deno.env.has('X_SHINKAI_TOOL_ID')) Deno.env.set('X_SHINKAI_TOOL_ID', "tool-id-debug");
  if (!Deno.env.has('X_SHINKAI_APP_ID')) Deno.env.set('X_SHINKAI_APP_ID', "tool-app-debug");
  if (!Deno.env.has('X_SHINKAI_LLM_PROVIDER')) Deno.env.set('X_SHINKAI_LLM_PROVIDER', "o_qwen2_5_coder_32b");
  
import { localRustToolkitShinkaiSqliteQueryExecutor } from './shinkai-local-tools.ts';

type CONFIG = {};
type INPUTS = { person_name: string, time_period: string, topic?: string };
type OUTPUT = { conversation: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
    const { person_name, time_period, topic } = inputs;

    // Query the local database for historical figure data
    const query = `
        SELECT * FROM historical_figures
        WHERE name LIKE ? AND time_period LIKE ?
        LIMIT 1;
    `;
    const params = [`%${person_name}%`, `%${time_period}%`];
    const result = await localRustToolkitShinkaiSqliteQueryExecutor(query, params);

    if (!result || result.length === 0) {
        return { conversation: `No historical figure found for ${person_name} in the ${time_period} period.` };
    }

    const historicalFigure = result[0];
    let conversationTopic = topic ? topic : `general life and times`;

    // Simulate a conversation based on the historical figure's data
    const conversation = `
        Interviewer: Hello, could you tell us about your experiences in the ${time_period}?
        ${historicalFigure.name}: Of course. My name is ${historicalFigure.name}, and during my time in the ${historicalFigure.time_period}, I was deeply involved in ${historicalFigure.major_contributions}.
        Interviewer: That's fascinating! Could you elaborate on your work related to ${conversationTopic}?
        ${historicalFigure.name}: Indeed. Regarding ${conversationTopic}, ${historicalFigure.additional_details}.
    `;

    return { conversation };
}

  
  // console.log('Running...')
  // console.log('Config: {}')
  // console.log('Inputs: {"person_name":"Albert Einstein","time_period":"1920s","topic":"relativity"}')
  
  try {
    const program_result = await run({}, {"person_name":"Albert Einstein","time_period":"1920s","topic":"relativity"});
    if (program_result) console.log(JSON.stringify(program_result, null, 2));
    else console.log(program_result);
  } catch (e) {
    console.log('::ERROR::', e);
  }

