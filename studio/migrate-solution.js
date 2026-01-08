import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2021-06-07' })

const query = `*[_type == "project" && defined(solution) && defined(gallery)]`

async function migrate() {
    console.log('Iniciando migração...')

    // Fetch projects
    try {
        const projects = await client.fetch(query)
        console.log(`Encontrados ${projects.length} projetos para migrar.`)

        for (const project of projects) {
            // Create new solution block
            const solutionBlock = {
                _type: 'solution',
                _key: Math.random().toString(36).substring(7),
                text: project.solution
            }

            // Add to the end of the gallery
            // We use insert 'after' last item in gallery to be safe, or just set if replacing.
            // But patch set is easier for arrays if we just append locally.
            const updatedGallery = [...(project.gallery || []), solutionBlock]

            console.log(`Migrando projeto: ${project.title}...`)

            await client
                .patch(project._id)
                .set({ gallery: updatedGallery })
                .commit()

            console.log(`SUCCESS: ${project.title} atualizado!`)
        }
    } catch (err) {
        console.error('Erro na migração:', err)
    }
}

migrate()
