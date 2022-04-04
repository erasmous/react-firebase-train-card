import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return(<Fragment>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="text-link" to="/">
                    <a className="navbar-brand" href="#">Q-LESS Transport</a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="text-link" to="/createCard">
                                <a className="nav-link active" href="#">Create Card</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="text-link" to="/useCard">
                                <a className="nav-link active" href="#">Use Card</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="text-link" to="/reloadCard">
                                <a className="nav-link active" href="#">Reload Card</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="text-link" to="/registerCard">
                                <a className="nav-link active" href="#">Discounted Card Registration</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </Fragment>);
}

export default NavigationBar;