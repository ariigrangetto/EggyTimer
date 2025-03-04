import { useState, useEffect, useRef } from 'react'
//useRef es un objeto mutable cuya propiedad .current persiste entre renders sin causar renderizado del componente
//controlamos el audio sin que react re-renderice el componente
import './App.css'
//Importando imagenes
import runnyEggImg from "./assets/runnyeggs.jpeg";
import creamyEggImg from "./assets/creamyyolk.jpeg";
import cookedEggImg from "./assets/cookedyolk.jpeg";
import hardEggImg from "./assets/hardyolk.jpeg";

const TimePanel = ({imgSRC, time, closePanel}) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(time);
  const [timerRunning, setTimeRunning] = useState(false);
  const [imgClass, setImgClass] = useState("jumping");
  //useState para el texto y los dots
  const [dots, setDots] = useState("...");
  const [status, setStatus] = useState("Your egg is ready in");
  const [dotsInterval, setDotsInterval] = useState(null);
  //audio
  const audioRef = useRef(null);

  //renderizamos cuando este contando el tiempo
  useEffect(() =>{
    setTimeRunning(true);
  }, []);


  //Generamos el tiempo y renderizamos:
  useEffect(()=>{
    let interval; 
    if(timerRunning){
      interval = setInterval(()=>{
        if(minutes === 0 && seconds === 0){
          clearInterval(interval);
          //AL FINALIZAR EL TIEMPO:
          //actualizamos el texto
          setStatus("Done!");
          //eliminamos la animacion de la imagen
          setImgClass("");
          //creamos el audio
          audioRef.current = new Audio("src/assets/original-phone-ringtone-36558.mp3");
          audioRef.current.play(); 
          //eliminamos los dots
          if(dotsInterval){
            clearInterval(dotsInterval);
          }
        }
        else{
          if(seconds === 0){
            if(minutes > 0){
              setMinutes (minutes - 1);
              setSeconds(59);
            }
          }else{
            setSeconds(seconds - 1);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval); //limpiar cuando se vuelva a renderizar

    //elementos a renderizar
  }, [timerRunning, seconds, minutes, dotsInterval]);

  //al cerrar el panel detenemos el audio y vuelve a comenzar desde 0
  const handleClose = () =>{
    if(audioRef.current){
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    closePanel();
  }

  const updateTime = () =>{
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  //renderizamos el status y cambiamos el texto
  useEffect(()=>{
    if(status === "Done!") return
    const interval = setInterval(()=>{
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    },1000)

    setDotsInterval(interval);
    //actualizamos el contenido de setDotsInterval

    return () => clearInterval(interval);
    //limpiamos cuando se vuelva a renderizar
  }, [status]);

  return (
    <div className='timerDisplay'>
      <div>
        <button onClick={handleClose} id='close' type='button'>x</button>
        <p className='timerDisplayReady'>{status} <span id='dots'>{dots}</span></p>
        <img src={imgSRC} alt="Egg Timer" className={`timerDisplayImg ${imgClass}`} />
        <p className='timerDisplayPTimer'>{updateTime()}</p>

      </div>
    </div>
  )

}

//componente principal
function App() {
  const [panel, setPanel] = useState(null);
  //guardamos los estados para un panel abierto o cerrado

  const handleTimerClick = (time, imgSRC) =>{
    setPanel({time, imgSRC})
  }

  const closePanel = () =>{
    setPanel(null);
  }

  return (
    <>
    {/* si el panel esta cerrado, entonces mostramos el contenedor */}
    {!panel && (
      <div className='container'>
      <h1>Egg Timer 🥚</h1>
      <h2>Choose the type of eggs:</h2>
      <div className="container1">

      <div className='runny'>
      <button onClick={() => handleTimerClick(1, runnyEggImg)}>
        <p>Runny yolk</p>
        <img src={runnyEggImg} alt="RUNNY EGG IMG" />
      </button>
      </div>
      <div className='creamy'>
      <button onClick={() => handleTimerClick(5, creamyEggImg)}>
      <p>Creamy yolk</p>
      <img src={creamyEggImg} alt="CREAMY EGG IMG" />
      </button>
      </div>
      </div>
      <div className="container2">
      <div className='cooked'>
      <button onClick={() => handleTimerClick(7, cookedEggImg)}>
      <p>Cooked yolk</p>
      <img src={cookedEggImg} alt="COOKED EGG IMG" />
      </button>
      </div>
      <div className='hard'>
      <button onClick={() => handleTimerClick(10, hardEggImg)}>
      <p>Hard yolk</p>
      <img src={hardEggImg} alt="HARD EGG IMG" />
      </button>
      </div>
      </div>
      </div>
    )}

      {/* Pasando props al componente TimePanel */}
      {panel &&(
        <TimePanel
        imgSRC={panel.imgSRC}
        time={panel.time}
        closePanel={closePanel}
        />
      )}
    </>
  );
}

export default App
