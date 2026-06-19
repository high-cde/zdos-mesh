// executor.js
// Wrapper sicuro per comandi esterni (nmap, curl, whois, ecc.)

const { exec } = require("child_process");

class Executor {
    async executeCommand(command, args, timeout = 60000) {
        return new Promise((resolve, reject) => {
            const fullCommand = `${command} ${args.join(" ")}`;
            console.log(`Executing: ${fullCommand}`);

            const child = exec(fullCommand, { timeout: timeout }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Execution error for ${command}: ${error.message}`);
                    // Consider if stderr should be part of the resolved output or always an error
                    return reject(new Error(`Command failed: ${command} - ${stderr || error.message}`));
                }
                if (stderr) {
                    console.warn(`Command ${command} produced stderr: ${stderr}`);
                }
                resolve(stdout);
            });

            // Basic sanitization (more robust sanitization might be needed depending on the command)
            // For now, relying on careful construction of `args` array.
            // Future improvement: implement a whitelist of allowed commands and arguments.
        });
    }
}

module.exports = Executor;
