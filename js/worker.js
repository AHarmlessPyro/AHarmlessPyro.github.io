function frameGrab(frame, centerPixelX, centerPixelY, width, height) {

    const positionsToGet = [
        [-1, 1], [0, -1], [+1, -1],
        [-1, 0], [0, 0], [+1, 0],
        [-1, 1], [0, +1], [+1, +1]
    ];

    let pixels = positionsToGet.map((position) => {
        let posX = 0;
        let posY = 0;
        if (centerPixelX + position[0] < 0 || centerPixelX + position[0] > frame.width - 1) {
            posX = centerPixelX - position[0];
        } else {
            posX = centerPixelX + position[0];
        }
        if (centerPixelY + position[1] < 0 || centerPixelY + position[1] > frame.height - 1) {
            posY = centerPixelY - position[1];
        } else {
            posY = centerPixelY + position[1];
        }
        let finalPosition = posX * 4 + width * posY * 4;
        let R = frame[finalPosition] / 255.0
        let G = frame[finalPosition + 1] / 255.0
        let B = frame[finalPosition + 2] / 255.0
        return 0.21 * R + 0.72 * G + 0.07 * B;
    })

    let gX =
        -1 * pixels[0] + 0 * pixels[1] + 1 * pixels[2] +
        -2 * pixels[3] + 0 * pixels[4] + 2 * pixels[5] +
        -1 * pixels[6] + 0 * pixels[7] + 1 * pixels[8];

    // gX = (gX + 4) / 8;
    let gY =
        -1 * pixels[0] - 2 * pixels[1] - 1 * pixels[2] +
        0 * pixels[3] + 0 * pixels[4] + 0 * pixels[5] +
        1 * pixels[6] + 2 * pixels[7] + 1 * pixels[8];


    // gY = (gY + 4) / 8;
    let gMagnitude = Math.sqrt(Math.pow(gX, 2) + Math.pow(gY, 2));
    gMagnitude = gMagnitude / (4 * Math.SQRT2);
    let gTheta = Math.atan2(gY, gX);
    return [gMagnitude, gTheta];
    //return [gX, 0];
}


onmessage = function (e) { // e => frame, gMag, gDir
    //self.console.log(e.data);
    // debugger;
    let clampedArray = new Uint8ClampedArray(e.data.data);

    //frame = new ImageData(clampedArray, e.data.height, e.data.width);

    let gMag = new Uint8ClampedArray(e.data.width * e.data.height * 4);
    let gDir = new Uint8ClampedArray(0);

    let count = 0;
    for (let i = 0; i < e.data.height; i++) {
        for (let j = 0; j < e.data.width; j++) {
            let value = frameGrab(clampedArray, j, i, e.data.width, e.data.height);
            // value = value > 0.5 ? 1.0 : 0.0;
            gMag[4 * count + 0] = /*parseInt(value[0] * 255);*/255;
            gMag[4 * count + 1] = /*parseInt(value[0] * 255);*/0;
            gMag[4 * count + 2] = /*parseInt(value[0] * 255);*/0;
            gMag[4 * count + 3] = /*255;*/parseInt((value[0]) * 255);
            gDir[4 * count + 0] = /*parseInt(value[1]);*/255;
            gDir[4 * count + 1] = /*parseInt(value[1]);*/0;
            gDir[4 * count + 2] = /*parseInt(value[1]);*/0;
            gDir[4 * count + 3] = /*255;*/parseInt((value[0]) * 255);
            count++;
        }
    }
    // debugger;
    postMessage({
        gMag: gMag,
        gDir: gDir
    }, [gMag.buffer, gDir.buffer]);
}