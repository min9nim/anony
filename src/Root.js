import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './AppRoute';

const Root = () => (
    <BrowserRouter>
        <AppRoute/>
    </BrowserRouter>
);

export default Root;