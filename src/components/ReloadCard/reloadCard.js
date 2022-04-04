import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './reloadCard.scss';

const ReloadCard = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [loadAmount, setLoadAmount] = useState(0);
    const [cashAmount, setCashAmount] = useState(0);
    const [change, setChange] = useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const cardDetailsURL = '/Card/cardDetails';
        const loadCardURL = '/Card/loadCard';
        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        let cardDetails = null;

        axios.get(cardDetailsURL, { params: {'cardID': cardNumber} } ,options).then(response => {
            if(!response.data) {
                
                Swal.fire({
                    title: 'Invalid Card Number',
                    icon: 'error',
                    showConfirmButton: true,
                    showCancelButton: false,
                    allowOutsideClick: false
                });
                return;
            } else { 
                cardDetails = response.data;
                const newLoadAmount = parseInt(cardDetails.value) + parseInt(loadAmount)
                const body = {
                    'cardID': cardNumber, 
                    'newLoadAmount': newLoadAmount
                };
        
                axios.post(loadCardURL, body, options).then(response => {
                    Swal.fire({
                        title: 'Card Created Succesfully',
                        html: 
                            'Card Number: <b>' + cardNumber + '</b> <br />' +
                            'Previous Load Balance: <b>'+ cardDetails.value + '</b><br />' +
                            'New Load Balance: <b>'+ newLoadAmount + '</b>',
                        icon: 'success',
                        showConfirmButton: true,
                        showCancelButton: false,
                        allowOutsideClick: false
                    });
                })
                setCardNumber('');
                setLoadAmount(0);
                setCashAmount(0);
            }
        });

    }
    const handleChangeCashAmount = (value) => {
        setCashAmount(value);
        const totalChange = value - loadAmount;
        if(totalChange < 0) {
            setChange('Insufficient Cash Amount');
        } else {
            setChange(totalChange);
        }
        
    }
    return(<Fragment>
        <div className="reload_container">
            <form onSubmit={handleSubmit}>
            <h3>Reload Card</h3>
            <br />
            <TextField 
                label="Card Number" 
                variant="outlined" 
                fullWidth
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{ marginBottom: '12px', width: '300px' }}
             />
            <br />
            <TextField 
                label="Load Amount" 
                variant="outlined" 
                type="number"
                fullWidth
                required
                InputProps={{ inputProps: { min: 100, max: 10000 } }}
                value={loadAmount}
                onChange={(e) => setLoadAmount(e.target.value)}
                style={{ marginBottom: '12px', width: '300px' }}
             />   
             <br />
            <TextField 
                label="Cash Amount" 
                variant="outlined" 
                type="number"
                fullWidth
                required
                InputProps={{ inputProps: { min: loadAmount, max: 10000 } }}
                value={cashAmount}
                onChange={(e) => handleChangeCashAmount(e.target.value)}
                style={{ marginBottom: '12px', width: '300px' }}
             /> 
             <br />
            <span>Total Change: {change}</span>
             <br /><br />
            <Button variant="contained" color="primary" style={{ width: '300px' }} type="submit">
                Reload Card
            </Button>          
            </form>
        </div>
    </Fragment>);
}

export default ReloadCard;