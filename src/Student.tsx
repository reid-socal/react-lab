interface StudentProps {
  name?: string
  age?: number
  isEnrolled?: boolean
}

function Student({ name = "guest", age = 0, isEnrolled = false }: StudentProps) {
  return (
    <div className="student">
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Is Enrolled: {isEnrolled ? "Yes" : "No"}</p>
    </div>
  )
}

export default Student
