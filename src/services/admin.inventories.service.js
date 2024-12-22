import httpRequest from '@/src/ultils/httpRequest';

const getImportNotes = async (params) => {
    try {
        const res = await httpRequest.get(
            '/admin/inventories/imports-note',
            params
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getExportNotes = async (params) => {
    try {
        const res = await httpRequest.get(
            '/admin/inventories/exports-note',
            params
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const importGoods = async (data) => {
    try {
        const res = await httpRequest.post(
            '/admin/inventories/import-goods',
            data
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const adminInventoryService = {
    importGoods,
    getImportNotes,
    getExportNotes,
};

export default adminInventoryService;
