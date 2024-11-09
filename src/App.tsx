import './App.css'
import TCanvas from "./components/TCanvas"

function App() {
  return (
    <div className='main'>
      <TCanvas />
      <div className='contents'>
        <section className='top display'>
          <div className='fixed'>
            <h2 className='section-title'>クローンサイトです</h2>
            <div className="top-source">
              <p>こちらを参考に作成しました</p>
              <a className='top-source-link' href='https://www.mucap.co.jp/50th/' >https://www.mucap.co.jp/50th/</a>
            </div>
          </div>
        </section>
        <section>

        </section>
        <section>

        </section>
      </div>
    </div>
  )
}

export default App
