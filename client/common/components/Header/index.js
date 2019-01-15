import React from 'react';
import { Link } from 'react-router-dom';

// Import images
import logo from '~/common/images/grasshopper_logo.png';

// Import Local Styles
import styles from './header.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <section className={styles.header__wrapper}>
                <a className={styles['logo-link']} href="http://grasshopper.com">
                    <img
                        alt="Grasshopper"
                        className={styles['logo-img']}
                        src={logo}
                        title="Grasshopper"
                    />
                </a>
                <aside>
                    <Link
                        className={styles.support}
                        target="_blank"
                        to="https://support.grasshopper.com/"
                    >
                        24/7 Support (800) 279-1455
                    </Link>
                    <Link className={styles.tel} to="tel:8002791455">
                        (800) 279-1455
                    </Link>
                </aside>
            </section>
        </header>
    );
};

export default Header;
