import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs.jsx';
import Button from '@/src/components/button/Button.jsx';
import StationList from '@/src/components/pages/admin/Station/StationList.jsx';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs.js';
import stationsService from '@/src/services/stationsService';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

function Stations() {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Dashboard',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.stations,
                label: 'Danh sách trạm dịch vụ',
            },
        ]);
    }, [setBreadcrumbsData]);

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

    const handleClickCreate = useCallback(() => {
        navigate(configs.routes.admin.station.create, {
            state: {
                from: window.location.pathname,
            },
        });
    }, []);

    return (
        <div className='flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

                <Button rounded onClick={handleClickCreate} className='h-10'>
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
                    <span>Thêm mới</span>
                </Button>
            </div>

            {/* <div className='mb-8 w-full overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]'>
                <h2 className='border-b-2 px-4 py-2 font-bold'>
                    Bộ lọc tìm kiếm
                </h2>
                <div className='grid w-full grid-cols-6 gap-4 p-8'>
                    <div className='col-span-3 flex w-full gap-2 mb-20'>
                        <div className='flex-1'>
                            <Input
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                                placeholder='Bạn cần tìm kiếm gì?'
                            />
                        </div>
                        <Button rounded className='h-full'>
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div> */}

            <StationList
                data={stations}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

Stations.propTypes = {};

export default Stations;
