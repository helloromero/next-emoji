import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss'
import io from 'socket.io-client'
let socket = io();

export default function Foo(props) {
    const emojis = ['🥝', '🍓', '🫐', '🍋', '🍑', '🍆', '🍊', '🥔']
    const [emojiArray, setEmojiArray] = useState(emojis)

  function push(emojiState) {
    socket.emit('emojiState', emojiState)
    socket.on('emojiState', function (emoji) {
      setEmojiArray(emoji)
    });
  }
  function updateEmojiArrays(emojiIndex) {
    let newState = [ ...emojiArray ];
    newState[emojiIndex] += emojis[emojiIndex]
    push(newState)
  }

  useEffect(() => {
    // updates history for local user on load
    socket.on('history', function (history) {
      push(history)
    });
  }, [])

  return (
    <div className={styles['button-wrapper']}>
      {/* <i>some emojis on a page that you can click lol</i> */}
      {emojiArray.map((img, index) => 
        <button key={index} onClick={() => updateEmojiArrays(index)}>{img}</button>
      )}
    </div>
  )
}
