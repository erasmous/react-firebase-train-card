import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

import './createCard.scss';

const CreateCard = () => {
    const handleCreate = async () => {
        const url = '/Card/createCard';
        const options = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        await axios.post(url, options).then(response => {
            Swal.fire({
                title: 'Card Created Succesfully',
                html: 
                    'Card Number: <b>' + response.data + '</b> <br />' +
                    'Card Type: <b>Regular</b><br />' +
                    'Card Value: <b>100</b>',
                icon: 'success',
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false
            });
        });

    }
    return(<Fragment>
        <div className="create_container">
            <Button variant="contained" color="primary" onClick={handleCreate}>
                Create Q-Less Transport Card
            </Button>
        </div>
    </Fragment>);
}

export default CreateCard;