import StoreApp from './components/StoreApp'
import './App.css'

function App() {
  return (
    <div className="app-video-layout">
      <div className="app-video-background" aria-hidden="true">
        <video
          className="app-video-media"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="https://a.venum.com/f/117261/x/cfbb1a3834/vdef-banniere-kai-asakura-desk-1.mp4"
            type="video/mp4"
          />
        </video>
        <div className="app-video-overlay" />
      </div>

      <div className="app-content-layer">
        <StoreApp />
      </div>
    </div>
  )
}

export default App
