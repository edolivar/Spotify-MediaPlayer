import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function getQuadPopColor(arr, chunkSize) {
    let m = new Map();
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize).toString();
        if (m.get(chunk) === undefined) {
            m.set(chunk, 1)
        } else {
            const cnt = m.get(chunk)
            m.set(chunk, cnt + 1)
        }
    }
    return [...m.entries()].sort((a, e) => e[1] - a[1]).slice(0, 2).map(e => { return e[0] })
}

function sliceIntoChunks(arr, chunkSize) {
    let result = []

    for (let quadRow = 0; quadRow < 3; quadRow++) {
        for (let quadCol = 0; quadCol < 3; quadCol++) {
            let temp = []
            for (let i = 0; i < 160; i++) {
                let start = (i * 480 * 4) + (quadRow * 160 * 4) + (quadCol * 160 * 4)
                let end = start + (160 * 4)
                temp = [...temp, ...arr.slice(start, end)]
            }

            result = [...result, ...getQuadPopColor(temp, 4)]
            temp = []
        }

    }
    return result
}

function draw(ctx, imageURL, setRawPixel) {
    ctx.clearRect(0, 0, 480, 480);
    const newImage = new Image();
    newImage.src = imageURL
    newImage.crossOrigin = 'Anonymous'

    newImage.onload = () => {
        ctx.drawImage(newImage, 0, 0, 480, 480)
        setRawPixel(ctx.getImageData(0, 0, 480, 480).data)
    }

}

const Canvas = ({ url, height, width }) => {
    const [rawPixel, setRawPixel] = useState()
    const [cnter, setCount] = useState(0)
    const [bColor, setbColor] = useState()

    useEffect(() => {
        if (rawPixel) {
            const main_pixels = sliceIntoChunks(rawPixel, 4)
            setbColor(Array.from(new Set(main_pixels)))
        }
    }, [rawPixel])


    useInterval(() => {
        if (bColor) {
            if (cnter >= bColor.length - 1) {
                setCount(0)
            } else {
                setCount(cnter + 1)
            }
            const [r, g, b] = bColor[cnter].split(',')
            document.body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')'
        }
    }, 1500)

    const canvas = React.useRef();

    React.useEffect(() => {
        const context = canvas.current.getContext('2d', { willReadFrequently: true });
        draw(context, url, setRawPixel);
    }, [url]);
    return (
        <canvas ref={canvas} height={height} width={width} />
    );
};

Canvas.propTypes = {
    url: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
};

const MemoCanvas = React.memo(Canvas)
export default MemoCanvas;