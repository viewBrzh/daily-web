import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
    href: string;
    isShowBack: boolean;
}

const ReturnButton: React.FC<Props> = ({ href, isShowBack }) => {
    const router = useRouter();

    return (
        <>
            <button className='back' onClick={() => router.push(href)}>
                <FontAwesomeIcon icon={faChevronLeft} /> 
                {isShowBack ? ' Back' : ''}
            </button>
        </>
    );
};

export default ReturnButton;
