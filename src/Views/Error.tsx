import React from 'react';

function ErrorPage() {
    return (
        <div className='d-flex justify-content-center mt-5'>
            <div className="col"></div>
            <div className='col-sm-11 col-md-6 p-3 rounded shadow-lg bg-white'>
                <h4 className="display-4 text-center">Ops!</h4>
                <p className="lead text-center">
                    Page Not Found <br/>
                </p>
                <button className="btn btn-lg btn-primary">Home</button>
            </div>
            <div className="col"></div>
        </div>
    );
}

export default ErrorPage;