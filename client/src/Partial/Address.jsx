import React, {useEffect, useState} from 'react';
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import apiConsumer from "../helper/apiConsumer";

const Address = ({name, onChange}) => {
    const [selected, setSelected] = useState([]);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (query) => {
        setIsLoading(true);

        apiConsumer(
            getUrl(query),
            {
                headers: {
                    'Access-Control-Allow-Origin': 'http://www.frida.vm',
                    'Accept-Language': 'en_US',
                }
            }
        )
            .then((response) => response.json()
                .then((addresses) => ({
                    headers: response.headers,
                    addresses,
                })))
            .then((response) => {
                const tempOptions = [];
                response.addresses.suggestions.forEach(address => {
                    tempOptions.push(address.label);
                });
                setOptions(tempOptions);
            });
    }

    const getUrl = (query) => {
        return `http://taas.frida.vm/v2/addresses/search?q=${query}&r=null`;
    }

    useEffect(() => {
        onChange(name, selected[0]);
    }, [selected])

    const filterBy = () => true;

    return (
        <div>
            <AsyncTypeahead
                selected={selected}
                onChange={setSelected}
                filterBy={filterBy}
                id="async-example"
                isLoading={isLoading}
                labelKey="login"
                minLength={3}
                onSearch={handleSearch}
                options={options}
                placeholder="Search for an address..."
                renderMenuItemChildren={(option) => (<>{option}</>)}
            />
        </div>
    );
}

export default Address;
