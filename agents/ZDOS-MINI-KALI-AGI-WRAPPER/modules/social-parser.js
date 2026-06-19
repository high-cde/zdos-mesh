// social-parser.js
// estrazione tech stack, repo pubblici, esposizione tecnica

class SocialParser {
    parseGithub(rawData) {
        const techStack = [];
        const publicRepos = [];
        let technicalExposure = {};

        if (rawData.public_repos) {
            rawData.public_repos.forEach(repo => {
                publicRepos.push({ name: repo.name, url: repo.url });
                // Simulate tech stack extraction from repo names or descriptions
                if (repo.name.includes("node")) techStack.push("Node.js");
                if (repo.name.includes("python")) techStack.push("Python");
                if (repo.name.includes("react")) techStack.push("React");
            });
        }

        if (rawData.email) {
            technicalExposure.email = rawData.email;
        }

        return {
            tech_stack: [...new Set(techStack)], // Remove duplicates
            public_repos: publicRepos,
            technical_exposure: technicalExposure
        };
    }

    parse(platform, rawData) {
        switch (platform) {
            case "github": return this.parseGithub(rawData);
            default: return { raw: rawData };
        }
    }
}

module.exports = SocialParser;
