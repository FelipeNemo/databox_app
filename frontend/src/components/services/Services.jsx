import "./services.css"
import Service from "../service/Service"
import ProjectGallery from "../projectGallery/ProjectGallery"
import ServiceDetails from "../service/ServiceDetails"

const Services = () => {
  return (
    <div className="services-container">
        <h3>Serviços disponíveis</h3>

        <div className="services-wrapper">
            <Service />
        </div>
        <ProjectGallery />
        <ServiceDetails />
    </div>
  )
}

export default Services