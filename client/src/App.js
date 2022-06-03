import { useState } from "react";
import './App.css';
import Address from "./Partial/Address";
import Map from "./Partial/Map";

const vehicleTypes = {
    'freight_vehicle-vehicle_type_hgv-fuel_source_cng-vehicle_weight_gt_3.5t_lt_7.5t-percentage_load_na': 'CNG HGV (3.5t - 7.5t)',
    'freight_vehicle-vehicle_type_hgv-fuel_source_cng-vehicle_weight_gt_7.5t_lt_12t-percentage_load_na': 'CNG HGV (7.5t - 12t)',
    'freight_vehicle-vehicle_type_truck_light-fuel_source_cng-vehicle_weight_na-percentage_load_na': 'CNG light-duty truck'
};

function App() {
    const [form, setForm] = useState({
        'pickup': undefined,
        'drop_off': undefined,
        'total_weight': undefined,
        'vehicle_type': undefined,
    });

    const handleChange = (field, value) => {
        form[field] = value;
        setForm(form);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form)
    }

  return (
      <div className="App">
          <div className="container">
              <div className="order-md-1">
                  <br/>
                  <form className="needs-validation" noValidate="" onSubmit={handleSubmit} >
                      <div className="row">
                          <div className="col-md-6 mb-3">
                              <label htmlFor="firstName">Pickup</label>
                              <Address
                                  id="pickup"
                                  tabIndex="0"
                                  name="pickup"
                                  value={form.pickup}
                                  onChange={(name, value) => {
                                      handleChange(name, value);
                                  }}
                              />
                          </div>
                          <div className="col-md-6 mb-3">
                              <label htmlFor="lastName">Drop Off</label>
                              <Address
                                  id="drop_off"
                                  tabIndex="1"
                                  name="drop_off"
                                  value={form.drop_off}
                                  onChange={(name, value) => {
                                      handleChange(name, value);
                                  }}
                              />
                          </div>
                      </div>

                      <div className="row">
                          <div className="col-md-4 mb-3">
                              <label htmlFor="lastName">Vehicle type</label>
                              <select
                                  className="custom-select d-block w-100"
                                  name="vehicle_type"
                                  value={form.vehicle_type}
                                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                              >
                                  <option value="">Choose...</option>
                                  {Object.keys(vehicleTypes).map((key) => (
                                      < option key={key} value={key}>{vehicleTypes[key]}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="col-md-4 mb-3">
                              <label htmlFor="lastName">Total weight</label>
                              <input
                                  type="text"
                                  className="form-control"
                                  name="total_weight"
                                  value={form.total_weight}
                                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                              />
                              <div className="invalid-feedback">
                                  Total weight is required.
                              </div>
                          </div>
                          <div className="col-md-4 mb-3">
                              <button className="searchBtn btn btn-primary btn-sm" type="submit" >
                                  Search
                              </button>
                          </div>
                      </div>

                      <hr className="mb-4" />
                      <div className="col-md-12">
                          <div
                              className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                              <div id="infoDiv" className="col-md-8 p-4 d-flex flex-column position-static">
                                  <p>Total distance: 100km</p>
                                  <p>Estimated runtime(no of hours): 24h </p>
                                  <p>Fuel consumption: 100km</p>
                                  <p>Fuel efficiency: 100km</p>
                                  <strong>Carbon emission: 100km</strong>
                              </div>
                              <div id="map" className="col-md-4 d-none d-lg-block">
                                  <Map
                                      route={''}
                                      stops={[]}
                                      // current={shipment.geometry.current_location}
                                      // icon={shipment.geometry.outdated ? '/img/content/marker-outdated.png?v1' : '/img/content/marker-current.png?v1'}
                                      // actualRoute={shipment.geometry.actual_route}
                                      /*currentTooltip={(shipment.fleet && (shipment.fleet.truck || shipment.fleet.trailer))
                                          && `<p><i class="svg svg-type-truck svg-gray-light"/> ${shipment.fleet.truck ? shipment.fleet.truck.license_plate : 'N/A'}</p>
                    <p><i class="svg svg-type-trailer svg-gray-light"/> ${shipment.fleet.trailer ? shipment.fleet.trailer.license_plate : 'N/A'}</p>`}*/
                                  />
                              </div>
                          </div>
                      </div>
                  </form>
              </div>

              <footer className="my-5 pt-5 text-muted text-center text-small">
                  <p className="mb-1">© 2022-2022 - (2b || !2b)?</p>
              </footer>
          </div>
      </div>
  );
}

export default App;
