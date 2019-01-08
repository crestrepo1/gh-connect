import React from 'react';
import { Link } from 'react-router-dom';
import Centering from '~/common/components/Centering';

// Import Components
import Logo from '~/common/components/Logo';

// Import Local Styles
import styles from './header.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <Centering>
                <Logo />
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
            </Centering>
        </header>
    );
};

export default Header;
