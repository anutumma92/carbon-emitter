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
            {entities.map(( {total_distance, route, travel_time, fuel_consumption, fuel_efficiency, co2e, status}, index) => (
                <div key={index} className="col-md-12">
                    <div
                        className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                        <div id="infoDiv" className="col-md-8 p-4 d-flex flex-column position-static">
                            {status && <img className={status} src={`../../img/${status}.png`} />}
                            <p>{`Total distance(km): ${total_distance}`}</p>
                            <p>{`Estimated runtime(hr): ${travel_time}`}</p>
                            <p>{`Fuel consumption(l): ${fuel_consumption}`}</p>
                            <p>{`Fuel efficiency(km/l): ${fuel_efficiency}`}</p>
                            <strong>{`Carbon Dioxide Equivalent(kg): ${co2e.co2e_total}`}</strong>
                            <p>
                                {co2e.co2 && `Carbon Dioxide(kg): ${co2e.co2}`}
                                <br/>
                            {co2e.ch4 && `Methane(kg): ${co2e.ch4}`}
                            <br/>
                                {co2e.n2o && `Nitrogen oxide(kg): ${co2e.n2o}`}</p>

                        </div>
                        <div id="map" className="col-md-4 d-none d-lg-block">
                            <Map
                                route={route}
                                stops={[]}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default List;
