import { ref, type Ref } from 'vue'
import { toPng } from 'html-to-image'

interface GeneratedImage {
  url: string
  blob: Blob
  name: string
}

export function useScreenshot(elementToCapture: Ref<HTMLElement | null>) {
  const isCapturing = ref(false)
  const generatedImage = ref<GeneratedImage | null>(null)
  const error = ref<string | null>(null)

  const capture = async () => {
    if (!elementToCapture.value) {
      const msg = 'Target element for screenshot is not available.'
      console.error(msg)
      error.value = msg
      return
    }

    isCapturing.value = true
    generatedImage.value = null
    error.value = null // Reset error on new capture

    try {
      const dataUrl = await toPng(elementToCapture.value, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true, // Force reflow and resource loading
      })

      const blob = await (await fetch(dataUrl)).blob()

      generatedImage.value = {
        url: dataUrl,
        blob,
        name: 'evaluation-result.png',
      }
    } catch (e) {
      const msg = 'Failed to generate image'
      console.error(msg, e)
      error.value = e instanceof Error ? e.message : String(e) // Return raw error
    } finally {
      isCapturing.value = false
    }
  }

  const copyToClipboard = async () => {
    if (!generatedImage.value) return
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': generatedImage.value.blob,
        }),
      ])
    } catch (error) {
      console.error('Failed to copy image to clipboard:', error)
    }
  }

  const downloadImage = () => {
    if (!generatedImage.value) return
    const link = document.createElement('a')
    link.href = generatedImage.value.url
    link.download = generatedImage.value.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const reset = () => {
    generatedImage.value = null
  }

  return {
    isCapturing,
    generatedImage,
    error,
    capture,
    copyToClipboard,
    downloadImage,
    reset,
  }
}
