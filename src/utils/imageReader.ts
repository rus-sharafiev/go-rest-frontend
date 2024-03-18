/**
 * Creates thumbnail for the provided image File
 * 
 * @param file - A source image file
 * @param targetWidth - target thumbnail width 
 * @param targetHeight - target thumbnail height 
 * @param useDevicePixelRatio - whether to enlarge target thumbnail size according to device pixel ratio. Default `true`
 * @returns Promise which resolves to a blob URL
 */
export const createThumbnail = async (file: File, targetWidth: number, targetHeight: number, useDevicePixelRatio: boolean | undefined = true): Promise<string> =>
    new Promise((resolve, reject) => {

        const width = useDevicePixelRatio ? targetWidth * window.devicePixelRatio : targetWidth
        const height = useDevicePixelRatio ? targetHeight * window.devicePixelRatio : targetHeight

        createImageBitmap(file)
            .then((img => {
                const canvas = new OffscreenCanvas(width, height)

                const canvasSmallSide = Math.min(width, height)
                const canvasAspectRatio = width / height
                const bitmapAspectRatio = img.width / img.height

                let bitmapWidth, bitmapHeight, offsetX = 0, offsetY = 0

                if (bitmapAspectRatio >= canvasAspectRatio) {
                    bitmapWidth = height * bitmapAspectRatio
                    bitmapHeight = height
                    offsetX = -(bitmapWidth - width) / 2
                } else {
                    bitmapWidth = width
                    bitmapHeight = width / bitmapAspectRatio
                    offsetY = -(bitmapHeight - height) / 2
                }

                canvas.getContext("2d")?.drawImage(img, offsetX, offsetY, Math.round(bitmapWidth), Math.round(bitmapHeight))

                return canvas.convertToBlob()
            }))
            .then(resultBlob => {
                resolve(URL.createObjectURL(resultBlob))
            })
            .catch(e => {
                reject(e)
            })
    })

export default createThumbnail