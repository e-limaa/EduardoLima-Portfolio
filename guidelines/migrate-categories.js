// Run this script with: node guidelines/migrate-categories.js
// export SANITY_TOKEN="your_token_here"

const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'mxq3x3cp',
    dataset: 'production',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
    apiVersion: '2023-05-03',
});

const migrate = async () => {
    // 1. Fetch all projects
    const projects = await client.fetch('*[_type == "project"]{_id, category, title}');
    console.log(`Found ${projects.length} projects`);

    // 2. Extract unique categories
    const uniqueCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];
    console.log(`Found categories: ${uniqueCategories.join(', ')}`);

    // 3. Create/Get category documents
    const categoryMap = {}; // "Category Name" -> "category_id"

    for (const catTitle of uniqueCategories) {
        // Check if exists
        const existing = await client.fetch('*[_type == "category" && title == $title][0]', { title: catTitle });

        if (existing) {
            categoryMap[catTitle] = existing._id;
            console.log(`Using existing category: ${catTitle} (${existing._id})`);
        } else {
            const newCat = await client.create({
                _type: 'category',
                title: catTitle
            });
            categoryMap[catTitle] = newCat._id;
            console.log(`Created new category: ${catTitle} (${newCat._id})`);
        }
    }

    // 4. Patch projects
    for (const p of projects) {
        if (!p.category) continue;

        const catId = categoryMap[p.category];
        if (catId) {
            try {
                await client.patch(p._id)
                    .set({ categoryRef: { _type: 'reference', _ref: catId } })
                    .commit();
                console.log(`Linked project "${p.title}" to category "${p.category}"`);
            } catch (err) {
                console.error(`Failed to patch project ${p.title}:`, err.message);
            }
        }
    }
};

migrate().catch(console.error);
