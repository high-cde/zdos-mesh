// visual-osint.js
// analisi EXIF di immagini fornite dall’utente (locale)

const ExifReader = require("exifreader");
const fs = require("fs");

class VisualOsint {
    async analyzeImage(imagePath) {
        try {
            const data = fs.readFileSync(imagePath);
            const tags = ExifReader.load(data);

            const results = {
                device: tags.Make ? tags.Make.description : "N/A",
                model: tags.Model ? tags.Model.description : "N/A",
                timestamp: tags.DateTimeOriginal ? tags.DateTimeOriginal.description : "N/A",
                geotag: null
            };

            if (tags.GPSLatitude && tags.GPSLongitude) {
                const latitude = tags.GPSLatitude.description;
                const longitude = tags.GPSLongitude.description;
                results.geotag = { latitude, longitude };
            }
            return results;
        } catch (error) {
            console.error(`Error analyzing image ${imagePath}: ${error.message}`);
            return { error: error.message };
        }
    }
}

module.exports = VisualOsint;
