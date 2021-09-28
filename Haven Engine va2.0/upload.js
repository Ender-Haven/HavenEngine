const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function getUpload(input) {
    input = typeof input === "string" ? document.getElementById(input) : input;

    let files = Array.from(input.files);
    files = await Promise.all(files.map(async (v, i) => await toBase64(v)));

    return files;
}

export default getUpload;