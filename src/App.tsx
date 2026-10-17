import './App.css'
import Student from './Student'

function App() {
  return (
    <>
      <Student name="Spongebob" age={30} isEnrolled={true} />
      <Student name="Patrick" age={25} isEnrolled={false} />
      <Student name="Polly" age={29} isEnrolled={true} />
      <Student />
    </>
  )
}


export default App


