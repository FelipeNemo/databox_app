import "./service.css"
import services from "../../assets/services"

const scrollToDetail = (idx) => {
  const el = document.getElementById(`service-detail-${idx}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const Service = () => {
  return (
    <>
      {services.map((service, index) => (
        <div className="service-container" key={service.name} onClick={() => scrollToDetail(index)} style={{ cursor: 'pointer' }}>
          <div className="service-icon">
            <img src={service.image} alt="service-icon" />
          </div>
          <div className="service-head">
            <h5>{service.name}</h5>
          </div>
          <div className="service-body">
            <p>{service.body}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Service;