// Run this script with: node guidelines/patch-ids.js
// Make sure to set SANITY_TOKEN environment variable before running
// export SANITY_TOKEN="your_token_here"

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'mxq3x3cp',
    dataset: 'production',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
    apiVersion: '2023-05-03',
});

const patches = [
    { title: "Nexus Financial", id: 1 },
    { title: "Aura Health", id: 2 },
    { title: "Velocita Shop", id: 3 },
    { title: "Echo AI Platform", id: 4 },
    { title: "Urban Mobility", id: 5 },
    { title: "Creative Hub", id: 6 }
];

const patchIds = async () => {
    // Fetch all projects
    const projects = await client.fetch('*[_type == "project"]{_id, title}');

    for (const p of projects) {
        const match = patches.find(patch => patch.title === p.title);
        if (match) {
            try {
                await client.patch(p._id).set({ id: match.id }).commit();
                console.log(`Patched ${p.title} with id ${match.id}`);
            } catch (err) {
                console.error(`Failed to patch ${p.title}`, err);
            }
        }
    }
};

patchIds();
