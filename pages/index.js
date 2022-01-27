import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss'
import io from 'socket.io-client'
let socket = io();

export default function Foo(props) {
    const emojis = ['🥝', '🍑', '🫐', '🍋', '🍓', '🍆', '🍊', '🥔']
    const [emojiArray, setEmojiArray] = useState(emojis)
    const [time, setTime] = useState(0)

  // pushes emoji state to server
  function push(emojiState) {
    socket.emit('emojiState', emojiState)
    socket.on('emojiState', function (emoji) {
      setEmojiArray(emoji)
    });
  }

  // updates local emoji state
  function updateEmojiArrays(emojiIndex) {
    const d = new Date();
    let ms = d.getMilliseconds();
    let newState = [ ...emojiArray ];
    newState[emojiIndex] += emojis[emojiIndex]
    push(newState)
    // push and update current time
    socket.emit('time', ms)
    socket.on('time', function (time) {
      setTime(time)
    });
  }

  // updates history for local user on load
  useEffect(() => {
    socket.on('history', function (history) {
      push(history)
    });
  }, [])

  return (
    <div className={styles['button-wrapper']}>
      <span className={styles['time']}>{time}</span>
      {emojiArray.map((img, index) => 
        <button key={index} onClick={() => updateEmojiArrays(index)}>{img}</button>
      )}
    </div>
  )
}
