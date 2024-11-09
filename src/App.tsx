import './App.css'
import TCanvas from "./components/TCanvas"

function App() {
  return (
    <div className='main'>
      <TCanvas />
      <div className='contents'>
        <section className='top display'>
          <h2 className='section-title'>クローンサイトです</h2>
          <div className="top-source">
            <p>こちらを参考に作成しました</p>
            <a className='top-source-link' href='https://www.mucap.co.jp/50th/' >https://www.mucap.co.jp/50th/</a>
          </div>
        </section>
        <section>
          <h2 className='section-title'>作成した理由</h2>
          <p>複数のメッシュにランダムなテクスチャを割り当てる方法を学習するため作成しました。</p>
          <p></p>
        </section>
        <section>
          <h2 className='section-title'>使用した技術</h2>
          <p>慣性スクロール</p>
          <p>gsapでのアニメーション</p>
          <p>ノイズを使用したランダムなスケール</p>
          <p>alphaMap</p>
          <p>postprocess+ピンポンループ</p>
          <p>raycaster</p>
        </section>
      </div>
    </div>
  )
}

export default App
