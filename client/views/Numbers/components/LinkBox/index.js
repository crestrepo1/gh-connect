// import dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import images
import tollfree from '~/common/images/tollfree.svg';
import local from '~/common/images/local.svg';

// import stylesheet
import styles from './link-box.css';

const LinkBox = ({ to, type, id }) => {
    return (
        <Link
            className={styles.linkbox}
            id={id}
            to={to}
        >
            <h1>
                {type === 'Toll Free' ? 'Toll Free' : '' }
                {type === 'Local' ? 'Local' : '' }
            </h1>
            {type === 'Toll Free' ?
                <img
                    alt="tollfree badge"
                    src={tollfree}
                />
                :
                null
            }
            {type === 'Local' ?
                <img
                    alt="local badge"
                    src={local}
                />
                :
                null
            }
            <p>
                {type === 'Toll Free' ? 'Look bigger, national, and more established; customize a number, or let us generate one.' : '' }
                {type === 'Local' ? 'Connect with your community by choosing a number with a local area code.' : '' }
            </p>
            <section>
                {type === 'Toll Free' ? 'Get a Toll Free Number »' : '' }
                {type === 'Local' ? 'Get a Local Number »' : '' }
            </section>
        </Link>
    );
};

LinkBox.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    figure: PropTypes.string
};

export default LinkBox;
