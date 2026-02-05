const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../public/assets/images');

// Configuração
const MAX_WIDTH = 1920;
const QUALITY = 80;

if (!fs.existsSync(directoryPath)) {
    console.error(`Diretório não encontrado: ${directoryPath}`);
    process.exit(1);
}

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Não foi possível escanear o diretório: ' + err);
    }

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const ext = path.extname(file).toLowerCase();

        // Apenas processar imagens PNG ou JPG que não sejam ainda WebP
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const fileName = path.basename(file, ext);
            const outputPath = path.join(directoryPath, `${fileName}.webp`);

            // Verificar o tamanho do arquivo original
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            console.log(`Processando: ${file} (${sizeMB} MB)...`);

            sharp(filePath)
                .resize({
                    width: MAX_WIDTH,
                    withoutEnlargement: true // Não aumentar se for menor que o máximo
                })
                .webp({ quality: QUALITY })
                .toFile(outputPath)
                .then(info => {
                    const newSizeMB = (info.size / (1024 * 1024)).toFixed(2);
                    const reduction = ((1 - (info.size / stats.size)) * 100).toFixed(1);
                    console.log(`✅ Sucesso: ${fileName}.webp gerado.`);
                    console.log(`   Tamanho: ${newSizeMB} MB (Redução de ${reduction}%)`);
                })
                .catch(err => {
                    console.error(`❌ Erro ao processar ${file}:`, err);
                });
        }
    });
});
