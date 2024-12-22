import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import adminInventoryService from '@/src/services/admin.inventories.service';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import ImportNoteList from './ImportNoteList';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function ImportNote() {
    const { setBreadcrumbsData } = useBreadcrumbs();
    const [notes, setNotes] = useState([]);
    const [filtedNotes, setFilteredNotes] = useState([]);
    const [timeRange, setTimeRange] = useState(null);
    const [selectValue, setSelectValue] = useState('');

    const handleChangeTime = (value) => {
        setTimeRange(value);
    };

    useEffect(() => {
        if (timeRange) {
            const startDate = dayjs(timeRange[0]).format('YYYY-MM-DD');
            const endDate = dayjs(timeRange[1]).format('YYYY-MM-DD');

            const newFilteredData = [];

            notes.forEach((element) => {
                if (
                    element.date_input >= startDate &&
                    element.date_input <= endDate
                ) {
                    newFilteredData.push(element);
                }
            });

            setFilteredNotes(newFilteredData);
        } else {
            setFilteredNotes(notes);
        }
    }, [timeRange, notes]);

    useEffect(() => {
        if (selectValue == 'high') {
            const newFilteredData = [...notes].sort(
                (a, b) => b.total_price - a.total_price
            );
            setFilteredNotes(newFilteredData);
        } else if (selectValue == 'low') {
            const newFilteredData = [...notes].sort(
                (a, b) => a.total_price - b.total_price
            );
            setFilteredNotes(newFilteredData);
        } else {
            setFilteredNotes(notes);
        }
    }, [selectValue, filtedNotes, notes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminInventoryService.getImportNotes();
                const resData = res.data;

                setNotes(resData.data);
                setFilteredNotes(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.users,
                label: 'Danh sách phiếu nhập',
            },
        ]);
    }, [setBreadcrumbsData]);

    return (
        <div className='flex h-full flex-1 flex-col bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />
            </div>

            <div className='mb-8 w-full overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]'>
                <h2 className='border-b-2 px-4 py-2 font-bold'>
                    Bộ lọc tìm kiếm
                </h2>
                <div className='grid w-full grid-cols-6 gap-4 p-8'>
                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='time'>Ngày nhập</label>
                        <RangePicker
                            value={timeRange}
                            onChange={handleChangeTime}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            className='h-10 border-2 border-neutral-500'
                        />
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label htmlFor='state'>Giá trị</label>
                        <select
                            name=''
                            id='state'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            value={selectValue}
                            onChange={(e) => setSelectValue(e.target.value)}
                        >
                            <option value=''>Tất cả</option>
                            <option value='high'>Cao nhất</option>
                            <option value='low'>Thấp nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            <ImportNoteList
                data={filtedNotes}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

export default ImportNote;
