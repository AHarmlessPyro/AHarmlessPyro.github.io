(function () {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 320;    // We will scale the photo width to this
    var height = 240;     // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var canvas2 = null;
    var hasPrinted = false;
    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        canvas2 = document.getElementById('canvasOut');
        // startbutton = document.getElementById('startbutton');
        // debugger;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });

        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                devices.forEach(function (device) {
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                });
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            });


        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                canvas2.setAttribute('width', width);
                canvas2.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        video.addEventListener('play', computeFrame);

        function computeFrame() {
            let context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, width, height);
            let frame = context.getImageData(0, 0, width, height);
            let contextOut = canvas2.getContext('2d');

            if (!hasPrinted) {
                console.log(frame);
                hasPrinted = true;
            }
            //debugger;
            let promise = new Promise((resolve) => { computeFunction(frame, resolve) });
            promise.then((result) => { // result should have gMag and gDir
                contextOut.putImageData(new ImageData(result[0], width, height), 0, 0); // result[0] -> gMag
                setTimeout(computeFrame, 0);
            }
            )
        }

        // startbutton.addEventListener('click', function (ev) {
        //     takepicture();
        //     ev.preventDefault();
        // }, false);

    }

    function computeFunction(frame, resolve) {
        let worker = new Worker('./js/worker.js');

        worker.postMessage({
            data: frame.data.buffer,
            width: frame.width,
            height: frame.height
        }, [
            frame.data.buffer
        ]);
        worker.onmessage = (e) => {
            worker.terminate();
            return resolve([e.data.gMag, e.data.gDir]);
        }

    }

    // Fill the photo with an indication that none has been
    // captured.

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            //photo.setAttribute('src', data);
        } else {
            //clearphoto();
        }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();
