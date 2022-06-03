import Map from "./Partial/Map";

const status = {
    'greenest': 'greenest',
    'fastest': 'fastest',
    'cheapest': 'cheapest',
}

const List = ({entities}) => {
    if (entities.length <= 0) {
        return;
    }

    return (
        <>
            {entities.map(({total_distance, route, travel_time, fuel_consumption, fuel_efficiency, co2e, status}) => (
                <div className="col-md-12">
                    <div
                        className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                        {status && <img className={status} src={`../../img/${status}.png`} />}
                        <div id="infoDiv" className="col-md-8 p-4 d-flex flex-column position-static">
                            <p>{`Total distance(in kilometers): ${total_distance}`}</p>
                            <p>{`Estimated runtime(in hours): ${travel_time}`}</p>
                            <p>{`Fuel consumption(in liters): ${fuel_consumption}`}</p>
                            <p>{`Fuel efficiency(in kilometers/liter): ${fuel_efficiency}`}</p>
                            <strong>{`Carbon emission(in kilograms): ${co2e.co2e_total}`}</strong>
                            <p></p>

                        </div>
                        <div id="map" className="col-md-4 d-none d-lg-block">
                            <Map
                                route={route}
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
            ))}
        </>
    )
}

export default List;
