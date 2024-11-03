import { PropTypes } from 'prop-types';

import Button from '../button';

function SuccessPopup({ title, content, onClosed }) {
    return (
        <div
            tabIndex='-1'
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
        >
            <div className='relative flex max-h-full w-full max-w-2xl justify-center p-4'>
                <div className='relative w-64 rounded-lg bg-white shadow'>
                    <div className='flex flex-col items-center justify-center space-y-4 py-4'>
                        <div className='flex w-full justify-center'>
                            <svg
                                className='h-20 text-green-light'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M9.83585 2.03398C9.94837 2.07226 10.0583 2.11779 10.1649 2.17028L11.4477 2.80183C11.7958 2.97323 12.2038 2.97323 12.5519 2.80183L13.8347 2.17028C15.1972 1.49942 16.8457 2.06018 17.5165 3.42276L17.59 3.58509L17.6528 3.75183L18.1133 5.10543C18.2383 5.4728 18.5268 5.7613 18.8941 5.88627L20.2477 6.34673C21.6856 6.83585 22.4547 8.39799 21.9656 9.83585C21.9273 9.94837 21.8818 10.0583 21.8293 10.1649L21.1977 11.4477C21.0263 11.7958 21.0263 12.2038 21.1977 12.5519L21.8293 13.8347C22.5002 15.1972 21.9394 16.8457 20.5768 17.5165C20.4702 17.569 20.3603 17.6146 20.2477 17.6528L18.8941 18.1133C18.5268 18.2383 18.2383 18.5268 18.1133 18.8941L17.6528 20.2477C17.1637 21.6856 15.6016 22.4547 14.1637 21.9656C14.0512 21.9273 13.9413 21.8818 13.8347 21.8293L12.5519 21.1977C12.2038 21.0263 11.7958 21.0263 11.4477 21.1977L10.1649 21.8293C8.80233 22.5002 7.15389 21.9394 6.48303 20.5768C6.43053 20.4702 6.385 20.3603 6.34673 20.2477L5.88627 18.8941C5.7613 18.5268 5.4728 18.2383 5.10543 18.1133L3.75183 17.6528C2.31396 17.1637 1.54486 15.6016 2.03398 14.1637C2.07226 14.0512 2.11779 13.9413 2.17028 13.8347L2.80183 12.5519C2.97323 12.2038 2.97323 11.7958 2.80183 11.4477L2.17028 10.1649C1.49942 8.80233 2.06018 7.15389 3.42276 6.48303C3.52939 6.43053 3.63931 6.385 3.75183 6.34673L5.10543 5.88627C5.4728 5.7613 5.7613 5.4728 5.88627 5.10543L6.34673 3.75183C6.83585 2.31396 8.39799 1.54486 9.83585 2.03398ZM15.4695 8.96946L10.0502 14.3887L8.07595 12.0197C7.81078 11.7014 7.33786 11.6584 7.01965 11.9236C6.70144 12.1888 6.65845 12.6617 6.92362 12.9799L9.42362 15.9799C9.70596 16.3187 10.2183 16.342 10.5301 16.0301L16.5301 10.0301C16.823 9.73722 16.823 9.26235 16.5301 8.96946C16.2372 8.67657 15.7624 8.67657 15.4695 8.96946Z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                        <div className='w-full overflow-hidden px-2 text-center text-xl font-bold capitalize'>
                            {title}
                        </div>
                        <div className='overflow-hidden px-2 text-center'>{content}</div>
                    </div>

                    <div className='flex items-center rounded-b border-t border-gray-200 p-4 md:p-5 dark:border-gray-600'>
                        <Button
                            className='w-full font-medium'
                            rounded
                            onClick={onClosed}
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

SuccessPopup.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onClosed: PropTypes.func.isRequired,
};

export default SuccessPopup;
