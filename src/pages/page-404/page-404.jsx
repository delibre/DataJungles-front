import './page-404.scss'

import {Link} from 'react-router-dom';

const Page404 = () => {
    return (
        <div className='error-page'>
            <p className='error-message'>Page not found</p>
            <Link className='home-page-link' to="/folder/1">Return on main page</Link>
        </div>
    )
}

export default Page404;