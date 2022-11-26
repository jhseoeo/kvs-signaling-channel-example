function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function max(a, b) {
    return a > b ? a : b;
}

function min(a, b) {
    return a < b ? a : b;
}

function imageBitmapToBlob(imgbmp) {
    return new Promise((resolve) => {
        let canvas = document.createElement("canvas");
        canvas.width = imgbmp.width;
        canvas.height = imgbmp.height;
        let ctx = canvas.getContext("bitmaprenderer");
        ctx.transferFromImageBitmap(imgbmp);
        canvas.toBlob((blob) => {
            canvas = null;
            ctx = null;
            resolve(blob);
        }, "image/jpeg");
    });
}

module.exports = {
    sleep,
    max,
    min,
    imageBitmapToBlob,
};
