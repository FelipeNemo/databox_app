import "./doctor.css"
import doctors from "../../assets/doctors"

const Doctor = () => {
    return (
        <>
        {doctors.map((doctor, index) => (
        
            <div className="doctor-container" key={index}>

                <div className="doctor-image">
                    <img src={doctor.image} alt="doctor-image" />
                </div>

                <div className="doctor-details">
                    <h6>{doctor.name}</h6>
                    <p>{doctor.department}</p>
                </div>

            </div>

))}
        </>
    )
}

export default Doctor