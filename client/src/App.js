import {useEffect, useState} from "react";
import './App.css';

function handleSubmit() {
    alert('clciked')
}

function App() {
    const [form, setForm] = useState({
        'pickup': '',
        'drop_off': '',
        'total_weight': '',
        'vehicle_type': '',
    })

    const test = (e) => {
        console.log(form, 'form')

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
                              <input type="text" className="form-control" id="pickup" placeholder="" value={form.pickup}
                                     onChange={test.bind()} required="" />
                          </div>
                          <div className="col-md-6 mb-3">
                              <label htmlFor="lastName">Drop Off</label>
                              <input type="text" className="form-control" id="lastName" placeholder="" value=""
                                     required="" />
                              <div className="invalid-feedback">
                                  Drop off is required.
                              </div>
                          </div>
                      </div>

                      <div className="row">
                          <div className="col-md-4 mb-3">
                              <label htmlFor="lastName">Vehicle type</label>
                              <input type="text" className="form-control" id="lastName" placeholder="" value=""
                                     required="" />
                              <div className="invalid-feedback">
                                  Vehicle type is required.
                              </div>
                          </div>
                          <div className="col-md-4 mb-3">
                              <label htmlFor="lastName">Total weight</label>
                              <input type="text" className="form-control" id="lastName" placeholder="" value=""
                                     required="" />
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
                                  Show map here
                              </div>
                          </div>
                      </div>
                  </form>
              </div>

              <footer className="my-5 pt-5 text-muted text-center text-small">
                  <p className="mb-1">© 2017-2018 Company Name</p>
                  <ul className="list-inline">
                      <li className="list-inline-item"><a
                          href="https://getbootstrap.com/docs/4.0/examples/checkout/#">Privacy</a></li>
                      <li className="list-inline-item"><a
                          href="https://getbootstrap.com/docs/4.0/examples/checkout/#">Terms</a></li>
                      <li className="list-inline-item"><a
                          href="https://getbootstrap.com/docs/4.0/examples/checkout/#">Support</a></li>
                  </ul>
              </footer>
          </div>
      </div>
  );
}

export default App;
