import { toast } from 'react-toastify';
import { RedisHandlerURL } from "../contract/contract_config";
const axios = require('axios');


const FetchRequests = async (address, request_type) => {
    try {
        var bodyFormData = new FormData();
        // bodyFormData.set('channel_id', channelId);
        bodyFormData.set('address', address);
        bodyFormData.set('request_type', request_type);
        const resp = await axios({
            method: 'post',
            url: RedisHandlerURL + '/fetch_request',
            data: bodyFormData
        })
        if (resp.status === 200) {
            return resp.data;
        }
        return resp.data;
    } catch (error) {
        toast.error("Redis connectivity issue")
        console.log(error)
        return []
    }
}

const SetRequest = async (address, request_type, request_data) => {
    try {
        var bodyFormData = new FormData();
        // bodyFormData.set('channel_id', channelId);
        bodyFormData.set('address', address);
        bodyFormData.set('request_type', request_type);
        bodyFormData.set('request_data', request_data);
        const resp = await axios({
            method: 'post',
            url: RedisHandlerURL + '/set_request',
            data: bodyFormData
        })
        // if (resp.status === 200) {
        //     return [200, resp.data];
        // }
        return [resp.status, resp.data];
    } catch (error) {
        console.log("Redis connectivity issue")
        console.log(error)
        return [500, "Redis connectivity issue"];
    }
}

const UpdateRequest = async (address, request_type, index, request_data) => {
    try {
        var bodyFormData = new FormData();
        // bodyFormData.set('channel_id', channelId);
        bodyFormData.set('address', address);
        bodyFormData.set('request_type', request_type);
        bodyFormData.set('index', index);
        bodyFormData.set('request_data', request_data);
        const resp = await axios({
            method: 'post',
            url: RedisHandlerURL + '/update_request',
            data: bodyFormData
        })
        // if (resp.status === 200) {
        //     return [200, resp.data];
        // }
        return [resp.status, resp.data];
    } catch (error) {
        console.log("Redis connectivity issue")
        console.log(error)
        return [500, "Redis connectivity issue"];
    }
}

const DeleteRequest = async (address, request_type, index) => {
    try {
        var bodyFormData = new FormData();
        // bodyFormData.set('channel_id', channelId);
        bodyFormData.set('address', address);
        bodyFormData.set('request_type', request_type);
        bodyFormData.set('index', index);
        const resp = await axios({
            method: 'post',
            url: RedisHandlerURL + '/delete_request',
            data: bodyFormData
        })
        // if (resp.status === 200) {
        //     return [200, resp.data];
        // }
        return [resp.status, resp.data];
    } catch (error) {
        console.log("Redis connectivity issue")
        console.log(error)
        return [500, "Redis connectivity issue"];
    }
}

export { FetchRequests, SetRequest, UpdateRequest, DeleteRequest };