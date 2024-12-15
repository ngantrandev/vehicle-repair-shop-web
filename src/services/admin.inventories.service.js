import httpRequest from '@/src/ultils/httpRequest';

const importGoods = async (data) => {
    try {
        const res = await httpRequest.post('/admin/inventories/import-goods', data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

const adminInventoryService = {
    importGoods,
};

export default adminInventoryService;