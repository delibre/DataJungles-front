import './page-404.scss'

import {Link} from 'react-router-dom';

const Page404 = () => {
    return (
        <div className='error-page'>
            <p className='error-message'>Strona nie istnieje</p>
            <Link className='home-page-link' to="/folder/1">Wróć do strony głównej</Link>
        </div>
    )
}

export default Page404;