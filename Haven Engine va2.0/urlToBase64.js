const getBase64FromUrl = async (url) => {
    let data = await fetch(url);
    data = data.status !== 200 ? await fetch("https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg") : data;
    console.log(data);
    let blob = await data.blob();
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            let base64data = reader.result;   
            resolve(base64data);
        }
    });
};

export default getBase64FromUrl;