import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import configs from '../../../../configs';

import stationsService from '../../../../services/stationsService';
import Button from '../../../button/Button.jsx';
import PaginatedItems from '../../../paginateditems/PaginatedItems.jsx';
import StationList from './StationList.jsx';

function Stations() {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllStations = async () => {
            try {
                const res = await stationsService.getActiveServiceStations();

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setStations(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        getAllStations();
    }, []);

    return (
        <div className='flex flex-1 flex-col items-center px-0 md:px-4'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách trạm dịch vụ
            </h1>
            <div className='relative m-5 w-max bg-white md:w-full'>
                <div className='absolute left-0 top-0 flex -translate-y-full items-center gap-2'>
                    <Button
                        circle
                        className='bg-primary text-white hover:bg-primary-dark active:bg-primary'
                        onClick={() =>
                            navigate(configs.routes.admin.station.create, {
                                state: {
                                    from: window.location.pathname,
                                },
                            })
                        }
                    >
                        <svg
                            fill='currentColor'
                            className='w-6'
                            id='Layer_1'
                            version='1.1'
                            viewBox='0 0 512 512'
                            width='512px'
                            xmlSpace='preserve'
                            xmlns='http://www.w3.org/2000/svg'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                        >
                            <path d='M417.4,224H288V94.6c0-16.9-14.3-30.6-32-30.6c-17.7,0-32,13.7-32,30.6V224H94.6C77.7,224,64,238.3,64,256  c0,17.7,13.7,32,30.6,32H224v129.4c0,16.9,14.3,30.6,32,30.6c17.7,0,32-13.7,32-30.6V288h129.4c16.9,0,30.6-14.3,30.6-32  C448,238.3,434.3,224,417.4,224z' />
                        </svg>
                    </Button>
                    <span>Thêm mới</span>
                </div>
                <PaginatedItems data={stations} itemsPerPage={6} size={8}>
                    <StationList className='w-full table-auto border-collapse border-2 border-primary-light p-8' />
                </PaginatedItems>
            </div>
        </div>
    );
}

Stations.propTypes = {};

export default Stations;
