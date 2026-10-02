const createFallbackAnalysis = ({
    missingTechnicalSkills = [],
    missingSoftSkills = [],
    missingPreferredSkills = [],
}) => {
    const recommendations = [];

    if (missingTechnicalSkills.includes("Node.js")) {
        recommendations.push(
            "Build a backend project using Node.js to demonstrate server-side development."
        );
    }

    if (missingTechnicalSkills.includes("Express.js")) {
        recommendations.push(
            "Use Express.js in a full-stack project to demonstrate backend API development."
        );
    }

    if (missingTechnicalSkills.includes("REST APIs")) {
        recommendations.push(
            "Build and document REST APIs and integrate them with a frontend project."
        );
    }

    if (missingTechnicalSkills.includes("Docker")) {
        recommendations.push(
            "Learn Docker fundamentals and containerize one of your existing applications."
        );
    }

    if (missingTechnicalSkills.includes("Problem Solving")) {
        recommendations.push(
            "Add concrete problem-solving achievements or DSA examples to your resume."
        );
    }

    if (missingSoftSkills.includes("Communication Skills")) {
        recommendations.push(
            "Highlight teamwork, presentations, collaboration, or communication experience."
        );
    }

    if (missingPreferredSkills.includes("AWS")) {
        recommendations.push(
            "Add a cloud deployment project using AWS."
        );
    }

    if (missingPreferredSkills.includes("TypeScript")) {
        recommendations.push(
            "Use TypeScript in a React or Node.js project."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "Continue strengthening the skills already relevant to this role and add measurable project outcomes."
        );
    }

    const keywordGaps = [
        ...missingTechnicalSkills,
        ...missingSoftSkills,
        ...missingPreferredSkills,
    ];

    return {
        summary:
            "The resume demonstrates several skills relevant to this role, but some requirements are not clearly represented. Strengthening the missing areas can improve alignment with the job description.",

        keywordGaps: keywordGaps.slice(0, 5),

        recommendations:
            recommendations.slice(0, 5),
    };
};

module.exports = {
    createFallbackAnalysis,
};