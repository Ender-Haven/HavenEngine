function graphicsInit(ctx, canvas) {
    window.background = hex => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("editorCanvas").style.background = hex;
    };
    window.fill = hex => {
        ctx.fillStyle = hex;
    };
    window.stroke = hex => {
        ctx.strokeStyle = hex;
    };
    window.rect = (x, y, w, h) => {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.stroke();
    };
    window.base64Image = (base64, x, y, w, h) => {
        let image = new Image();
        image.src = base64;
        image.onload = () => ctx.drawImage(image, x, y, w, h);
    }
}

export default graphicsInit;