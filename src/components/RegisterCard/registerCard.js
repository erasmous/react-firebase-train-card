import React, { Fragment, useState } from 'react';
import './registerCard.scss';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegisterCard = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [pwdNumber, setPwdNumber] = useState('');
    const [seniorNumber, setSeniorNumber] = useState('');
    const [verification, setVerification] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const cardDetailsURL = '/Card/cardDetails';
        const registerCardUrl = '/Card/registerCard';
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
                if(cardDetails.type !== 'Regular') {
                    Swal.fire({
                        title: 'Card already registered as discounted.',
                        icon: 'info',
                        showConfirmButton: true,
                        showCancelButton: false,
                        allowOutsideClick: false
                    });
                    return; 
                }
                if(Date.now() > Date.parse(cardDetails.registration_period)) {
                    Swal.fire({
                        title: 'Card registration period lapsed.',
                        icon: 'info',
                        showConfirmButton: true,
                        showCancelButton: false,
                        allowOutsideClick: false
                    });
                    return; 
                }
                axios.post(registerCardUrl, { 'cardID': cardNumber }, options).then(response => {
                    Swal.fire({
                        title: 'Card Discount Succesfully Applied',
                        icon: 'success',
                        showConfirmButton: true,
                        showCancelButton: false,
                        allowOutsideClick: false
                    });
                    setCardNumber('');
                    setPwdNumber('');
                    setSeniorNumber('');
                    setVerification('');
                })
            }
        });
    }



    return(<Fragment>
        <div className="register_container">
            <form onSubmit={handleSubmit}>
                <h3>Discounted Card Registration</h3>
                <br />
                <TextField 
                    label="Card Number" 
                    variant="outlined" 
                    fullWidth
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ marginBottom: '12px', width: '400px' }}
                />
                <br />
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Proof of Verification</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        style={{ marginBottom: '12px', width: '400px' }}
                        value={verification}
                        onChange={(e) => setVerification(e.target.value)}
                        required
                    >
                        <MenuItem value={'Senior'}>Senior Citizen ID</MenuItem>
                        <MenuItem value={'PWD'}>PWD ID</MenuItem>
                    </Select>
                </FormControl>
                <br />
                {verification === 'Senior' && 
                <MaskedInput
                    mask={[ /[1-9]/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    className="form-control"
                    placeholder="Senior Citizen ID Number"
                    value={seniorNumber}
                    onChange={(e) => setSeniorNumber(e.target.value)}
                    required
                />}
                {verification === 'PWD' && 
                <MaskedInput
                    mask={[ /[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    className="form-control"
                    placeholder="PWD ID Number"
                    value={pwdNumber}
                    onChange={(e) => setPwdNumber(e.target.value)}
                    required
                />}
                <br />
                <Button variant="contained" color="primary" style={{ width: '400px' }} type="submit">
                    Register Card
                </Button> 
                <br />
            </form>
        </div>
    </Fragment>);
}

export default RegisterCard;