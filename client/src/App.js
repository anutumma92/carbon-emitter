import { useState } from "react";
import './App.css';
import Address from "./Partial/Address";
import apiConsumer from "./helper/apiConsumer";
import List from "./List";

const vehicleTypes = {
    'freight_vehicle_wtt-vehicle_type_van-fuel_source_diesel-vehicle_weight_1.305t_lt_1.74t': 'Diesel van (up to 3.5 tonnes)',
    'freight_vehicle-vehicle_type_hgv_rigid-fuel_source_diesel-vehicle_weight_gt_3.5t_lt_7.5t-percentage_load_100': 'Diesel rigid HGV (>3.5 - 7.5 tonnes)',
    'freight_vehicle-vehicle_type_hgv_rigid-fuel_source_diesel-vehicle_weight_gt_17t-percentage_load_100': 'Diesel rigid HGV (>17t)',
    'freight_vehicle-vehicle_type_hgv_articulated-fuel_source_diesel-vehicle_weight_gt_33t-percentage_load_10': 'Diesel articulated HGV (>33t)',
    'freight_vehicle-vehicle_type_hgv_articulated_refrig-fuel_source_diesel-vehicle_weight_gt_33t-percentage_load_100': 'Diesel refrigerated articulated HGV (>33t)'
}

function App() {
    const [form, setForm] = useState({
        'pickup': undefined,
        'drop_off': undefined,
        'total_weight': undefined,
        'vehicle_type': undefined,
    });

    const [result, setResult] = useState([]);

    const handleChange = (field, value) => {
        form[field] = value;
        setForm(form);
    }

    const handle = (e) => {
        console.log(e)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchRows();
    }

    const fetchRows = () => {
        apiConsumer(
            'http://localhost:4040/route/calculate',
            {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:4040',
                }
            })
            .then((response) => response.json())
            .then(({success, data, error_message}) => {
                if (!success && error_message !== '') {
                    alert('Oops, Something wrong with the API');

                    return false;
                }

                setResult(data);
            });
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
                                  defaultValue={form.vehicle_type}
                                  onChange={(e) => {
                                      handleChange(e.target.name, e.target.value)
                                  }}
                              >
                                  <option value="">Choose...</option>
                                  {Object.keys(vehicleTypes).map((key) => (
                                      < option checked key={key} value={key}>{vehicleTypes[key]}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="col-md-4 mb-3">
                              <label htmlFor="lastName">Total weight(kg)</label>
                              <input
                                  type="number"
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
                      <List entities={result} />
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
