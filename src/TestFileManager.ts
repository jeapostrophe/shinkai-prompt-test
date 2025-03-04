import path from "node:path";
import { exists } from "jsr:@std/fs/exists";
import { Language } from "./types.ts";
import { Test } from "./Test.ts";
import { BaseEngine } from "./llm-engines.ts";

export class TestFileManager {
      
    public toolDir: string;
    private static basePath = path.join(Deno.cwd(), '.execution');

    constructor(language: Language, test: Test, model: BaseEngine) {
        this.toolDir = path.join(
            TestFileManager.basePath,
            model.path,
            test.code,
            language,
          );          
    }

    async log(message: string, stdout: boolean = false) {
        const filePath = path.join(this.toolDir, `log.txt`);
        await Deno.mkdir(this.toolDir, { recursive: true });
        const file = await Deno.open(filePath, { create: true, append: true});
        await file.write(new TextEncoder().encode(message + '\n'));
        file.close();
        if (stdout) {
            console.log(message);
        }
    }

    async save(step: number, substep: 'a' | 'b' | 'c' | 'd', text: string, fileName: string) {
        const filePath = path.join(this.toolDir, `step_${step}.${substep}.${fileName}`);
        await Deno.mkdir(this.toolDir, { recursive: true });
        await Deno.writeTextFile(filePath, text);
    }
    async load(step: number, substep: 'a' | 'b' | 'c', fileName: string) {
        const filePath = path.join(this.toolDir, `step_${step}.${substep}.${fileName}`);
        return await Deno.readTextFile(filePath);
    }
    
    public static async clearFolder() {
        if (await exists(TestFileManager.basePath)) {
            await Deno.remove(TestFileManager.basePath, { recursive: true });
        }
        await Deno.mkdir(TestFileManager.basePath, { recursive: true });
    }
}