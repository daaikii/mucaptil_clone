import { useEffect, useState } from 'react'
import Canvas from "../canvas"

const TCanvas = () => {
  const [canvas, setCanvas] = useState<Canvas>()
  useEffect(() => {
    const canvas = Canvas.instance
    setCanvas(canvas)
  }, [])
  return (
    <canvas id="canvas" />
  )
}

export default TCanvas