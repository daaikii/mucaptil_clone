import { useEffect} from 'react'
import Canvas from "../canvas"

const TCanvas = () => {
  useEffect(() => {
    Canvas.instance
  }, [])
  return (
    <canvas id="canvas" />
  )
}

export default TCanvas