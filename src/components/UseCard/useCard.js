import React, { Fragment, useState, useEffect } from 'react';
import './use.scss';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Menu } from '@material-ui/core';

const UseCard = () => {
    const [line, setLine] =  useState(0);
    const [cardNumber, setCardNumber] = useState('');
    const [cardDetails, setCardDetails] = useState({});
    const [stationList, setStationList] = useState([]);
    const [entry, setEntry] = useState(0);
    const [exit, setExit] = useState(0);

    useEffect(() => {
        const URL = '/Card/stations';
        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        axios.get(URL, options).then(response => {
            setStationList(response.data);
        });
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const cardDetailsURL = '/Card/cardDetails';
        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        axios.get(cardDetailsURL, { params: {'cardID': cardNumber} } ,options).then(response => {
            if(!response.data) {
                Swal.fire({
                    title: 'Invalid Card Number',
                    icon: 'error',
                    showConfirmButton: true,
                    showCancelButton: false,
                    allowOutsideClick: false
                });
            } else {
                setCardDetails(response.data);
                const card_details = response.data;
                const baseFare = stationList.filter(station => station.station_number === entry)[0].fares[exit];
                let discountPercentage = 0;
                const additionalDiscount  = card_details.history.filter(hist =>  new Date(hist).toDateString() === new Date().toDateString());
                if (additionalDiscount.length > 0) {
                    if((additionalDiscount.length - 1) >= 4) {
                        discountPercentage += 12;
                    } else {
                        discountPercentage += ((additionalDiscount.length - 1) * 3)
                    }
                }

                if(card_details.type === 'Discounted') {
                    discountPercentage += 20;
                }
                let totalFare = 0;
                if(discountPercentage > 0) {
                    totalFare = baseFare - (baseFare * (discountPercentage / 100));
                } else {
                    totalFare = baseFare;
                }
               
                if(totalFare > card_details.value) {
                    Swal.fire({
                        title: 'Insufficient Card Balance, Please reload',
                        html: 'Card Balance: <b>' + card_details.value +'</b><br />' +
                              'Total Fare: <b>' + totalFare + '</b>',
                        icon: 'error',
                        showConfirmButton: true,
                        showCancelButton: false,
                        allowOutsideClick: false
                    });
                } else {
                    const updateBalanceURL = '/Card/updateCardBalance';
                    const body = {
                        cardID: cardNumber,
                        remainingValue: card_details.value - totalFare
                    }

                    axios.post(updateBalanceURL, body, options).then(response => {
                        Swal.fire({
                            title: 'Thank you for using Q-Less-Transport',
                            html: 'Remaining Card Balance: <b>' + (card_details.value - totalFare) +'</b><br />' +
                                  'Total Fare: <b>' + totalFare + '</b>',
                            icon: 'success',
                            showConfirmButton: true,
                            showCancelButton: false,
                            allowOutsideClick: false
                        });
                    })
                }
                
            }
        });
    }


    return(<Fragment>
        <div className="use_container">
            <form onSubmit={handleSubmit}>
                <h3>Q-Less Transport Station</h3>
                <br />
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Select Route</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        style={{ marginBottom: '12px', width: '400px' }}
                        value={line}
                        onChange={(e) => setLine(e.target.value)}
                        required
                    >
                        <MenuItem value={1}>MRT LINE 1</MenuItem>
                        <MenuItem value={2}>MRT LINE 2</MenuItem>
                    </Select>
                </FormControl>
                <br />
                {line !== 0 && stationList !== [] &&
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Station Entry</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        style={{ marginBottom: '12px', width: '400px' }}
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        required
                    >
                        {stationList.filter(item => item.line === line).map(station => {
                            const key = 'entry'+ station.station_number
                            return(<MenuItem key={key} value={station.station_number}>{station.name}</MenuItem>)
                        })}
                    </Select>
                </FormControl>}
                <br />
                {line !== 0 && stationList !== [] &&
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Station Exit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        style={{ marginBottom: '12px', width: '400px' }}
                        value={exit}
                        onChange={(e) => setExit(e.target.value)}
                        required
                    >
                        {stationList.filter(item => item.line === line).map(station => {
                            const key = 'entry'+ station.station_number
                            return(<MenuItem key={key} value={station.station_number}>{station.name}</MenuItem>)
                        })}
                    </Select>
                </FormControl>}
                <br />
                {line !== 0 && stationList !== [] &&
                <TextField 
                    label="Card Number" 
                    variant="outlined" 
                    fullWidth
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ marginBottom: '12px', width: '400px' }}
                />}
                <br />
                <Button variant="contained" color="primary" style={{ width: '400px' }} type="submit">
                    Pay Now
                </Button>
            </form>
        </div>
    </Fragment>);
}

export default UseCard;